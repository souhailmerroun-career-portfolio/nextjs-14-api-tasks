import fs from 'fs';
import path from 'path';

class Logger {
    private logFile: string;

    constructor(logFileName: string) {
        // Use the current working directory
        const rootDir = process.cwd();
        this.logFile = path.join(rootDir, logFileName);

        // Ensure log file directory exists
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    private writeToFile(message: string) {
        fs.appendFileSync(this.logFile, message + '\n', { encoding: 'utf-8' });
    }

    log(...args: any[]) {
        console.log(...args);
        this.writeToFile('[LOG]: ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    }

    error(...args: any[]) {
        console.error(...args);
        this.writeToFile('[ERROR]: ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    }

    warn(...args: any[]) {
        console.warn(...args);
        this.writeToFile('[WARN]: ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    }

    info(...args: any[]) {
        console.info(...args);
        this.writeToFile('[INFO]: ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    }

    debug(...args: any[]) {
        console.debug(...args);
        this.writeToFile('[DEBUG]: ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    }
}

export default Logger;
