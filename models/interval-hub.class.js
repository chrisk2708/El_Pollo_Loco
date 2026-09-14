/** Verwaltet wiederkehrende Timer, damit sie zentral beendet werden koennen. */
export class IntervalHub {
    static allIntervals = [];

    /** Registriert und startet einen wiederkehrenden Timer. @param {Function} func Callback. @param {number} timer Intervall in Millisekunden. @returns {*} Timer-ID. */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }

    /** Beendet einen Timer und entfernt ihn aus der Registry. @param {*} id Timer-ID. */
    static stopInterval(id) {
        clearInterval(id);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter((intervaId) => intervaId !== id);
    }

    /** Beendet und leert alle registrierten Timer. */
    static stopAllInterval() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}