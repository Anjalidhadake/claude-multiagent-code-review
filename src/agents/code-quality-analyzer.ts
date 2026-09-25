import { codeQualityPrompt } from "../prompts/code-quality.prompt";

export const codeQualityAnalyzer = {
  name: "code-quality-analyzer",
  description: "Analyzes pull requests for code quality issues, security vulnerabilities, performance bottlenecks, and adherence to best practices.",
  model: "inherit",
  system: codeQualityPrompt,
  tools: [
    {
      type: "computer_20241022",
      name: "computer",
      display_width_px: 1024,
      display_height_px: 768,
      display_number: 1,
    },
    {
      type: "bash_20241022",
      name: "bash",
    },
    {
        name: "Skill",
        description: "Allows the agent to read and utilize skills from the Claude skills library.",
        input_schema: {
            type: "object",
            properties: {
                skill_name: {
                    type: "string",
                    description: "The name of the skill to utilize."
                }
            },
            required: ["skill_name"]
        }
    }
  ]
};