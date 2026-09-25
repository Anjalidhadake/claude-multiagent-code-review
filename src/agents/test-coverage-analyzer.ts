import { testCoveragePrompt } from "../prompts/test-coverage.prompt";

export const testCoverageAnalyzer = {
  name: "test-coverage-analyzer",
  description: "Analyzes pull requests for test coverage gaps, missing assertions, and untested edge cases.",
  model: "inherit",
  system: testCoveragePrompt,
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