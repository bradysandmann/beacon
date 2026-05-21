// Deterministic seed data for the "Plumbers Tampa FL" sample query.
// Company names, phone numbers, and addresses are fictional but realistic.
// This populates the public sample so an unauthenticated visitor sees a full table.

import type { Prospect } from "./supabase";

export const SAMPLE_QUERY = "Plumbers Tampa FL";

type SeedRow = Omit<Prospect, "id" | "target_id" | "created_at" | "raw_json"> & {
  id: string;
};

export const SAMPLE_PROSPECTS: SeedRow[] = [
  {
    id: "s-01",
    company_name: "Tampa Plumbing Pros",
    phone: "(813) 555-0142",
    address: "2104 W Kennedy Blvd, Tampa, FL 33606",
    website: "tampaplumbingpros.example",
    employee_count_est: 12,
    fit_score: 92,
    intent_signal: "active",
    claude_summary:
      "Strong fit. Twelve employees, 4.8 average over 312 reviews, weekly review velocity. Site advertises commercial contracts which matches our ICP.",
  },
  {
    id: "s-02",
    company_name: "Bay Area Sewer and Drain",
    phone: "(813) 555-0118",
    address: "5210 N Florida Ave, Tampa, FL 33603",
    website: "bayareasewer.example",
    employee_count_est: 8,
    fit_score: 88,
    intent_signal: "active",
    claude_summary:
      "Active in commercial sewer line work, last review 3 days ago. Mid-size, owner-operator, likely to take a 30 minute call.",
  },
  {
    id: "s-03",
    company_name: "Suncoast Pipe and Fixture",
    phone: "(813) 555-0167",
    address: "1880 E Hillsborough Ave, Tampa, FL 33610",
    website: "suncoastpipe.example",
    employee_count_est: 22,
    fit_score: 84,
    intent_signal: "active",
    claude_summary:
      "Larger crew, fleet of trucks visible in street view, currently hiring on Indeed. Growth signal.",
  },
  {
    id: "s-04",
    company_name: "Hillsborough Hot Water Co.",
    phone: "(813) 555-0193",
    address: "7240 W Hillsborough Ave, Tampa, FL 33615",
    website: "hillshotwater.example",
    employee_count_est: 6,
    fit_score: 81,
    intent_signal: "active",
    claude_summary:
      "Niche water heater specialist. Six employees, consistent reviews. Smaller scope but tight ICP match.",
  },
  {
    id: "s-05",
    company_name: "Gulfstream Plumbing Services",
    phone: "(813) 555-0204",
    address: "4014 W Waters Ave, Tampa, FL 33614",
    website: "gulfstreamplumb.example",
    employee_count_est: 18,
    fit_score: 79,
    intent_signal: "active",
    claude_summary:
      "Mixed residential and commercial. Eighteen employees. Review pace is steady though not accelerating.",
  },
  {
    id: "s-06",
    company_name: "Westshore Drain Cleaning",
    phone: "(813) 555-0156",
    address: "5005 W Cypress St, Tampa, FL 33607",
    website: "westshoredrain.example",
    employee_count_est: 5,
    fit_score: 74,
    intent_signal: "active",
    claude_summary:
      "Drain-only specialist. Smaller team, but high-margin niche. Likely receptive to lead-flow tools.",
  },
  {
    id: "s-07",
    company_name: "Davis Islands Plumbing",
    phone: "(813) 555-0181",
    address: "229 E Davis Blvd, Tampa, FL 33606",
    website: "davisislandsplumbing.example",
    employee_count_est: 4,
    fit_score: 72,
    intent_signal: "active",
    claude_summary:
      "Small premium residential operator. Owner-led. May be a fit for a single-seat plan.",
  },
  {
    id: "s-08",
    company_name: "Ybor Heritage Plumbing",
    phone: "(813) 555-0125",
    address: "1801 E 7th Ave, Tampa, FL 33605",
    website: "yborplumb.example",
    employee_count_est: 9,
    fit_score: 70,
    intent_signal: "active",
    claude_summary:
      "Older brand, modernizing slowly. Reviews show price sensitivity. Worth a low-touch nurture.",
  },
  {
    id: "s-09",
    company_name: "Carrollwood Mechanical",
    phone: "(813) 555-0238",
    address: "12603 N Florida Ave, Tampa, FL 33612",
    website: "carrollwoodmech.example",
    employee_count_est: 31,
    fit_score: 68,
    intent_signal: "active",
    claude_summary:
      "Mechanical contractor with a plumbing arm. Larger team, slower decisions, longer sales cycle.",
  },
  {
    id: "s-10",
    company_name: "Brandon Plumbing and Gas",
    phone: "(813) 555-0177",
    address: "808 E Brandon Blvd, Brandon, FL 33511",
    website: "brandonpg.example",
    employee_count_est: 14,
    fit_score: 66,
    intent_signal: "active",
    claude_summary:
      "Suburban operator. Gas line work is a differentiator. Reviews look healthy, no recent surge.",
  },
  {
    id: "s-11",
    company_name: "Apollo Beach Plumbing",
    phone: "(813) 555-0212",
    address: "6324 N US Hwy 41, Apollo Beach, FL 33572",
    website: "apollobeachplumb.example",
    employee_count_est: 7,
    fit_score: 64,
    intent_signal: "active",
    claude_summary:
      "Coastal small business. Slow off-season but steady book of work.",
  },
  {
    id: "s-12",
    company_name: "Temple Terrace Pipework",
    phone: "(813) 555-0149",
    address: "11305 N 56th St, Temple Terrace, FL 33617",
    website: "templeterracepipe.example",
    employee_count_est: 6,
    fit_score: 61,
    intent_signal: "active",
    claude_summary:
      "Two-truck operation. Local reputation is strong but review velocity is low.",
  },
  {
    id: "s-13",
    company_name: "Channelside Plumbing Co.",
    phone: "(813) 555-0163",
    address: "1003 E Cumberland Ave, Tampa, FL 33602",
    website: "channelsideplumb.example",
    employee_count_est: 10,
    fit_score: 58,
    intent_signal: "dormant",
    claude_summary:
      "No new reviews in 90 days. Website cert recently expired and was renewed. Probably understaffed marketing.",
  },
  {
    id: "s-14",
    company_name: "South Tampa Plumbing Group",
    phone: "(813) 555-0195",
    address: "3415 S Westshore Blvd, Tampa, FL 33629",
    website: "sotampaplumb.example",
    employee_count_est: 15,
    fit_score: 56,
    intent_signal: "dormant",
    claude_summary:
      "Decent size but reviews show a quality dip mid-year. Sales conversation likely uphill.",
  },
  {
    id: "s-15",
    company_name: "Plant City Plumbing",
    phone: "(813) 555-0228",
    address: "201 N Wheeler St, Plant City, FL 33563",
    website: "plantcityplumb.example",
    employee_count_est: 8,
    fit_score: 54,
    intent_signal: "dormant",
    claude_summary:
      "Outside core Tampa. Travel time may not pencil for residential calls.",
  },
  {
    id: "s-16",
    company_name: "Riverview Drain and Septic",
    phone: "(813) 555-0186",
    address: "10220 Big Bend Rd, Riverview, FL 33578",
    website: "riverviewdrain.example",
    employee_count_est: 11,
    fit_score: 52,
    intent_signal: "dormant",
    claude_summary:
      "Septic-heavy mix is off our ICP. Some plumbing crossover but not the core book.",
  },
  {
    id: "s-17",
    company_name: "Westchase Plumbing Solutions",
    phone: "(813) 555-0173",
    address: "11842 Sheldon Rd, Tampa, FL 33626",
    website: "westchaseplumb.example",
    employee_count_est: 5,
    fit_score: 49,
    intent_signal: "dormant",
    claude_summary:
      "Suburb operator, residential-only. Smaller margin profile.",
  },
  {
    id: "s-18",
    company_name: "USF Area Plumbing",
    phone: "(813) 555-0136",
    address: "2105 E Fletcher Ave, Tampa, FL 33612",
    website: "usfplumb.example",
    employee_count_est: 4,
    fit_score: 47,
    intent_signal: "dormant",
    claude_summary:
      "Student-area focus, lots of one-off jobs. Lifetime value will be thin.",
  },
  {
    id: "s-19",
    company_name: "Citrus Park Plumbing",
    phone: "(813) 555-0247",
    address: "8201 Citrus Park Dr, Tampa, FL 33625",
    website: "citrusparkplumb.example",
    employee_count_est: 7,
    fit_score: 45,
    intent_signal: "dormant",
    claude_summary:
      "Reviews trending slowly down. Worth a single follow-up but not a priority.",
  },
  {
    id: "s-20",
    company_name: "Lutz Plumbing Services",
    phone: "(813) 555-0158",
    address: "16312 N Dale Mabry Hwy, Lutz, FL 33548",
    website: "lutzplumb.example",
    employee_count_est: 9,
    fit_score: 42,
    intent_signal: "dormant",
    claude_summary:
      "Reasonable team size but quiet on social and reviews. Might be a slow grower.",
  },
  {
    id: "s-21",
    company_name: "Dunedin Plumbing Solutions",
    phone: "(727) 555-0114",
    address: "1305 Main St, Dunedin, FL 34698",
    website: "dunedinplumbing.example",
    employee_count_est: 3,
    fit_score: 38,
    intent_signal: "dormant",
    claude_summary:
      "Outside Hillsborough County. Travel cost may erode unit economics.",
  },
  {
    id: "s-22",
    company_name: "Clearwater Coast Plumbing",
    phone: "(727) 555-0102",
    address: "618 Cleveland St, Clearwater, FL 33755",
    website: "clearwatercoastplumb.example",
    employee_count_est: 12,
    fit_score: 35,
    intent_signal: "dormant",
    claude_summary:
      "Pinellas operator, healthy team, but our ICP is Hillsborough core. Defer.",
  },
  {
    id: "s-23",
    company_name: "Heritage Drainworks LLC",
    phone: "(813) 555-0271",
    address: "Suite 200, 401 E Jackson St, Tampa, FL 33602",
    website: "heritagedrainworks.example",
    employee_count_est: 2,
    fit_score: 22,
    intent_signal: "closed",
    claude_summary:
      "Phone is voicemail-only and the website returns a 404. Likely closed in the last quarter.",
  },
  {
    id: "s-24",
    company_name: "All Hours Tampa Plumber",
    phone: "(813) 555-0289",
    address: "(no listed office)",
    website: "allhourstampaplumber.example",
    employee_count_est: 1,
    fit_score: 18,
    intent_signal: "closed",
    claude_summary:
      "Operator-only shop with no current listing. Several recent one-star complaints about no-answer.",
  },
  {
    id: "s-25",
    company_name: "Florida State Plumbing Group",
    phone: "(813) 555-0299",
    address: "5050 W Lemon St, Tampa, FL 33609",
    website: "floridastateplumbinggroup.example",
    employee_count_est: 0,
    fit_score: 12,
    intent_signal: "closed",
    claude_summary:
      "Listing flagged closed. Address routes to an empty unit per recent imagery.",
  },
];
