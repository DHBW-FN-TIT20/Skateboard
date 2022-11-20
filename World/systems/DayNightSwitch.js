class DayNightSwitch {
    constructor() {
        this.switchables = [];

        window.toggleDay = () => {
            this.switchables.forEach(e => {
                e.day();
            })
        }
        window.toggleNight = () => {
            this.switchables.forEach(e => {
                e.night();
            })
        }
    }
}
export { DayNightSwitch }