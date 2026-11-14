/** Verwaltet wiederkehrende Timer, damit sie zentral pausiert, fortgesetzt und beendet werden koennen. */
export class IntervalHub {
    static intervals = [];

    /**
     * Registriert und startet einen wiederkehrenden Timer.
     * @param {Function} func Callback.
     * @param {number} timer Intervall in Millisekunden.
     * @returns {{func: Function, timer: number, id: ?number}} Eintrag zum spaeteren Stoppen.
     */
    static startInterval(func, timer) {
        const entry = { func, timer, id: setInterval(func, timer) };
        IntervalHub.intervals.push(entry);
        return entry;
    }

    /**
     * Beendet einen einzelnen Timer und entfernt ihn aus der Verwaltung.
     * @param {{id: ?number}} entry Von startInterval zurueckgegebener Eintrag.
     */
    static stopInterval(entry) {
        clearInterval(entry.id);
        IntervalHub.intervals = IntervalHub.intervals.filter((interval) => interval !== entry);
    }

    /** Pausiert alle Timer, behaelt aber ihre Callbacks zum Fortsetzen. */
    static pauseAllInterval() {
        IntervalHub.intervals.forEach((interval) => {
            clearInterval(interval.id);
            interval.id = null;
        });
    }

    /** Setzt alle zuvor pausierten Timer fort. */
    static resumeAllInterval() {
        IntervalHub.intervals.forEach((interval) => {
            if (interval.id === null) interval.id = setInterval(interval.func, interval.timer);
        });
    }

    /** Beendet und leert alle registrierten Timer. */
    static stopAllInterval() {
        IntervalHub.intervals.forEach((interval) => clearInterval(interval.id));
        IntervalHub.intervals = [];
    }
}
