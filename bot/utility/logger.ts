export function msToTime(duration: number): string {
    const seconds = (duration / 1000);
    const minutes = (duration / (1000 * 60));
    const hours = (duration / (1000 * 60 * 60));
    const days = (duration / (1000 * 60 * 60 * 24));

    let timeStr: string = "";

    if (seconds < 60) {
        timeStr = seconds.toFixed(1) + " sec";
    } else if (minutes < 60) {
        timeStr =  minutes.toFixed(1) + " min";
    } else if (hours < 24) {
        timeStr = hours.toFixed(1) + " hours";
    } else {
        timeStr = days.toFixed(1) + " days";
    }

    return timeStr;
}
