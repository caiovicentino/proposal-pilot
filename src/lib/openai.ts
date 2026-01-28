import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

export interface ProposalInput {
  brief: string;
  template: 'consulting' | 'development' | 'design' | 'marketing' | 'construction';
  currency?: string;
  companyName?: string;
}

export interface GeneratedProposal {
  title: string;
  clientName: string;
  clientCompany: string;
  scope: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  terms: string;
}

export async function generateProposal(input: ProposalInput): Promise<GeneratedProposal> {
  const openai = getOpenAI();
  
  const prompt = `Generate a professional ${input.template} proposal based on this brief:

${input.brief}

Currency: ${input.currency || 'USD'}
${input.companyName ? `Company: ${input.companyName}` : ''}

Return a JSON object with these fields:
- title: proposal title
- clientName: extracted client name
- clientCompany: extracted company name
- scope: detailed scope of work
- deliverables: list of deliverables
- timeline: project timeline
- pricing: pricing breakdown with currency
- terms: payment terms and conditions`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');
  
  return JSON.parse(content) as GeneratedProposal;
}
