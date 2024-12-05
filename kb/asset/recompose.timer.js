class Timer {
  constructor(element) {
    this.element = element;
    this.startTimestamp = Math.floor(Date.now()/1000);
    this.ts = 0;
    
    this.off();
  }

  on() {
    Timer.interval = setInterval(() => {
      let ts = Math.floor(Date.now()/1000) - this.startTimestamp;
      let duration = App.time(ts);
      $(this.element).html(duration);
      this.ts = ts;
    }, 1000);
    return this;
  }

  off() {
    if (Timer.interval) clearInterval(Timer.interval);
    Timer.interval = null;

    let ts = Math.floor(Date.now()/1000) - this.startTimestamp;
    let duration = App.time(ts);
    $(this.element).html(duration);
    
    return this; 
  }
}