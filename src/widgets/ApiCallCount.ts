// File Name: ApiCallCount.ts
// Author: hang.shi
// Time: 2026-05-09
// Version: 1.0.0
// Description: API call count widget - tracks number of API calls from transcript

import type { RenderContext } from '../types/RenderContext';
import type { Settings } from '../types/Settings';
import type {
    Widget,
    WidgetEditorDisplay,
    WidgetItem
} from '../types/Widget';

export class ApiCallCountWidget implements Widget {
    getDefaultColor(): string { return 'green'; }

    getDescription(): string {
        return 'Shows the number of API calls in the current session (from transcript)';
    }

    getDisplayName(): string { return 'API Calls'; }

    getCategory(): string { return 'Session'; }

    getEditorDisplay(item: WidgetItem): WidgetEditorDisplay {
        return { displayText: this.getDisplayName() };
    }

    render(item: WidgetItem, context: RenderContext, settings: Settings): string | null {
        if (context.isPreview) {
            return item.rawValue ? '42' : 'API Calls: 42';
        }

        const callCount = context.tokenMetrics?.apiCallCount ?? 0;

        if (item.rawValue) {
            return `${callCount}`;
        }

        return `API Calls: ${callCount}`;
    }

    getNumericValue(context: RenderContext, item: WidgetItem): number | null {
        return context.tokenMetrics?.apiCallCount ?? null;
    }

    supportsRawValue(): boolean { return true; }
    supportsColors(item: WidgetItem): boolean { return true; }
}
