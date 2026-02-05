export type SourceType = "website_link" | "Text" | "pdf";

export type jobData = {
source_type:SourceType;
  source_link?: string;
  title: string;
  description: string;
  responsibility: string;
  location: string;
  deadline: Date;
  company_name?: string;
  requirment: Record<string, any>;
  budget?: string;
} ;

export abstract class JobSourceSelection {
  abstract readonly source_type: jobData["source_type"];
  abstract process(input: string): Promise<jobData>;
};