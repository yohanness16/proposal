import { type jobData, JobSourceSelection } from "../type";
import { JobExtractor } from "../../ai/jobContentFilter";

export class TextSelection extends JobSourceSelection {
  readonly source_type: "Text" = "Text";
  private extractor = new JobExtractor();

  async process(text: string): Promise<jobData> {
    const cleanJob = await this.extractor.extract(text);

    return {
      source_type: "Text",
      title: cleanJob.title || "Untitled Manual Job",
      description: text,
      responsibility: cleanJob.responsibility || "See description",
      location: cleanJob.location || "remote",
      deadline: cleanJob.deadline instanceof Date 
        ? cleanJob.deadline 
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      company_name: cleanJob.company_name,
      requirment: cleanJob.requirements || {},
      budget: cleanJob.budget
    };
  }
}