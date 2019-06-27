import * as fs from "fs";
import * as os from "os";

export class Logger {
    public static log(message: string): void {
        this.tee(message);
    }

    private static logFile = `${os.tmpdir()}/beerbot_log.txt`;

    private static tee(message: string): void {
        fs.appendFileSync(this.logFile, message);
        console.log(`${this.now()}: ${message}`);
    }

    private static now(): string {
        return new Date().toISOString();
    }
}

export function msToTime(duration: number): string {
    const seconds = (duration / 1000);
    const minutes = (duration / (1000 * 60));
    const hours = (duration / (1000 * 60 * 60));
    const days = (duration / (1000 * 60 * 60 * 24));

    let timeStr: string = "";

    if (seconds < 60) {
        timeStr = seconds.toFixed(1) + " sec";
    } else if (minutes < 60) {
        timeStr = minutes.toFixed(1) + " min";
    } else if (hours < 24) {
        timeStr = hours.toFixed(1) + " hours";
    } else {
        timeStr = days.toFixed(1) + " days";
    }

    return timeStr;
}
