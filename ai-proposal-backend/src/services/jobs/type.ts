export type jobData = {
source_type: "website_link" | "Text" | "pdf";
  source_link?: string;
  title: string;
  description: string;
  responsibility: string;
  location: string;
} ;

export abstract class JobSourceSelection {
  abstract readonly source_type: jobData["source_type"];
  abstract process(input: string): Promise<jobData>;
};