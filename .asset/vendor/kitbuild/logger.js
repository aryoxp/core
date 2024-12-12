class Logger {

  static enabled = true;
  static userid = null;
  static sessid = null;
  static canvasid = null;
  static seq = 1;
  static shouldSkip(action) {
    switch(action) {
      case 'select-nodes':
      case 'unselect-nodes':
      case 'disconnect-undefined':
        return true;
      default: return false;
    }
  }
  static VERBOSE = true;

  static log(action, data, extra, options) { // console.log(arguments, this)
    // console.warn("logger is enabled: ", this.enabled)
    if (!Logger.enabled) return;
    if (Logger.shouldSkip(action)) return;

    let settings = Object.assign({ compress: false }, options)

    // do some checks
    if (Logger.userid == null) console.warn("Log userid is null.");
    if (Logger.sessid == null) console.warn("Log sessid is null.");
    
    let lData = new FormData()    
    lData.append('tstampc', Date.now()); // the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
    lData.append('userid', Logger.userid);
    lData.append('sessid', Logger.sessid);
    lData.append('action', action);
    lData.append('canvasid', Logger.canvasid);
    lData.append('seq', Logger.seq);

    // if the concept map data should be compressed or not
    if (data != undefined) 
      lData.append('data', settings.compress ? 
        Core.compress(JSON.stringify(data)) : 
        JSON.stringify(data));

    // extract additional extras (Map) to log
    if (extra instanceof Map) extra.forEach((v, k) => lData.append(k, v))

    if (Logger.VERBOSE) console.warn("Log data to send: ", ...lData);

    let url = Core.instance().config('baseurl') + "logApi/log";
    if (lData.has('data') || lData.has('canvas') || lData.has('compare')) {
      Core.instance().ajax().post(url, lData).then(result => {
        console.warn(`Log status: logid: ${result}`);
        if (Logger.VERBOSE) console.warn(Logger.seq, action, Array.from(lData.entries()), result);
      }).catch(error => {
        console.error("Log error: ", error);
      });
    } else {
      let status = navigator.sendBeacon(url, lData);
      console.warn(`Log beacon status: ${action} seq: ${Logger.seq}`);
      if (Logger.VERBOSE) console.warn(Logger.seq, action, Array.from(lData.entries()), status);
    }
    Logger.seq++;
  }

  static logsc(action, data, extra, options) { // console.log(arguments, this)
    // console.warn("logger is enabled: ", this.enabled)
    if (!Logger.enabled) return;
    if (Logger.shouldSkip(action)) return;

    let settings = Object.assign({ compress: false }, options)
    
    let lData = new FormData()    
    lData.append('tstampc', Date.now()); // the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
    lData.append('userid', Logger.userid);
    lData.append('sessid', Logger.sessid);
    lData.append('action', action);
    lData.append('canvasid', Logger.canvasid);
    lData.append('seq', Logger.seq);

    if (data != undefined) 
      lData.append('data', settings.compress ? Core.compress(JSON.stringify(data)) : JSON.stringify(data));

    // if (this.username !== null) lData.append('username', this.username);
    // if (this.sessid !== null) lData.append('sessid', this.sessid);
    if (extra instanceof Map) extra.forEach((v, k) => lData.append(k, v))

    // console.log(...lData);

    let url = Core.instance().config('baseurl') + "logApi/logsc";
    if (lData.has('data') || lData.has('canvas') || lData.has('concept') || lData.has('link') || lData.has('proposition')) {
      Core.instance().ajax().post(url, lData).then(result => {
        console.warn("Log status: ", result);
        console.warn(Logger.seq, action, Array.from(lData.entries()), result);
      }).catch(error => {
        console.error("Log error: ", error);
      });
    } else {
      let status = navigator.sendBeacon(url, lData);
      console.warn(Logger.seq, action, Array.from(lData.entries()), status);
    }
    Logger.seq++;
  }

}