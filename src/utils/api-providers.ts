// File Name: api-providers.ts
// Author: hang.shi
// Time: 2026-05-09
// Version: 1.0.0
// Description: Multi-provider API credit rate configuration and model detection

/**
 * Credit rate per million tokens (CNY)
 */
export interface CreditRate {
    input: number;
    output: number;
    inputCached?: number;
}

/**
 * Provider configuration with model matching patterns and rates
 */
export interface ProviderConfig {
    id: string;
    displayName: string;
    currency: string;
    rates: CreditRate;
    /** Model ID patterns to match (case-insensitive substring match) */
    modelPatterns: string[];
    /** Optional: specific model overrides keyed by model pattern */
    modelRateOverrides?: Record<string, CreditRate>;
}

/**
 * Detected provider and model info
 */
export interface DetectedProvider {
    provider: ProviderConfig;
    modelKey: string;
    rate: CreditRate;
}

// ─── Provider Registry ───────────────────────────────────────────────────────

const PROVIDER_REGISTRY: ProviderConfig[] = [
    {
        id: 'mimo',
        displayName: 'MiMo',
        currency: 'CNY',
        rates: { input: 2, output: 2 },
        modelPatterns: ['mimo'],
        modelRateOverrides: {
            'mimo-v2.5-pro': { input: 2, output: 2 },
            'mimo-v2-pro': { input: 2, output: 2 },
            'mimo-v2.5': { input: 1, output: 1 },
            'mimo-v2-omni': { input: 1, output: 1 },
            'mimo-v2-flash': { input: 0.5, output: 0.5 }
        }
    },
    {
        id: 'deepseek',
        displayName: 'DeepSeek',
        currency: 'CNY',
        rates: { input: 3, output: 6, inputCached: 0.025 },
        modelPatterns: ['deepseek'],
        modelRateOverrides: {
            'deepseek-v4-pro': { input: 3, output: 6, inputCached: 0.025 },
            'deepseek-v4-flash': { input: 1, output: 2, inputCached: 0.02 },
            'deepseek-chat': { input: 1, output: 2, inputCached: 0.02 },
            'deepseek-reasoner': { input: 1, output: 2, inputCached: 0.02 }
        }
    }
];

// ─── Model Detection ─────────────────────────────────────────────────────────

/**
 * Normalize model ID: lowercase, strip provider prefix if present
 */
function normalizeModelId(modelId: string): string {
    return modelId.toLowerCase().trim();
}

/**
 * Detect provider and resolve rate for a given model ID
 * @param modelId - Raw model ID from StatusJSON (e.g., "mimo-v2.5-pro", "deepseek-v4-pro")
 * @returns Detected provider info, or null if no provider matches
 */
export function detectProvider(modelId: string | undefined): DetectedProvider | null {
    if (!modelId)
        return null;

    const normalized = normalizeModelId(modelId);

    for (const provider of PROVIDER_REGISTRY) {
        // Check if model matches any provider pattern
        const matchesProvider = provider.modelPatterns.some(pattern => normalized.includes(pattern)
        );

        if (!matchesProvider)
            continue;

        // Try to find a specific model rate override
        if (provider.modelRateOverrides) {
            for (const [pattern, rate] of Object.entries(provider.modelRateOverrides)) {
                if (normalized.includes(pattern)) {
                    return { provider, modelKey: pattern, rate };
                }
            }
        }

        // Fall back to default provider rate
        return { provider, modelKey: provider.id, rate: provider.rates };
    }

    return null;
}

// ─── Credit Calculation ──────────────────────────────────────────────────────

/**
 * Calculate total credits consumed (in CNY)
 * @param inputTokens - Total input tokens
 * @param outputTokens - Total output tokens
 * @param cachedTokens - Tokens served from cache (optional)
 * @param rate - Credit rate per million tokens
 */
export function calculateCredits(
    inputTokens: number,
    outputTokens: number,
    cachedTokens: number | undefined,
    rate: CreditRate
): number {
    const inputUncached = cachedTokens !== undefined
        ? Math.max(0, inputTokens - cachedTokens)
        : inputTokens;

    const inputCost = (inputUncached / 1_000_000) * rate.input;
    const cachedCost = cachedTokens !== undefined && rate.inputCached !== undefined
        ? (cachedTokens / 1_000_000) * rate.inputCached
        : 0;
    const outputCost = (outputTokens / 1_000_000) * rate.output;

    return inputCost + cachedCost + outputCost;
}

/**
 * Format credit amount for display
 */
export function formatCredits(credits: number): string {
    if (credits >= 1_000_000) {
        return `${(credits / 1_000_000).toFixed(1)}M`;
    }
    if (credits >= 1_000) {
        return `${(credits / 1_000).toFixed(1)}K`;
    }
    if (credits >= 1) {
        return credits.toFixed(2);
    }
    return credits.toFixed(4);
}

/**
 * Get all registered providers (for display/debugging)
 */
export function getAllProviders(): ProviderConfig[] {
    return [...PROVIDER_REGISTRY];
}
