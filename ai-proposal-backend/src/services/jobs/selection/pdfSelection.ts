
import { type jobData, JobSourceSelection } from "../type";
import { JobExtractor } from "../../ai/jobContentFilter";

const pdf = require('pdf-parse');

export class PdfSelection extends JobSourceSelection {
  readonly source_type: "pdf" = "pdf";
  private extractor = new JobExtractor();

  async process(base64: string): Promise<jobData> {
    const dataBuffer = Buffer.from(base64, 'base64');
    const pdfData = await pdf(dataBuffer);

    
    const cleanJob = await this.extractor.extract(pdfData.text);

    return {
      source_type: "pdf",
      title: cleanJob.title || "Extracted PDF Job",
      description: pdfData.text, 
      responsibility: cleanJob.responsibility || "See PDF content",
      location: cleanJob.location || "remote",
      deadline: cleanJob.deadline ? new Date(cleanJob.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      company_name: cleanJob.company_name || "Unknown",
      requirment: cleanJob.requirements || {}, 
      budget: cleanJob.budget || "Not listed"
    };
  }
}