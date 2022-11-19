class DayNightSwitch  {
    constructor() {
        this.switchables = [];
        this.state = false;

        window.toggleDayNight = () => {
            if(this.state) {
                this.switchables.forEach(e => {
                    e.day();
                })
            } else {
                this.switchables.forEach(e => {
                    e.night();
                })                
            }
            this.state = !this.state;
        }
    }
}
export { DayNightSwitch }