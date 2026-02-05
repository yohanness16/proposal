import { TextSelection } from "./selection/TextSelection";
import  { LinkSelection } from "../jobs/selection/LinkSelection";
import { JobSourceSelection } from "./type";

export type SourceType = "website_link" | "Text" | "pdf";
export class JobSourceFactory {
  static createSource(sourceType: SourceType): JobSourceSelection {
    switch (sourceType) {
      case "website_link":
        return new LinkSelection();
      case "Text":
        return new TextSelection();
      default:
        throw new Error(`Unsupported source type: ${sourceType}`);
    }
  }
}