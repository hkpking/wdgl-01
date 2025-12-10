/**
 * AI Providers - 简化版
 * 只支持 DeepSeek, Google, OpenAI
 */
import { openai, createOpenAI } from "@ai-sdk/openai";
import { google, createGoogleGenerativeAI } from "@ai-sdk/google";
import { deepseek, createDeepSeek } from "@ai-sdk/deepseek";

export type ProviderName = "openai" | "google" | "deepseek";

interface ModelInfo {
  provider: ProviderName;
  modelId: string;
  displayName: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  { provider: "deepseek", modelId: "deepseek-chat", displayName: "DeepSeek Chat" },
  { provider: "deepseek", modelId: "deepseek-coder", displayName: "DeepSeek Coder" },
  { provider: "google", modelId: "gemini-1.5-flash", displayName: "Gemini 1.5 Flash" },
  { provider: "google", modelId: "gemini-1.5-pro", displayName: "Gemini 1.5 Pro" },
  { provider: "google", modelId: "gemini-2.0-flash-exp", displayName: "Gemini 2.0 Flash" },
  { provider: "openai", modelId: "gpt-4o-mini", displayName: "GPT-4o Mini" },
  { provider: "openai", modelId: "gpt-4o", displayName: "GPT-4o" },
];

// 每个 Provider 的默认模型（使用最新推荐版本）
const DEFAULT_MODELS: Record<ProviderName, string> = {
  deepseek: "deepseek-chat",      // DeepSeek 最新对话模型
  google: "gemini-2.0-flash-exp", // Gemini 最新快速模型
  openai: "gpt-4o-mini",          // GPT-4o Mini (性价比最高)
};

export function getAIModel(provider: ProviderName, modelId?: string, apiKey?: string) {
  // 如果没有指定模型，使用默认模型
  const selectedModel = modelId || DEFAULT_MODELS[provider];

  switch (provider) {
    case "deepseek":
      if (apiKey) {
        const ds = createDeepSeek({ apiKey });
        return ds(selectedModel);
      }
      return deepseek(selectedModel);

    case "google":
      if (apiKey) {
        const g = createGoogleGenerativeAI({ apiKey });
        return g(selectedModel);
      }
      return google(selectedModel);

    case "openai":
      if (apiKey) {
        const o = createOpenAI({ apiKey });
        return o(selectedModel);
      }
      return openai(selectedModel);

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function validateApiKey(provider: ProviderName): boolean {
  switch (provider) {
    case "deepseek":
      return !!process.env.DEEPSEEK_API_KEY;
    case "google":
      return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    case "openai":
      return !!process.env.OPENAI_API_KEY;
    default:
      return false;
  }
}
