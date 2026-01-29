import { type jobData , JobSourceSelection } from "../type";

export class LinkSelection extends JobSourceSelection {
  readonly source_type: "website_link" = "website_link";

  async process(url: string) : Promise<jobData>   {
    
    return {
        source_type: "website_link",
        source_link: url,
        title: "Pending Scrape...",
        description: "QUEUED_FOR_SCRAPING", 
        responsibility: "Pending...",
        location: "remote",
  }
}}