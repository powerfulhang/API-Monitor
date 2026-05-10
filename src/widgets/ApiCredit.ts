// File Name: ApiCredit.ts
// Author: hang.shi
// Time: 2026-05-09
// Version: 1.0.0
// Description: Multi-provider API credit consumption widget (CNY)

import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';
import {
    calculateCredits,
    detectProvider,
    formatCredits
} from '../utils/api-providers';

function formatTokenCount(count: number): string {
    if (count >= 1_000_000)
        return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000)
        return `${(count / 1_000).toFixed(1)}K`;
    return `${count}`;
}

export class ApiCreditWidget implements Widget {
    getDefaultColor(): string { return 'yellow'; }

    getDescription(): string {
        return 'Shows API credit consumption for detected provider (MIMO, DeepSeek, etc.) in CNY';
    }

    getDisplayName(): string { return 'API Credits'; }

    getCategory(): string { return 'Session'; }

    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName() };
    }

    render(item: WidgetItem, context: RenderContext, settings: Settings): string | null {
        if (context.isPreview) {
            return item.rawValue ? 'CNY 12.34' : 'Credits: CNY 12.34';
        }

        const data = context.data;
        if (!data?.context_window)
            return null;

        // Get token counts
        const inputTokens = data.context_window.total_input_tokens ?? 0;
        const outputTokens = data.context_window.total_output_tokens ?? 0;
        const cachedTokens = data.context_window.current_usage
            && typeof data.context_window.current_usage === 'object'
            ? (data.context_window.current_usage.cache_read_input_tokens ?? 0)
            : undefined;

        // Detect provider from model ID
        const modelId = typeof data.model === 'string' ? data.model : data.model?.id;
        const detected = detectProvider(modelId);

        if (!detected) {
            // Unknown provider - show raw token info
            const inputStr = formatTokenCount(inputTokens);
            const outputStr = formatTokenCount(outputTokens);
            return item.rawValue
                ? `in:${inputStr} out:${outputStr}`
                : `Tokens: in:${inputStr} out:${outputStr}`;
        }

        // Calculate credits
        const credits = calculateCredits(inputTokens, outputTokens, cachedTokens, detected.rate);
        const formatted = formatCredits(credits);

        if (item.rawValue) {
            return `CNY ${formatted}`;
        }

        // Build detailed display
        const providerLabel = detected.provider.displayName;
        const inputStr = formatTokenCount(inputTokens);
        const outputStr = formatTokenCount(outputTokens);

        if (cachedTokens !== undefined && cachedTokens > 0 && detected.rate.inputCached !== undefined) {
            const cachedStr = formatTokenCount(cachedTokens);
            return `${providerLabel}: CNY ${formatted} (in:${inputStr} cache:${cachedStr} out:${outputStr})`;
        }

        return `${providerLabel}: CNY ${formatted} (in:${inputStr} out:${outputStr})`;
    }

    getNumericValue(context: RenderContext, item: WidgetItem): number | null {
        const data = context.data;
        if (!data?.context_window)
            return null;

        const inputTokens = data.context_window.total_input_tokens ?? 0;
        const outputTokens = data.context_window.total_output_tokens ?? 0;
        const cachedTokens = data.context_window.current_usage
            && typeof data.context_window.current_usage === 'object'
            ? (data.context_window.current_usage.cache_read_input_tokens ?? 0)
            : undefined;

        const modelId = typeof data.model === 'string' ? data.model : data.model?.id;
        const detected = detectProvider(modelId);
        if (!detected)
            return null;

        return calculateCredits(inputTokens, outputTokens, cachedTokens, detected.rate);
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
