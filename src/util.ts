export function formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let unit = 0;
    while (size > 1024) {
        size /= 1024;
        unit++;

        if (unit == units.length - 1) break;
    }

    return `${size.toFixed(2)} ${units[unit]}`;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
