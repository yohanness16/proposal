import { type jobData , JobSourceSelection } from "../type";
import { LinkScrapper } from "../scrapper/LinkScrapper";

export class LinkSelection extends JobSourceSelection {
  readonly source_type: "website_link" = "website_link";
  private scrapper = new LinkScrapper();

  async process(url: string) : Promise<jobData>   {
    const scrapedData = await this.scrapper.scrapper(url);
    
    return {
        source_type: "website_link",
        source_link: url,
        title: scrapedData.title || "Pending Scrape...",
        description: scrapedData.content || "QUEUED_FOR_SCRAPING", 
        responsibility: "Pending...",
        location: "remote",
  }
}}