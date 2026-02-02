import { type jobData , JobSourceSelection } from "../type";
import { LinkScrapper } from "../scrapper/LinkScrapper";
import { JobExtractor } from "../../ai/jobContentFilter";

export class LinkSelection extends JobSourceSelection {
  readonly source_type: "website_link" = "website_link";
  private scrapper = new LinkScrapper();
  private extractor = new JobExtractor();
  

  async process(url: string) : Promise<jobData>   {
    const scrapedData = await this.scrapper.scrapper(url);
    const cleanJob = await this.extractor.extract(scrapedData.content);
    
    return {
        source_type: "website_link",
        source_link: url,
        title: scrapedData.title || "Pending Scrape...",
        description: scrapedData.content || "QUEUED_FOR_SCRAPING", 
        responsibility: cleanJob.responsibility || "To be determined",
        requirment: {},
        deadline: cleanJob.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default to 7 days from now
        location: "remote",
  }
}}