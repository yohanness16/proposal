import { type jobData , JobSourceSelection } from "../type";
import { LinkScrapper } from "../scrapper/LinkScrapper";
import { JobExtractor } from "../../ai/jobContentFilter";

export class LinkSelection extends JobSourceSelection {
    readonly source_type: "website_link" = "website_link";
    private scrapper = new LinkScrapper();
    private extractor = new JobExtractor();

    async process(url: string): Promise<jobData> {
        
        const scrapedData = await this.scrapper.scrapper(url);
        
       
        const cleanJob = await this.extractor.extract(scrapedData.content);

        
        return {
            source_type: this.source_type,
            source_link: url,
            title: cleanJob.title || scrapedData.title || "Unknown Title",
            description: cleanJob.description || scrapedData.content,
            responsibility: cleanJob.responsibility || "Check description for details",
            location: cleanJob.location || "remote",
          
            deadline: cleanJob.deadline instanceof Date 
                ? cleanJob.deadline 
                : new Date(cleanJob.deadline || Date.now() + 7 * 24 * 60 * 60 * 1000),
            company_name: cleanJob.company_name || "Not Specified",
            
            requirment: cleanJob.requirements || {}, 
            budget: cleanJob.budget || "N/A"
        };
    }
}