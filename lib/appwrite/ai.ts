import { getCurrentUser } from './auth';

export interface AIGenerationOptions {
  prompt: string;
  model?: 'gemini' | 'gpt4' | 'claude';
  temperature?: number;
  maxTokens?: number;
  tone?: 'professional' | 'casual' | 'creative' | 'academic';
  context?: string;
}

export interface AIResponse {
  generated: string;
  model: string;
  tokensUsed: number;
  completionTime: number;
}

export async function generateWithAI(options: AIGenerationOptions): Promise<AIResponse> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/v1/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: options.prompt,
        model: options.model || 'gemini',
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 1000,
        tone: options.tone || 'professional',
        context: options.context,
      }),
    });

    if (!response.ok) throw new Error('AI generation failed');
    return response.json();
  } catch (error) {
    console.error('Failed to generate with AI:', error);
    throw error;
  }
}

export async function summarizeNote(noteContent: string): Promise<string> {
  try {
    const response = await generateWithAI({
      prompt: `Please provide a concise summary of the following note:\n\n${noteContent}`,
      tone: 'professional',
      maxTokens: 500,
    });

    return response.generated;
  } catch (error) {
    console.error('Failed to summarize note:', error);
    throw error;
  }
}

export async function expandNote(noteContent: string, context?: string): Promise<string> {
  try {
    const response = await generateWithAI({
      prompt: `Please expand on and elaborate the following note with more details:\n\n${noteContent}${context ? `\n\nContext: ${context}` : ''}`,
      tone: 'professional',
      maxTokens: 2000,
    });

    return response.generated;
  } catch (error) {
    console.error('Failed to expand note:', error);
    throw error;
  }
}

export async function generateNoteTitle(noteContent: string): Promise<string> {
  try {
    const response = await generateWithAI({
      prompt: `Generate a concise, descriptive title for this note:\n\n${noteContent}`,
      maxTokens: 100,
    });

    return response.generated.trim();
  } catch (error) {
    console.error('Failed to generate note title:', error);
    throw error;
  }
}

export async function improveWriting(text: string): Promise<string> {
  try {
    const response = await generateWithAI({
      prompt: `Please improve the following text for clarity, grammar, and style:\n\n${text}`,
      tone: 'professional',
      maxTokens: text.length * 1.2,
    });

    return response.generated;
  } catch (error) {
    console.error('Failed to improve writing:', error);
    throw error;
  }
}

export async function extractKeyPoints(content: string): Promise<string[]> {
  try {
    const response = await generateWithAI({
      prompt: `Extract the key points from the following content as a numbered list:\n\n${content}`,
      tone: 'professional',
      maxTokens: 500,
    });

    return response.generated
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Failed to extract key points:', error);
    throw error;
  }
}

export async function generateFollowUp(topic: string, previousContext?: string): Promise<string> {
  try {
    const response = await generateWithAI({
      prompt: `Generate a follow-up question or next step for this topic: "${topic}"${previousContext ? `\n\nContext: ${previousContext}` : ''}`,
      tone: 'professional',
      maxTokens: 300,
    });

    return response.generated;
  } catch (error) {
    console.error('Failed to generate follow-up:', error);
    throw error;
  }
}
