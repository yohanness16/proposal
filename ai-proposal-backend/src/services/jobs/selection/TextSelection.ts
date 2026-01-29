import { JobSourceSelection, type jobData } from "../type";

export class TextSelection extends JobSourceSelection {
  readonly source_type: "Text" = "Text";

  async process(text: string) : Promise<jobData>   {
  
    return {
        source_type: "Text",
        title: "Manual Job Entry", 
        description: text,
        responsibility: "Extracted from text", 
        location: "remote",
        };
  }}