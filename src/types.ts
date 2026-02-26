export interface SummarySection {
  heading: string;
  explanation: string;
}

export interface KhutbahSummary {
  title: string;
  summary: SummarySection[];
  bestQuote: string;
}

export interface OverallSummary {
  title: string;
  text: string;
}

export interface SermonData {
  impactfulTitle: string;
  khutbah1: KhutbahSummary;
  khutbah2: KhutbahSummary;
  overallSummary: OverallSummary;
}
