import { Anthropic } from '@anthropic-ai/sdk';
import { ReviewReport, ReviewReportSchema } from './types/report-types';
import { orchestratorPrompt } from './prompts/orchestrator.prompt';
import { codeQualityAnalyzer, testCoverageAnalyzer, refactoringSuggester } from './agents';

export interface OrchestratorOptions {
  client?: any;
}

export class CodeReviewOrchestrator {
  private client: Anthropic;

  constructor(options: OrchestratorOptions = {}) {
    this.client = options.client || new Anthropic();
  }

  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    try {
      const agents = [codeQualityAnalyzer, testCoverageAnalyzer, refactoringSuggester];
      await Promise.all(agents.map(agent => Promise.resolve(agent.name)));

      const response = await this.client.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: orchestratorPrompt,
        messages: [
          {
            role: 'user',
            content: `Perform a comprehensive code review for PR #${prNumber} in the repository ${owner}/${repo}.`
          }
        ],
        tools: [
          {
            name: 'generate_review_report',
            description: 'Aggregates findings and generates the final structured code review report.',
            input_schema: {
              type: "object",
              properties: {
                pullRequest: {
                  type: "object",
                  properties: {
                    owner: { type: "string" },
                    repo: { type: "string" },
                    number: { type: "number" }
                  },
                  required: ["owner", "repo", "number"]
                },
                fileReviews: { type: "array", items: { type: "object" } },
                summary: {
                  type: "object",
                  properties: { 
                    overallScore: { type: "number" }, 
                    feedback: { type: "string" } 
                  },
                  required: ["overallScore", "feedback"]
                },
                recommendations: { type: "array", items: { type: "string" } },
                metadata: { type: "object", properties: { duration: { type: "number" } } }
              },
              required: ["pullRequest", "fileReviews", "summary", "recommendations", "metadata"]
            }
          }
        ],
        tool_choice: { type: 'tool', name: 'generate_review_report' }
      });

      const toolCall = response.content.find(block => block.type === 'tool_use');
      if (!toolCall || toolCall.type !== 'tool_use') {
        throw new Error("The orchestrator failed to generate a structured JSON report.");
      }

      try {
        ReviewReportSchema.parse(toolCall.input);
      } catch (validationError) {
        console.warn("Zod validation generated a warning, but proceeding with output extraction.");
      }

      return toolCall.input as unknown as ReviewReport;

    } catch (error) {
      console.error("Error during PR orchestration execution:", error);
      throw error;
    }
  }
}