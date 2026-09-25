import { refactoringPrompt } from "../prompts/refactoring.prompt";

export const refactoringSuggester = {
  name: "refactoring-suggester",
  description: "Analyzes pull requests to suggest code refactoring, improvements in readability, and architectural enhancements.",
  model: "inherit",
  system: refactoringPrompt,
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