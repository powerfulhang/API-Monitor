import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

// MiMo Token Plan credit rates (credits per token)
const MIMO_CREDIT_RATES: Record<string, { input: number; output: number }> = {
    'mimo-v2.5-pro': { input: 2, output: 2 },
    'mimo-v2-pro': { input: 2, output: 2 },
    'mimo-v2.5': { input: 1, output: 1 },
    'mimo-v2-omni': { input: 1, output: 1 },
    'mimo-v2-flash': { input: 0.5, output: 0.5 }
};
const DEFAULT_RATE = { input: 2, output: 2 }; // default to Pro rate

function formatCredits(credits: number): string {
    if (credits >= 1_000_000) {
        return `${(credits / 1_000_000).toFixed(1)}M`;
    }
    if (credits >= 1_000) {
        return `${(credits / 1_000).toFixed(1)}K`;
    }
    return `${Math.round(credits)}`;
}

function getModelKey(modelId: string | undefined): string {
    if (!modelId)
        return '';
    // Normalize: strip provider prefix if present
    const lower = modelId.toLowerCase();
    for (const key of Object.keys(MIMO_CREDIT_RATES)) {
        if (lower.includes(key))
            return key;
    }
    return lower;
}

export class MimoCreditWidget implements Widget {
    getDefaultColor(): string { return 'magenta'; }
    getDescription(): string { return 'Shows MiMo Token Plan credit consumption'; }
    getDisplayName(): string { return 'MiMo Credits'; }
    getCategory(): string { return 'Session'; }
    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName() };
    }

    render(item: WidgetItem, context: RenderContext, settings: Settings): string | null {
        if (context.isPreview) {
            return item.rawValue ? '2.5M Credits' : 'Credits: 2.5M';
        }

        const data = context.data;
        if (!data?.context_window)
            return null;

        const inputTokens = data.context_window.total_input_tokens ?? 0;
        const outputTokens = data.context_window.total_output_tokens ?? 0;

        // Get model-specific credit rate
        const modelId = typeof data.model === 'string' ? data.model : data.model?.id;
        const modelKey = getModelKey(modelId);
        const rate = MIMO_CREDIT_RATES[modelKey] ?? DEFAULT_RATE;

        // Calculate credits: input tokens * input rate + output tokens * output rate
        const totalCredits = inputTokens * rate.input + outputTokens * rate.output;
        const formatted = formatCredits(totalCredits);

        // Also show token breakdown
        const inputK = inputTokens >= 1000 ? `${(inputTokens / 1000).toFixed(1)}K` : `${inputTokens}`;
        const outputK = outputTokens >= 1000 ? `${(outputTokens / 1000).toFixed(1)}K` : `${outputTokens}`;

        if (item.rawValue) {
            return `${formatted} Credits`;
        }

        return `Credits: ${formatted} (in:${inputK} out:${outputK})`;
    }

    getNumericValue(context: RenderContext, item: WidgetItem): number | null {
        const data = context.data;
        if (!data?.context_window)
            return null;

        const inputTokens = data.context_window.total_input_tokens ?? 0;
        const outputTokens = data.context_window.total_output_tokens ?? 0;
        const modelId = typeof data.model === 'string' ? data.model : data.model?.id;
        const modelKey = getModelKey(modelId);
        const rate = MIMO_CREDIT_RATES[modelKey] ?? DEFAULT_RATE;

        return inputTokens * rate.input + outputTokens * rate.output;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
