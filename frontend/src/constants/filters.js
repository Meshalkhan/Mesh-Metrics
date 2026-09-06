export const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" }
];

export const REGION_OPTIONS = [
  { value: "all", label: "All regions" },
  { value: "north-america", label: "North America" },
  { value: "emea", label: "EMEA" },
  { value: "apac", label: "APAC" },
  { value: "latam", label: "LATAM" }
];

export const SEGMENT_OPTIONS = [
  { value: "all", label: "All segments" },
  { value: "enterprise", label: "Enterprise" },
  { value: "mid-market", label: "Mid-Market" },
  { value: "smb", label: "SMB" }
];

export const DEFAULT_FILTERS = Object.freeze({
  period: "30d",
  region: "all",
  segment: "all"
});
