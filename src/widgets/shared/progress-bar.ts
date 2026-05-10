export interface TimerProgressBarOptions { cursorPercent?: number }

export interface PacmanProgressBarOptions { ascii?: boolean }

export function makeTimerProgressBar(
    percent: number,
    width: number,
    options?: TimerProgressBarOptions
): string {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    const filledWidth = Math.round((clampedPercent / 100) * width);

    const cursorPos = options?.cursorPercent !== undefined
        ? Math.min(Math.floor((Math.max(0, Math.min(100, options.cursorPercent)) / 100) * width), width - 1)
        : -1;

    let bar = '';
    for (let i = 0; i < width; i++) {
        if (i === cursorPos) {
            bar += '│';
        } else if (i < filledWidth) {
            bar += '█';
        } else {
            bar += '░';
        }
    }

    return bar;
}

export function makePacmanProgressBar(
    percent: number,
    width: number,
    options?: PacmanProgressBarOptions
): string {
    const safeWidth = Math.max(1, Math.trunc(width));
    const clampedPercent = Math.max(0, Math.min(100, percent));
    const pacmanPosition = safeWidth === 1
        ? 0
        : Math.round((clampedPercent / 100) * (safeWidth - 1));
    const pacman = options?.ascii ? 'C' : 'ᗧ';
    const pellet = options?.ascii ? '.' : '•';

    let bar = '';
    for (let i = 0; i < safeWidth; i++) {
        if (i < pacmanPosition) {
            bar += ' ';
        } else if (i === pacmanPosition) {
            bar += pacman;
        } else {
            bar += pellet;
        }
    }

    return bar;
}
