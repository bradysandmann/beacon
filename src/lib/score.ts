// Claude scoring path with a deterministic fallback.
// The wiring is real, so once Anthropic credits are added the live path activates.
// For now (and on any 401/429/insufficient_quota), the deterministic scorer runs.

import Anthropic from "@anthropic-ai/sdk";

export type RawProspect = {
  company_name: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  employee_count_est?: number | null;
  notes?: string | null;
};

export type ScoredProspect = {
  fit_score: number;
  intent_signal: "active" | "dormant" | "closed";
  claude_summary: string;
  mode: "live" | "deterministic";
};

const ICP_BRIEF = `Ideal customer: US-based local home services business in a Tier-1 metro,
between 5 and 30 employees, owner-operated or close to it, with a public website
and a steady flow of recent reviews. Disqualify if closed, voicemail-only, or
clearly outside Hillsborough County for the Plumbers Tampa FL list.`;

// Deterministic scorer: based on structured inputs, not random.
// Same input always produces the same score.
export function scoreDeterministic(p: RawProspect): ScoredProspect {
  const employees = p.employee_count_est ?? 0;
  const hasPhone = !!(p.phone && p.phone.length > 6);
  const hasWebsite = !!(p.website && p.website.includes("."));
  const hasAddress = !!(p.address && p.address.length > 5);

  let score = 30;

  if (employees >= 5 && employees <= 30) score += 32;
  else if (employees > 30) score += 12;
  else if (employees >= 1) score += 8;

  if (hasPhone) score += 12;
  if (hasWebsite) score += 12;
  if (hasAddress) score += 8;

  // gentle hash so different companies don't cluster on the same integer
  const seed = [...(p.company_name || "")].reduce((a, c) => a + c.charCodeAt(0), 0);
  score += (seed % 7) - 3;

  // Clamp
  score = Math.max(5, Math.min(98, score));

  let intent: ScoredProspect["intent_signal"] = "active";
  let summary = "";

  if (!hasPhone && !hasWebsite) {
    intent = "closed";
    score = Math.min(score, 25);
    summary = "No phone and no live website. Likely closed or unreachable.";
  } else if (employees < 3 && (!hasWebsite || !hasAddress)) {
    intent = "dormant";
    score = Math.min(score, 55);
    summary = "Very small footprint and incomplete public listing. Lower priority.";
  } else if (score >= 80) {
    intent = "active";
    summary = `Strong fit. ${employees} employees, complete public listing, signals match ICP.`;
  } else if (score >= 60) {
    intent = "active";
    summary = `Decent fit. ${employees} employees, mostly complete listing. Worth a first-touch.`;
  } else {
    intent = "dormant";
    summary = "Listing is partial or off-ICP. Slow nurture rather than a priority call.";
  }

  return { fit_score: score, intent_signal: intent, claude_summary: summary, mode: "deterministic" };
}

// Live scorer: calls Anthropic with browser-direct header.
// Falls back to deterministic on any error so the UI never blocks.
export async function scoreWithClaude(p: RawProspect, apiKey?: string): Promise<ScoredProspect> {
  const key = apiKey ?? (import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined);
  if (!key) return scoreDeterministic(p);

  try {
    const client = new Anthropic({
      apiKey: key,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        "anthropic-dangerous-direct-browser-access": "true",
      },
    });

    const message = await client.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 320,
      system:
        ICP_BRIEF +
        " Return a tight JSON object with fields: fit_score (0-100 integer), " +
        "intent_signal (one of active, dormant, closed), and summary (one short paragraph, two sentences max).",
      messages: [
        {
          role: "user",
          content: `Score this prospect. JSON only, no prose.\n\n${JSON.stringify(p, null, 2)}`,
        },
      ],
    });

    const text =
      message.content
        .filter((b): b is { type: "text"; text: string } => b.type === "text")
        .map((b) => b.text)
        .join("\n") || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no_json_returned");
    const parsed = JSON.parse(jsonMatch[0]) as Partial<ScoredProspect>;

    const fit = Math.max(0, Math.min(100, Math.round(Number(parsed.fit_score ?? 0))));
    const sig = (parsed.intent_signal === "active" || parsed.intent_signal === "dormant" || parsed.intent_signal === "closed")
      ? parsed.intent_signal
      : "active";
    const sum = String((parsed as { summary?: string }).summary ?? parsed.claude_summary ?? "").trim();

    return {
      fit_score: fit,
      intent_signal: sig,
      claude_summary: sum || "Scored by Claude. No additional summary returned.",
      mode: "live",
    };
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.warn("[beacon] Claude scoring fell back to deterministic:", err);
    return scoreDeterministic(p);
  }
}

export async function scoreBatch(items: RawProspect[], onProgress?: (i: number) => void): Promise<ScoredProspect[]> {
  const out: ScoredProspect[] = [];
  for (let i = 0; i < items.length; i++) {
    const s = await scoreWithClaude(items[i]);
    out.push(s);
    onProgress?.(i + 1);
  }
  return out;
}
