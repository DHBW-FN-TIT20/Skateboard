
/** switches between day and nightmode */
class DayNightSwitch {
    constructor() {
        /** contains all changeable objects */
        this.switchables = [];

        /**
         * set every switchable to day
         */
        window.toggleDay = () => {
            this.switchables.forEach(e => {
                e.day();
            })
        }

        /**
         * set every switchable to night
         */
        window.toggleNight = () => {
            this.switchables.forEach(e => {
                e.night();
            })
        }
    }
}
export { DayNightSwitch }