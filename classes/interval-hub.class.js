/** Manages recurring timers so they can be paused, resumed and stopped centrally. */
export class IntervalHub {
    static intervals = [];

    /**
     * Registers and starts a recurring timer.
     * @param {Function} func Callback.
     * @param {number} timer Interval in milliseconds.
     * @returns {{func: Function, timer: number, id: ?number}} Entry for stopping it later.
     */
    static startInterval(func, timer) {
        const entry = { func, timer, id: setInterval(func, timer) };
        IntervalHub.intervals.push(entry);
        return entry;
    }

    /**
     * Stops a single timer and removes it from the list.
     * @param {{id: ?number}} entry Entry returned by startInterval.
     */
    static stopInterval(entry) {
        clearInterval(entry.id);
        IntervalHub.intervals = IntervalHub.intervals.filter((interval) => interval !== entry);
    }

    /** Pauses all timers but keeps their callbacks for resuming. */
    static pauseAllInterval() {
        IntervalHub.intervals.forEach((interval) => {
            clearInterval(interval.id);
            interval.id = null;
        });
    }

    /** Resumes all previously paused timers. */
    static resumeAllInterval() {
        IntervalHub.intervals.forEach((interval) => {
            if (interval.id === null) interval.id = setInterval(interval.func, interval.timer);
        });
    }

    /** Stops and clears all registered timers. */
    static stopAllInterval() {
        IntervalHub.intervals.forEach((interval) => clearInterval(interval.id));
        IntervalHub.intervals = [];
    }
}
