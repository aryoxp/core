$(() => {
  // jQuery onReady callback
  let app = App.instance();
});

// short hand for logger class
// so to log something, one could simply use:
// L.log('action', data);
class L {
  static log(action, data, extra, options) {
    Logger.log(action, data, extra, options);
  }
  static dataMap(kid, cmid) {
    return new Map([["kid", kid],["cmid", cmid]]);
  }
  static canvas(dataMap, appCanvas) {
    // Remove attribute of image binary data 
    let attrs = ['image', 'bug'];
    let canvas = appCanvas.cy.elements().jsons(); // console.log(canvas);
    for(let el of canvas) {
      for (let attr of attrs) { // console.log(el, el.data[attr])
        if (el.data.image) delete el.data[attr];
      }
    }
    // console.log(canvas);
    dataMap.set('canvas', Core.compress(canvas));
    return dataMap;
  }
  static compare(dataMap, appCanvas, conceptMap) {
    let learnerMapData = KitBuildUI.buildConceptMapData(appCanvas);
    learnerMapData.conceptMap = conceptMap;
    // console.log(learnerMapData);
    Analyzer.composePropositions(learnerMapData);
    let direction = CDM.conceptMap.map.direction;
    let compare = Analyzer.compare(learnerMapData, direction);
    // console.warn(compare);
    dataMap.set('compare', Core.compress(compare));
    return dataMap; 
  }
}

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

CDM = {};
CDM.cookieid = 'CORESID-mgm__kb';
CDM.options = {};

class App {
  constructor() {
    this.kbui = KitBuildUI.instance(App.canvasId);
    let canvas = this.kbui.canvases.get(App.canvasId);
    canvas.addToolbarTool(KitBuildToolbar.NODE_CREATE, { priority: 2, visible: false }); // handle concept map type
    canvas.addToolbarTool(KitBuildToolbar.UNDO_REDO, { priority: 3 });
    canvas.addToolbarTool(KitBuildToolbar.CAMERA, { priority: 4 });
    canvas.addToolbarTool(KitBuildToolbar.UTILITY, {
      priority: 5,
      trash: false,
    });
    canvas.addToolbarTool(KitBuildToolbar.LAYOUT, {priority: 6}); //{ stack: "right" }
    canvas.toolbar.render();

    canvas.addCanvasTool(KitBuildCanvasTool.CENTROID);
    canvas.addCanvasTool(KitBuildCanvasTool.DISTANCECOLOR);

    this.canvas = canvas;
    this.session = Core.instance().session();
    this.ajax = Core.instance().ajax();
    this.runtime = Core.instance().runtime();
    this.config = Core.instance().config();

    // Hack for sidebar-panel show/hide
    // To auto-resize the canvas.
    // AA
    // let observer = new MutationObserver((mutations) => $(`#${App.canvasId} > div`).css('width', 0))
    // observer.observe(document.querySelector('#admin-sidebar-panel'), {attributes: true})
    // Enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip({ html: true });

    // Browser lifecycle event
    // KitBuildUI.addLifeCycleListener(App.onBrowserStateChange);

    // Logger
    // if (typeof Logger != "undefined") {
      // let url = Core.instance().config().get('baseurl')
      // let sessid = Core.instance().config().get("sessid");
      // let seq = Core.instance().config().get("seq");
      // window.history.replaceState({}, document.title, url);
      // this.logger = KitBuildLogger.instance(
      //   null,
      //   seq ?? 0,
      //   sessid,
      //   canvas,
      //   null
      // ).enable();
      // if (this.logger.seq != 0) this.seq = seq;
      // App.loggerListener = this.logger.onCanvasEvent.bind(this.logger);
      // L.log = this.logger.log.bind(this.logger);
      // L.log(`init-${this.constructor.name}`);
      // canvas.on("event", App.eventListener);
    // }


    // console.log(this, typeof KitBuildLogger);

    this.handleEvent();
    this.handleRefresh();
  }

  static instance() {
    App.inst = new App();
    App.timer = new Timer('.app-navbar .timer');
    // App.timer.on();
    App.feedbackDelay = 30;
    return App.inst;
  }

  // setUser(user = null) {
  //   this.user = user;
  // }

  // setConceptMap(conceptMap) {
  //   console.warn("CONCEPT MAP SET:", conceptMap);
  //   this.conceptMap = conceptMap;
  //   if (conceptMap) {
  //     this.canvas.direction = conceptMap.map.direction;
  //     this.session.set("cmid", conceptMap.map.cmid);
  //     let status =
  //       `<span class="mx-2 d-flex align-items-center status-cmap">` +
  //       `<span class="badge rounded-pill bg-secondary">ID: ${conceptMap.map.cmid}</span>` +
  //       `<span class="text-secondary ms-2 text-truncate"><small>${conceptMap.map.title}</small></span>` +
  //       `</span>`;
  //     StatusBar.instance().remove(".status-cmap").prepend(status);
  //   } else {
  //     StatusBar.instance().remove(".status-cmap");
  //     this.session.unset("cmid");
  //   }
  //   $('[data-bs-toggle="tooltip"]').tooltip({ html: true });
  // }

  // setKitMap(kit = null) {
  //   console.warn("KIT MAP SET:", kit);
  //   this.kit = kit;
  //   if (kit) {
  //     this.setConceptMap(kit.conceptMap);
  //     this.session.set("kid", kit.map.kid);
  //     let tooltipText = "";
  //     tooltipText += "FBLV:" + kit.parsedOptions.feedbacklevel;
  //     tooltipText += ",FBSV:" + kit.parsedOptions.feedbacksave;
  //     tooltipText += ",FFB:" + kit.parsedOptions.fullfeedback;
  //     tooltipText += ",LOG:" + kit.parsedOptions.log;
  //     tooltipText += ",MOD:" + kit.parsedOptions.modification;
  //     tooltipText += ",RD:" + kit.parsedOptions.readcontent;
  //     tooltipText += ",RST:" + kit.parsedOptions.reset;
  //     tooltipText += ",SVLD:" + kit.parsedOptions.saveload;
  //     let status =
  //       `<span class="mx-2 d-flex align-items-center status-kit">` +
  //       `<span class="badge rounded-pill bg-primary" role="button" data-bs-toggle="tooltip" data-bs-placement="top" title="${tooltipText}">ID: ${kit.map.kid}</span>` +
  //       `<span class="text-secondary ms-2 text-truncate"><small>${kit.map.name}</small></span>` +
  //       `</span>`;
  //     KitBuild.getTextOfKit(kit.map.kid).then((text) => {
  //       this.text = text;
  //       let textLabel = text ? `Text: ${text.title}` : "Text: None";
  //       let statusText = `<span class="mx-2 d-flex align-items-center status-text">`;
  //       statusText += `<span class="badge rounded-pill bg-danger">${textLabel}</span>`;
  //       statusText += `</span>`;
  //       StatusBar.instance().remove(".status-text").append(statusText);
  //     });
  //     StatusBar.instance().remove(".status-kit").append(status);
  //   } else {
  //     this.setConceptMap();
  //     this.text = null;
  //     this.session.unset("kid");
  //     StatusBar.instance().remove(".status-kit");
  //     StatusBar.instance().remove(".status-text");
  //   }
  //   $('[data-bs-toggle="tooltip"]').tooltip({ html: true });
  // }

  // setLearnerMap(learnerMap) {
  //   console.warn("LEARNER MAP SET:", learnerMap);
  //   this.learnerMap = learnerMap;
  //   if (learnerMap) {
  //     this.session.set("lmid", learnerMap.map.lmid);
  //     let status =
  //       `<span class="mx-2 d-flex align-items-center status-learnermap">` +
  //       `<span class="badge rounded-pill bg-warning text-dark">ID: ${learnerMap.map.lmid}</span>` +
  //       `</span>`;
  //     StatusBar.instance().remove(".status-learnermap").append(status);
  //   } else {
  //     StatusBar.instance().remove(".status-learnermap");
  //     this.session.unset("lmid");
  //   }
  // }

  // openLearnerMap(kit, learnerMap = null) {
  //   let promise = new Promise((resolve, reject) => {
  //     if (!kit) {
  //       UI.errorDialog('Invalid Kit!').show();
  //       return;
  //     }
  //     this.setKitMap(kit);
  //     App.parseKitMapOptions(kit);
  //     this.logger.setConceptMap(kit.conceptMap);
  //     this.setLearnerMap(learnerMap ?? undefined);
  //     L.log("open-kit", kit.map);
  //     if (learnerMap) {
  //       L.log("continue-recompose", learnerMap.map, null, {
  //         lmid: learnerMap.map.lmid,
  //         kid: kit.map.kid,
  //         includeMapData: true,
  //       });
  //       this.logger.setLearnerMapId(learnerMap.map.lmid);
  //       learnerMap.kit = kit;
  //       learnerMap.conceptMap = kit.conceptMap;
  //       this.canvas.cy.elements().remove();
  //       this.canvas.cy.add(KitBuildUI.composeLearnerMap(learnerMap));
  //       this.canvas.applyElementStyle();
  //       this.canvas.toolbar.tools
  //         .get(KitBuildToolbar.CAMERA)
  //         .fit(null, { duration: 0 })
  //         .then(() => {
  //           App.collab(
  //             "command",
  //             "set-kit-map",
  //             kit,
  //             this.canvas.cy.elements().jsons()
  //           );
  //         });
  //       // this.setLearnerMap(learnerMap);
  //       // this.logger.setLearnerMapId(learnerMap.map.lmid);
  //       // L.log("load-learner-map", learnerMap.map, null, {
  //       //   includeMapData: true,
  //       //   lmid: learnerMap.map.lmid,
  //       // });
  //       // UI.info("Concept map loaded.").show();
  //       // confirm.hide();
  //       this.getFeedbackAndSubmitCount(learnerMap.map.author, learnerMap.map.kid, kit.parsedOptions);
  //       UI.success("Saved concept map has been loaded.").show();
  //       resolve(learnerMap);
  //     } else {
  //       this.logger.reset();
  //       L.log("begin-recompose");
  //       App.resetMapToKit(kit, this.canvas).then(() => {
  //         let cyData = this.canvas.cy.elements().jsons();
  //         App.collab("command", "set-kit-map", kit, cyData);
  //         this.saveInitialLearnerMap(kit).then((learnerMap) => {
  //           resolve(learnerMap);
  //           this.getFeedbackAndSubmitCount(learnerMap.map.author, learnerMap.map.kid, kit.parsedOptions);
  //         }, err => reject(err));
  //       });
  //     }
  //   });
  //   return promise;
  // }

  // saveInitialLearnerMap(kit) {
  //   let promise = new Promise((resolve, reject) => {
  //     let data = Object.assign(
  //       {
  //         lmid: null,
  //         kid: kit.map.kid,
  //         author: App.inst.user
  //           ? App.inst.user.username
  //           : null,
  //         type: "draft",
  //         cmid: kit.map.cmid,
  //         create_time: null,
  //         data: null,
  //       },
  //       KitBuildUI.buildConceptMapData(this.canvas)
  //     ); // console.log(data); // return
  //     this.ajax
  //       .post("kitBuildApi/saveLearnerMap", {
  //         data: Core.compress(data),
  //       })
  //       .then((learnerMap) => {
  //         // console.log(kit);
  //         this.setLearnerMap(learnerMap);
  //         this.logger.setLearnerMapId(learnerMap.map.lmid);
  //         UI.success("Concept map has been initialized.").show();
  //         L.log("learnermap-initialized", learnerMap.map, null, {
  //           lmid: learnerMap.map.lmid,
  //           includeMapData: true,
  //         });
  //         this.getFeedbackAndSubmitCount(learnerMap.map.author, learnerMap.map.kid, kit.parsedOptions);
  //         resolve(learnerMap);
  //       })
  //       .catch((error) => {
  //         UI.error(error).show();
  //         reject(error);
  //       });
  //   });
  //   return promise;
  // }

  // getFeedbackAndSubmitCount(username, kid, options = null) {
  //   $('.bt-feedback .count').html(``);
  //   $('.bt-submit .count').html(``);
  //   if (username && kid) {
  //     this.ajax.post('kitBuildApi/getFeedbackAndSubmitCount', {
  //       username: username,
  //       kid: kid
  //     }).then((count) => {
  //       if (options && options.countfb) 
  //         $('.bt-feedback .count').html(`(&times;${count.feedback})`);
  //       if (options && options.countsubmit)
  //         $('.bt-submit .count').html(`(&times;${count.submit})`);
  //     }, (err) => UI.errorDialog(err));
  //   } else {
  //     let feedbackCount = 0;
  //     let submitCount = 0;
  //     if (options && options.countfb)
  //       $('.bt-feedback .count').html(`(&times;${feedbackCount})`);
  //     if (options && options.countsubmit)
  //       $('.bt-submit .count').html(`(&times;${submitCount})`);
  //   }
  // }

  handleEvent() {


    /**
     * Concept Map reader 
     * */
    const fileInput = $('.file-input');
    const droparea = $('.file-drop-area');
    const deleteButton = $('.item-delete');
    
    fileInput.on('dragenter focus click', () => { droparea.addClass('is-active') });
    fileInput.on('dragleave blur drop', () => { droparea.removeClass('is-active') });
    fileInput.on('change', () => {
      let filesCount = $(fileInput)[0].files.length;
      let textContainer = $(fileInput).prev();
      if (filesCount === 1) {
        let file = $(fileInput)[0].files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
          let content = event.target.result;
          console.log(content);
          let data = App.parseIni(content);
          console.log(data);
          try {
            let conceptMap = Core.decompress(data.conceptMap.replaceAll('"',''));
            let kit = Core.decompress(data.kit.replaceAll('"',''));
            console.log(conceptMap, kit);
            CDM.conceptMap = conceptMap;
            CDM.kitId = fileName;
            CDM.conceptMapId = conceptMap.map.cmid;
            CDM.kit = kit;
            console.error(kit);
          } catch(e) {
            // 
            textContainer.html(fileName + ' <strong class="text-danger">File is invalid.</strong>');
            return;
          }
        };
        // console.log(file);
        reader.readAsText(file);
        let fileName = $(fileInput).val().split('\\').pop();
        textContainer.html(fileName);
        $('.item-delete').css('display', 'inline-block');
      } else if (filesCount === 0) {
        textContainer.text('or drop files here');
        $('.item-delete').css('display', 'none');
      } else {
        textContainer.text(filesCount + ' files selected');
        $('.item-delete').css('display', 'inline-block');
      }
    });
    deleteButton.on('click', () => {
      $('.file-input').val(null);
      $('.file-msg').text('or drop files here');
      $('.item-delete').css('display', 'none');
    });










    let openDialog = UI.modal("#concept-map-open-dialog", {
      hideElement: ".bt-cancel",
      width: "700px",
    });
    let contentDialog = UI.modal("#kit-content-dialog", {
      hideElement: ".bt-close",
      backdrop: false,
      get height() {
        return ($("body").height() * 0.7) | 0;
      },
      get offset() {
        return { left: ($("body").width() * 0.1) | 0 };
      },
      draggable: true,
      dragHandle: ".drag-handle",
      resizable: true,
      resizeHandle: ".resize-handle",
      minWidth: 375,
      minHeight: 200,
      onShow: () => {
        let sdown = new showdown.Converter({
          strikethrough: true,
          tables: true,
          simplifiedAutoLink: true,
        });
        sdown.setFlavor("github");
        console.log(contentDialog.text);
        let htmlText = contentDialog.text
          ? sdown.makeHtml(contentDialog.text.content)
          : "<em>Content text unavailable.</em>";
        $("#kit-content-dialog .content").html(htmlText);
        hljs.highlightAll();
      },
    });
    contentDialog.setContent = (text, type = "md") => {
      contentDialog.text = text;
      return contentDialog;
    };
    contentDialog.on("event", (event, data) => {
      L.log(`content-${event}`, data);
    });

    let feedbackReasonDialog = UI.modal('#feedback-reason-dialog', {
      hideElement: ".bt-close",
      width: 575,
      onShow: () => {
        $('#inputcorrect').prop('checked', false);
        $('#inputinformation').prop('checked', false);
        $('#inputunderstand').prop('checked', false);
        $('#inputotherreason').val('');
      },
    });

    this.feedbackNearbyDialog = UI.modal('#feedback-nearby-dialog', {
      hideElement: ".bt-close",
      width: 575,
      onShow: () => {
        $('#feedback-nearby-dialog .inputinformation').prop('checked', false);
        $('#feedback-nearby-dialog .inputunderstand').prop('checked', false);
        $('#feedback-nearby-dialog .inputotherreason').val('');
      },
    });

    let feedbackDialog = UI.modal("#feedback-dialog", {
      hideElement: ".bt-close",
      backdrop: false,
      draggable: true,
      dragHandle: ".drag-handle",
      width: 375,
      onShow: () => {
        $("#feedback-dialog")
          .off("click")
          .on("click", ".bt-modify", (e) => {
            $(".app-navbar .bt-clear-feedback").trigger("click");
            feedbackDialog.hide();
          });
      },
    });
    feedbackDialog.setCompare = (
      compare,
      level = Analyzer.MATCH | Analyzer.EXCESS
    ) => {
      feedbackDialog.compare = compare;
      console.log(compare, level);
      let content = "";
      if (compare.match.length && level & Analyzer.MATCH) {
        content += `<div class="d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-1 mx-3"></i> `;
        content += `<span>You have <strong class="text-success fs-bold">${compare.match.length} matching</strong> propositions.</span></div>`;
      }
      if (compare.excess.length && level & Analyzer.EXCESS) {
        content += `<div class="d-flex align-items-center"><i class="bi bi-exclamation-triangle-fill text-primary fs-1 mx-3"></i> `;
        content += `<span>You have <strong class="text-primary fs-bold">${compare.excess.length} excessive</strong> propositions.</span></div>`;
      }
      if (compare.miss.length && level != Analyzer.NONE) {
        content += `<div class="d-flex align-items-center"><i class="bi bi-exclamation-triangle-fill text-danger fs-1 mx-3"></i> `;
        content += `<span>You have <strong class="text-danger fs-bold">${compare.miss.length} missing</strong> propositions.</span></div>`;
      }

      if (compare.excess.length == 0 && compare.miss.length == 0) {
        content = `<div class="d-flex align-items-center"><i class="bi bi-check-circle-fill text-success fs-1 mx-3"></i> `;
        content += `<span><span class="text-success">Great!</span><br>All the propositions are <strong class="text-success fs-bold">matching</strong>.</span></div>`;
      }

      $("#feedback-dialog .feedback-content").html(content);
      return feedbackDialog;
    };

    /**
     * Open or Create New Kit
     * */

    $(".app-navbar").on("click", ".bt-open-kit", () => {
      if (feedbackDialog.learnerMapEdgesData)
        $(".app-navbar .bt-clear-feedback").trigger("click");
      let tid = openDialog.tid;
      if (!tid)
        $("#concept-map-open-dialog .list-topic .list-item.default").trigger("click");
      else
        $(`#concept-map-open-dialog .list-topic .list-item[data-tid="${tid}"]`).trigger("click");
      $("#concept-map-open-dialog .bt-refresh-topic-list").trigger("click");
      $('input[name="userid"]').val(App.getCookie('userid'));
      openDialog.show();
    });

    $('#concept-map-open-dialog').on('submit', (e) => { e.preventDefault(); console.error(e); });

    $('#concept-map-open-dialog').on('click', '.bt-open-id', (e) => {
      e.preventDefault();
      let remember = $('#concept-map-open-dialog input#inputrememberme:checked').val();
      let userid = $('#concept-map-open-dialog input[name="userid"]').val().trim();
      let url = Core.instance().config('baseurl') + "mapApi/get/";
      url += $('#concept-map-open-dialog input[name="mapid"]').val().trim();
      // console.log(url, remember, userid);
      Core.instance().ajax().post(url, {
        remember: remember ? 1 : 0,
        userid: userid
      }).then(result => { // console.log(result.mapdata);
        let data = App.parseIni(result.mapdata);
        try {
          let conceptMap = Core.decompress(data.conceptMap.replaceAll('"',''));
          let kit = Core.decompress(data.kit.replaceAll('"',''));
          // console.log(conceptMap, kit);
          CDM.conceptMap = conceptMap;
          CDM.kitId = kit.map.id;
          CDM.conceptMapId = kit.map.cmid;
          CDM.kit = kit;
          // console.error(CDM);
        } catch(e) { console.error(e); }
        if (!CDM.conceptMap) {
          UI.errorDialog("Invalid concept map data.").show();
          return;
        }
        if (!$('#concept-map-open-dialog input[name="userid"]').val().trim()) {
          UI.warningDialog("Please enter your name or a user ID.").show();
          return;
        }
        App.openKit().then(() => {
          if (remember) Core.instance().cookie().set('userid', userid);
          else Core.instance().cookie().unset('userid');
          openDialog.hide();
          // console.log('new timer');
          App.timer = new Timer('.app-navbar .timer');
          App.timer.on();
        });
        // console.log(data);
        // console.warn("Log status: ", result);
      }).catch(error => {
        console.error(error);
        UI.errorDialog(error).show();
        return;
      });
    });

    $('#concept-map-open-dialog').on('click', '.bt-open-url', (e) => {
      e.preventDefault();
      // let url = Core.instance().config('baseurl') + "mapApi/get";
      let remember = $('#concept-map-open-dialog input#inputrememberme:checked').val();
      let userid = $('#concept-map-open-dialog input[name="userid"]').val().trim();
      let url = $('#concept-map-open-dialog input[name="mapurl"]').val().trim();
      Core.instance().ajax().post(url, {
        remember: remember ? 1 : 0,
        userid: userid
      }).then(result => { // console.log(result.mapdata);
        let data = App.parseIni(result.mapdata);
        try {
          let conceptMap = Core.decompress(data.conceptMap.replaceAll('"',''));
          let kit = Core.decompress(data.kit.replaceAll('"',''));
          // console.log(conceptMap, kit);
          CDM.conceptMap = conceptMap;
          CDM.kitId = kit.map.id;
          CDM.conceptMapId = kit.map.cmid;
          CDM.kit = kit;
          // console.error(CDM);
        } catch(e) { console.error(e); }
        if (!CDM.conceptMap) { console.error("X");
          UI.errorDialog("Invalid concept map data.").show();
          return;
        }
        if (!$('#concept-map-open-dialog input[name="userid"]').val().trim()) {
          UI.warningDialog("Please enter your name or a user ID.").show();
          return;
        }
        App.openKit().then(() => {
          openDialog.hide();
        });
        // console.log(data);
        // console.warn("Log status: ", result);
      }).catch(error => {
        console.error("Log error: ", error);
        UI.errorDialog("Invalid concept map data.").show();
        return;
      });
    });

    $('#concept-map-open-dialog').on('click', '.bt-open', (e) => {
      if (!CDM.conceptMap) { 
        UI.errorDialog("Invalid concept map data.").show();
        return;
      }
      if (!$('#concept-map-open-dialog input[name="userid"]').val().trim()) {
        UI.warningDialog("Please enter your name or a user ID.").show();
        return;
      }
      App.openKit().then(() => {
        openDialog.hide();
      });
    });

    /**
     * Content
     * */

    $(".app-navbar").on("click", ".bt-content", () => {
      // console.log(App.inst)
      if (!CDM.kit) {
        UI.dialog("Please open a kit to see its content.").show();
        return;
      }
      contentDialog.setContent(this.text).show();
    });

    $("#kit-content-dialog .bt-scroll-top").on("click", (e) => {
      $("#kit-content-dialog .content").parent().animate({ scrollTop: 0 }, 200);
    });

    $("#kit-content-dialog .bt-scroll-more").on("click", (e) => {
      let height = $("#kit-content-dialog .content").parent().height();
      let scrollTop = $("#kit-content-dialog .content").parent().scrollTop();
      $("#kit-content-dialog .content")
        .parent()
        .animate({ scrollTop: scrollTop + height - 16 }, 200);
    });

    /**
     * Save Load Learner Map
     * */

    $(".app-navbar").on("click", ".bt-save", () => {

      // console.log(CDM); return;
      if(!CDM.kit) new CoreDialog('Please open a kit').show();

      let {d, lmapdata} = this.buildLearnerMapData(); // console.log(canvas);
      let data = {};
      data.id = CDM.kit.map.id;
      data.cmid = CDM.kit.map.cmid;
      data.userid = CDM.userid;
      data.data = lmapdata;
      data.sessid = App.getCookie(CDM.cookieid);
      console.log(data);

      this.session.set('draft-map', Core.compress(data)).then((result) => {
        console.log(result);
        UI.success("Concept map has been saved successfully.").show();
        let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
        L.canvas(dataMap, App.inst.canvas);
        L.compare(dataMap, App.inst.canvas, CDM.conceptMap.canvas);
        L.log('save-draft', {
          id: data.id,
          cmid: data.cmid,
          userid: data.userid,
          sessid: data.sessid
        }, dataMap);
      });


    });
    $(".app-navbar").on("click", ".bt-load", () => {

      if(!CDM.kit) new CoreDialog('Please open a kit').show();
      this.session.get('draft-map').then(result => {
        let lmapdata = Core.decompress(result);

        console.warn(lmapdata, App.getCookie(CDM.cookieid));

        if (!lmapdata.data || !lmapdata.data.map) {
          UI.error('Invalid data.').show();
          return;
        }
        if(lmapdata.id != CDM.kit.map.id ||
          lmapdata.cmid != CDM.kit.map.cmid ||
          lmapdata.userid != CDM.userid
        ) {
          UI.error('Invalid draft.').show();
          return;
        }

        UI.confirm('Replace current concept map with the saved one?')
          .positive(e => {
            console.log(lmapdata);
            lmapdata.data.canvas.conceptMap = CDM.conceptMap.canvas;
            let lmap = KitBuildUI.composeLearnerMap(lmapdata.data.canvas);
            console.log(lmap);
            this.canvas.cy.elements().remove();
            this.canvas.cy.add(lmap);
            this.canvas.applyElementStyle();
            this.canvas.toolbar.tools
              .get(KitBuildToolbar.CAMERA)
              .fit(null, { duration: 0 });
            KitBuildUI.showBackgroundImage(this.canvas);

            let sessid = App.getCookie(CDM.cookieid); 
            console.log(sessid, lmapdata.sessid);

            let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
            L.canvas(dataMap, App.inst.canvas);
            L.compare(dataMap, App.inst.canvas, CDM.conceptMap.canvas);
            L.log('load-draft', {
              sessid: sessid,
              psessid: lmapdata.sessid
            }, dataMap);

          }).show();
      });

      // let kit = CDM.kit;
      // if (!kit) {
      //   UI.warning("Please open a kit.").show();
      //   return;
      // }
      // if (feedbackDialog.learnerMapEdgesData)
      //   $(".app-navbar .bt-clear-feedback").trigger("click");

      // let data = {
      //   kid: kit.map.kid,
      //   username: App.inst.user.username,
      // };
      // if (!data.username) delete data.username;
      // this.ajax
      //   .post("kitBuildApi/getLastDraftLearnerMapOfUser", data)
      //   .then((learnerMap) => {
      //     if (!learnerMap) {
      //       UI.warning("No user saved map data for this kit.").show();
      //       return;
      //     }
      //     if (this.canvas.cy.elements().length) {
      //       let confirm = UI.confirm("Load saved concept map?")
      //         .positive(() => {
      //           learnerMap.kit = kit;
      //           learnerMap.conceptMap = kit.conceptMap;
      //           this.canvas.cy.elements().remove();
      //           this.canvas.cy.add(KitBuildUI.composeLearnerMap(learnerMap));
      //           this.canvas.applyElementStyle();
      //           this.canvas.toolbar.tools
      //             .get(KitBuildToolbar.CAMERA)
      //             .fit(null, { duration: 0 })
      //             .then(() => {
      //               App.collab(
      //                 "command",
      //                 "set-kit-map",
      //                 kit,
      //                 this.canvas.cy.elements().jsons()
      //               );
      //             });
      //           App.inst.setLearnerMap(learnerMap);
      //           this.logger.setLearnerMapId(learnerMap.map.lmid);
      //           L.log("load-learner-map", learnerMap.map, null, {
      //             includeMapData: true,
      //             lmid: learnerMap.map.lmid,
      //           });
      //           UI.info("Concept map loaded.").show();
      //           confirm.hide();
      //         })
      //         .show();
      //       return;
      //     }
      //     App.openLearnerMap(learnerMap.map.lmid, this.canvas);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     UI.error("Unable to load saved concept map.").show();
      //   });
    });

    /**
     * Reset concept map to kit
     * */

    $(".app-navbar").on("click", ".bt-reset", (e) => {
      if (!CDM.kit) {
        UI.info("Please open a kit.").show();
        return;
      }
      if (feedbackDialog.learnerMapEdgesData)
        $(".app-navbar .bt-clear-feedback").trigger("click");

      let confirm = UI.confirm(
        "Do you want to reset this concept map as defined in the kit?"
      )
        .positive(() => {
          App.parseKitMapOptions(CDM.kit);
          App.resetMapToKit(CDM.kit, this.canvas).then(() => {
            // Remove attribute of image binary data 
            let attrs = ['image', 'bug'];
            let canvas = this.canvas.cy.elements().jsons(); // console.log(canvas);
            for(let el of canvas) {
              for (let attr of attrs) { // console.log(el, el.data[attr])
                if (el.data.image) delete el.data[attr];
              }
            }
            let dataMap = new Map([["cmapid", CDM.kitId]]);
            dataMap.set('canvas', Core.compress(canvas));
            let learnerMapData = KitBuildUI.buildConceptMapData(this.canvas);
            learnerMapData.conceptMap = CDM.conceptMap;
            console.log(learnerMapData);
            Analyzer.composePropositions(learnerMapData);
            let direction = learnerMapData.conceptMap.map.direction;
            let compare = Analyzer.compare(learnerMapData, direction);
            console.warn(compare);
            dataMap.set('compare', Core.compress(compare)); 
            L.log("reset", null, dataMap);
            // App.collab(
            //   "command",
            //   "set-kit-map",
            //   kit,
            //   this.canvas.cy.elements().jsons()
            // );
            // L.log("reset-learner-map", CDM.kit.map, null, {
            //   includeMapData: true,
            //   lmid: this.learnerMap.map.lmid,
            // });
          });
          let undoRedo = this.canvas.toolbar.tools.get(KitBuildToolbar.UNDO_REDO);
          if (undoRedo) undoRedo.clearStacks().updateStacksStateButton();
          confirm.hide();
          UI.info("Concept map has been reset.").show();
          return;
        })
        .show();
    });

    /**
     *
     * Feedback
     */
    $(".app-navbar").on("click", ".bt-feedback", () => {
      if (!CDM.kit) {
        UI.dialog('Please open a kit.').show();
        return;
      } 

      // console.log(App.timer, App.timer.ts, App.lastFeedback);
      if (!App.lastFeedback) {
        if (App.timer.ts < App.feedbackDelay) {
          let timeleft = App.feedbackDelay - (App.timer.ts - (App.lastFeedback ?? 0));
          UI.dialog(`Feedback is not available right now. Please wait for ${timeleft} seconds`).show();
          return;
        }
        // App.lastFeedback = App.timer.ts;
      } else {
        if (App.timer.ts - App.lastFeedback < App.feedbackDelay || App.timer.ts < App.feedbackDelay) {
          let timeleft = App.feedbackDelay - (App.timer.ts - App.lastFeedback);
          UI.dialog(`Feedback is not available right now. Please wait for ${timeleft} seconds`).show();
          return;
        }
      }

      if (feedbackDialog.learnerMapEdgesData)
        $(".app-navbar .bt-clear-feedback").trigger("click");
      feedbackReasonDialog.show();
      return;      
    });
    $('#feedback-reason-dialog').on('click', '.bt-get-feedback', (e) => {

      let cor = $('#inputcorrect').prop('checked');
      let inf = $('#inputinformation').prop('checked');
      let und = $('#inputunderstand').prop('checked');
      let oth = $('#inputotherreason').val().trim();

      let reason = [];
      if (cor) reason.push('cor');
      if (inf) reason.push('inf');
      if (und) reason.push('und');
      if (oth.length != 0) reason.push($('#inputotherreason').val().trim());

      if (!(cor || inf || und || oth.length != 0)) {
        UI.dialog('Please provide a reason for feedback.').show();
        return;
      } 

      feedbackReasonDialog.hide();

      let learnerMapData = KitBuildUI.buildConceptMapData(this.canvas);
      feedbackDialog.learnerMapEdgesData = this.canvas.cy.edges().jsons();
      learnerMapData.conceptMap = CDM.conceptMap.canvas;
      // console.log(CDM);
      // console.log(learnerMapData);
      Analyzer.composePropositions(learnerMapData);
      let direction = CDM.conceptMap.map.direction;
      // console.warn(CDM.kit, CDM.kit.map);
      let feedbacklevel = CDM.kit.parsedOptions.feedbacklevel;
      let compare = Analyzer.compare(learnerMapData, direction);
      // console.log(compare);
      let level = Analyzer.NONE;
      let dialogLevel = Analyzer.NONE;
      switch (feedbacklevel) {
        case 0:
        case 1:
          level = Analyzer.NONE;
          break;
        case 2:
          level = Analyzer.MATCH | Analyzer.EXCESS;
          break;
        case 3:
          level = Analyzer.MATCH | Analyzer.EXCESS | Analyzer.EXPECT;
          break;
        case 4:
          level = Analyzer.MATCH | Analyzer.EXCESS | Analyzer.MISS;
          break;
      }
      switch (feedbacklevel) {
        case 0:
          dialogLevel = Analyzer.NONE;
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          dialogLevel = Analyzer.MATCH | Analyzer.EXCESS;
          break;
      }

      Analyzer.showCompareMap(compare, this.canvas.cy, direction, level);
      this.canvas.canvasTool
        .enableIndicator(false)
        .enableConnector(false)
        .clearCanvas()
        .clearIndicatorCanvas();

      if (feedbacklevel == 0) {
        UI.dialog("Feedback is not enabled for this kit.")
          .on("dismiss", () => {
            $(".app-navbar .bt-clear-feedback").trigger("click");
          })
          .show();
      } else feedbackDialog.setCompare(compare, dialogLevel).show();
      let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
      dataMap.set('compare', Core.compress(compare));
      L.canvas(dataMap, App.inst.canvas);
      L.log("feedback", {
        level: level,
        compare: compare,
        reason: reason
      }, dataMap);
      $(".app-navbar .bt-feedback").prop('disabled', true);
      $(".app-navbar .bt-clear-feedback").prop('disabled', false);
      App.lastFeedback = App.timer.ts;
    });
    $(".app-navbar").on("click", ".bt-clear-feedback", () => {
      if (!feedbackDialog.learnerMapEdgesData) return;
      this.canvas.cy.edges().remove();
      this.canvas.cy.add(feedbackDialog.learnerMapEdgesData);
      this.canvas.applyElementStyle();
      this.canvas.canvasTool
        .enableIndicator()
        .enableConnector()
        .clearCanvas()
        .clearIndicatorCanvas();
      feedbackDialog.learnerMapEdgesData = null;
      let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
      L.log("resume-feedback", undefined, dataMap);
      $(".app-navbar .bt-feedback").prop('disabled', false);
      $(".app-navbar .bt-clear-feedback").prop('disabled', true);
    });
    $('#feedback-nearby-dialog').on('click', '.bt-get-feedback', e => {
      let inf = $('#feedback-nearby-dialog .inputinformation').prop('checked');
      let und = $('#feedback-nearby-dialog .inputunderstand').prop('checked');
      let oth = $('#feedback-nearby-dialog .inputotherreason').val().trim();
      console.log(inf, und, oth);

      let reason = [];
      if (inf) reason.push('inf');
      if (und) reason.push('und');
      if (oth.length != 0) reason.push($('#feedback-nearby-dialog .inputotherreason').val().trim());

      if (!(inf || und || oth.length != 0)) {
        UI.dialog('Please provide a reason for feedback.').show();
        return;
      } 

      this.feedbackNearbyDialog.hide();

      let learnerMapData = KitBuildUI.buildConceptMapData(this.canvas);
      feedbackDialog.learnerMapEdgesData = this.canvas.cy.edges().jsons();
      learnerMapData.conceptMap = CDM.conceptMap.canvas;
      Analyzer.composePropositions(learnerMapData);
      let direction = CDM.conceptMap.map.direction;
      let compare = Analyzer.compare(learnerMapData, direction);
      
      this.canvas.canvasTool
        .enableIndicator(false)
        .enableConnector(false)
        .clearCanvas()
        .clearIndicatorCanvas();

      let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
      dataMap.set('compare', Core.compress(compare));
      L.canvas(dataMap, App.inst.canvas);
      L.log("feedback-distance", {
        compare: compare,
        reason: reason
      }, dataMap);
      $(".app-navbar .bt-feedback").prop('disabled', true);
      $(".app-navbar .bt-clear-feedback").prop('disabled', false);
      let disTool = this.canvas.canvasTool.tools.get(KitBuildCanvasTool.DISTANCECOLOR);
      let node = this.canvas.cy.nodes('#'+this.feedbackNearbyDialog.nodeId);
      disTool.showNearby(node);
      App.lastFeedback = App.timer.ts;
    });

    /**
     *
     * Submit
     */
    $(".app-navbar").on("click", ".bt-submit", () => {
      if (feedbackDialog.learnerMapEdgesData)
        $(".app-navbar .bt-clear-feedback").trigger("click");
      let confirm = UI.confirm(
        "Do you want to submit your concept map?<br/>This will end your concept map recomposition session."
      ).positive(() => {
        console.warn(CDM);
        let { data, lmapdata } = this.buildLearnerMapData();
        console.log(data, lmapdata); // return
        confirm.hide();
        // return;
        this.ajax
          .post("mapApi/saveLearnerMap", data)
          .then(learnerMap => { console.log(learnerMap);
            data.id = learnerMap.id;
            data.created = learnerMap.created;
            data.duration = App.timer.ts;
            let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
            L.canvas(dataMap, App.inst.canvas);
            L.compare(dataMap, App.inst.canvas, CDM.conceptMap.canvas);
            L.log('submit', data, dataMap);
            UI.dialog('Your final concept map has been submitted. You now may close this window.').show();
          }).catch((error) => {
            console.error(error);
          });
        }).show();
    });

  }

  buildLearnerMapData() {
    this.canvas.cy.elements().removeClass('select').unselect();
    let lmapdata = {};
    lmapdata.canvas = KitBuildUI.buildConceptMapData(this.canvas);
    lmapdata.canvas.concepts.forEach(c => {
      let d = JSON.parse(c.data);
      delete d.image; // clean image data of lmap
      c.data = JSON.stringify(d);
    });
    lmapdata.map = {
      userid: CDM.userid ?? null,
      cmid: CDM.conceptMap.map.cmid ? CDM.conceptMap.map.cmid : null,
      kid: CDM.kit.map.id ? CDM.kit.map.id : null,
      type: 'final'
    };
    console.warn(lmapdata);
    let data = {
      id: null, // so it will insert new rather than update
      userid: lmapdata.map.userid,
      cmid: lmapdata.map.cmid,
      kid: lmapdata.map.kid,
      type: "final",
      data: Core.compress(lmapdata),
      created: null
    };
    delete data.id;
    delete data.created;
    return { data, lmapdata };
  }

  /**
   *
   * Handle refresh web browser
   */

  handleRefresh() {
    this.session.getAll().then((sessions) => {
      // console.log(sessions, document.cookie);
      Logger.userid = sessions.userid;
      Logger.sessid = App.getCookie(CDM.cookieid);
      Logger.canvasid = App.canvasId;
      // console.log(Logger.userid, Logger.sessid);
      this.canvas.on("event", App.onCanvasEvent);
    });
    // let stateData = JSON.parse(localStorage.getItem(App.name));
    // console.warn("RESTORE STATE:", stateData)
    // this.session.getAll().then((sessions) => {
    //   // console.log(sessions)

    //   try {
    //     if (stateData && stateData.logger) {
    //       // restore previous logger data and sequence
    //       // console.log(this.logger.seq);
    //       this.logger.username = sessions.user ? sessions.user.username : null;
    //       this.logger.seq = this.logger.seq == 1 ? stateData.logger.seq : this.logger.seq;
    //       this.logger.sessid = Core.instance().config().get("sessid");
    //       this.logger.canvas = this.canvas;
    //       this.logger.enable();
    //       L.log('restore-logger-state');
    //       // reattach logger
    //       if (App.loggerListener)
    //         this.canvas.off("event", App.loggerListener);
    //       App.loggerListener =
    //         App.inst.logger.onCanvasEvent.bind(App.inst.logger);
    //       this.canvas.on("event", App.onCanvasEvent);
    //     }
    //   } catch (error) {
    //     console.warn(error);
    //   }

    //   let kid = sessions.kid;
    //   let lmid = sessions.lmid;
    //   let promises = [];
    //   if (kid) promises.push(KitBuild.openKitMap(kid));
    //   if (lmid) promises.push(KitBuild.openLearnerMap(lmid));
    //   Promise.all(promises).then((maps) => {
    //     let [kit, learnerMap] = maps;
    //     // console.error(kit, learnerMap);
    //     App.parseKitMapOptions(kit);
    //     if (kit && !learnerMap)
    //       App.resetMapToKit(kit, this.canvas).then(() => {
    //         L.log("reset-map-to-kit", kit.map);
    //       });
    //     if (sessions.user && sessions.kid)
    //       this.getFeedbackAndSubmitCount(sessions.user.username, sessions.kid, kit.parsedOptions);
    //     if (learnerMap) {
    //       // console.log(learnerMap, this.logger)
    //       App.inst.setKitMap(kit);
    //       App.inst.setLearnerMap(learnerMap);
    //       learnerMap.kit = kit;
    //       learnerMap.conceptMap = kit.conceptMap;
    //       this.canvas.cy.elements().remove();
    //       this.canvas.cy.add(KitBuildUI.composeLearnerMap(learnerMap));
    //       this.canvas.applyElementStyle();
    //       this.canvas.toolbar.tools
    //         .get(KitBuildToolbar.CAMERA)
    //         .fit(null, { duration: 0 });
    //       this.logger.setLearnerMapId(learnerMap.map.lmid);
    //       this.logger.setConceptMap(kit.conceptMap);
    //       L.log("restore-kit", kit.map);
    //       L.log("restore-learner-map", learnerMap.map, null, {
    //         lmid: learnerMap.map.lmid,
    //         includeMapData: true,
    //       });
    //     } // else UI.warning('Unable to display kit.').show()
    //   });

    //   App.enableNavbarButton(false);
    //   if (sessions.user) {
    //     this.setUser(sessions.user);
    //     this.initCollab(sessions.user);
    //     App.enableNavbarButton(true);
    //     KitBuildCollab.enableControl();
    //     let status =
    //       `<span class="mx-2 d-flex align-items-center status-user" style="white-space: nowrap;">` +
    //       `<small class="text-dark fw-bold">${sessions.user.name}</small>` +
    //       `</span>`;
    //     StatusBar.instance().remove(".status-user").prepend(status);
    //     this.logger.username = sessions.user.username;
    //   } else $(".app-navbar .bt-sign-in").trigger("click");

    //   // listen to events for broadcast to collaboration room as commands
    //   this.canvas.on("event", App.onCanvasEvent);
    // });
  }

}

App.canvasId = "recompose-canvas";

App.getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

App.onBrowserStateChange = (event) => {
  // console.warn(event)
  L.log("browser-state-change", { from: event.oldState, to: event.newState });
  if (event.newState == "terminated") {
    let stateData = {};
    if (App.inst && App.inst.logger)
      stateData.logger = {
        username: App.inst.logger.username,
        seq: App.inst.logger.seq,
        sessid: App.inst.logger.sessid,
        enabled: App.inst.logger.enabled,
      };
    stateData.map = Core.compress(
      App.inst.canvas.cy.elements().jsons()
    );
    let cmapAppStateData = JSON.stringify(Object.assign({}, stateData));
    localStorage.setItem(App.name, cmapAppStateData);
  }
};

App.onCanvasEvent = (canvasId, event, data) => {
  console.log(canvasId, event, data);
  Logger.canvasid = canvasId;
  let skip = [ // for canvas data
    'camera-reset', 
    'camera-center', 
    'camera-fit', 
    'camera-zoom-in', 
    'camera-zoom-out'
  ];

  if (event == 'distance-feedback') {

    // console.log(App.timer, App.timer.ts, App.lastFeedback);
    if (!App.lastFeedback) {
      if (App.timer.ts < App.feedbackDelay) {
        let timeleft = App.feedbackDelay - (App.timer.ts - (App.lastFeedback ?? 0));
        UI.dialog(`Feedback is not available right now. Please wait for ${timeleft} seconds`).show();
        return;
      }
      // App.lastFeedback = App.timer.ts;
    } else {
      if (App.timer.ts - App.lastFeedback < App.feedbackDelay || App.timer.ts < App.feedbackDelay) {
        let timeleft = App.feedbackDelay - (App.timer.ts - App.lastFeedback);
        UI.dialog(`Feedback is not available right now. Please wait for ${timeleft} seconds`).show();
        return;
      }
    }

    App.inst.feedbackNearbyDialog.nodeId = data.id;
    App.inst.feedbackNearbyDialog.show();
    return;
  }

  let dataMap = L.dataMap(CDM.kitId, CDM.conceptMapId);
  if (!skip.includes(event))
    L.canvas(dataMap, App.inst.canvas);
  if (event.includes("connect"))
    L.compare(dataMap, App.inst.canvas, CDM.conceptMap.canvas);
  L.log(event, data, dataMap);
  // App.collab("command", event, canvasId, data);
};

App.openKit = () => {
  return new Promise((resolve, reject) => {
    CDM.userid = $('#concept-map-open-dialog input[name="userid"]').val().trim();
    // lmap.canvas.conceptMap = conceptMap.canvas;
    if (!CDM.kit) {
      CDM.kit = {};
      CDM.kit.map = {};
      CDM.kit.map.options = {};
      CDM.kit.canvas = CDM.conceptMap.canvas;
    }
  
    // console.log(CDM);
    CDM.kit.canvas.conceptMap = CDM.conceptMap.canvas;
    // console.log(Logger);
    if (typeof Logger != undefined) Logger.userid = CDM.userid;

    let canvas = App.inst.canvas;
  
    // let cyData = KitBuildUI.composeKitMap(data.lmap ? lmap.canvas : kit.canvas);
    App.parseKitMapOptions(CDM.kit);
    let cyData = KitBuildUI.composeKitMap(CDM.kit.canvas);
    canvas.cy.elements().remove();
    canvas.cy.add(cyData);
    // canvas.toolbar.tools.get(KitBuildToolbar.CAMERA).fit(null, {duration: 0});
    canvas.toolbar.tools
      .get(KitBuildToolbar.NODE_CREATE)
      .setActiveDirection(CDM.conceptMap.map.direction);
    canvas.canvasTool.tools
      .get(KitBuildCanvasTool.DISTANCECOLOR)
      .setConceptMap(CDM.conceptMap.canvas);
    canvas.applyElementStyle();
    canvas.cy.animate(Object.assign({
      center: { eles: canvas.cy.elements() },
      fit: {
        eles: canvas.cy.elements(),
        padding: 50
      },
      // complete: () => resolve()
    }, { duration: 0 }));
    KitBuildUI.showBackgroundImage(canvas);
    CDM.options = CDM.kit.map.options;
    let canvasJsons = canvas.cy.elements().jsons();
    let dataMap = new Map([
      ['kid', CDM.kitId],
      ['cmid', CDM.conceptMapId],
      ['canvas', Core.compress(canvasJsons)]
    ]);

    let learnerMapData = KitBuildUI.buildConceptMapData(App.inst.canvas);
    learnerMapData.conceptMap = CDM.conceptMap.canvas;
    // console.log(learnerMapData);
    let result = Analyzer.composePropositions(learnerMapData);
    // console.log(result, learnerMapData);
    let direction = CDM.conceptMap.map.direction;
    let compare = Analyzer.compare(learnerMapData, direction);
    // console.warn(compare);
    dataMap.set('compare', Core.compress(compare));  

    App.inst.session.regenerateId().then(sessid => {
      Logger.sessid = App.getCookie(CDM.cookieid);
      Logger.seq = 1;
      L.log("open-kit", CDM.kitId, dataMap);
    });

    resolve();
  });
}

/**
 *
 * Helpers
 */

App.parseIni = (data) => {
  var regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*;.*$/
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach(function(line){
    if(regex.comment.test(line)){
      return;
    }else if(regex.param.test(line)){
      var match = line.match(regex.param);
      if(section){
        value[section][match[1]] = match[2];
      }else{
        value[match[1]] = match[2];
      }
    }else if(regex.section.test(line)){
      var match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    }else if(line.length == 0 && section){
      section = null;
    };
  });
  return value;
}

App.parseKitMapOptions = (kit) => { 
  // console.log(kit);
  if (!kit) return;
  // console.error(kit, kit.map.options);
  kit.parsedOptions = App.parseOptions(kit.map.options, {
    layout: "preset",
    feedbacklevel: 2,
    fullfeedback: 1,
    modification: 1,
    readcontent: 1,
    saveload: 1,
    reset: 1,
    feedbacksave: 1,
    countfb: 0,
    countsubmit: 0,
    log: 0,
  });
  // console.log(kit);
};

App.resetMapToKit = (kit, canvas) => {
  return new Promise((resolve, reject) => {
    // will also set and cache the concept map
    // App.inst.setKitMap(kit);
    canvas.cy.elements().remove();
    canvas.cy.add(KitBuildUI.composeKitMap(kit.canvas));
    canvas.applyElementStyle();
    canvas.toolbar.tools
        .get(KitBuildToolbar.NODE_CREATE)
        .setActiveDirection(CDM.conceptMap.map.direction);
    canvas.applyElementStyle();
    console.warn(kit);
    if (kit.map.layout == "random") {
      canvas.cy
        .elements()
        .layout({
          name: "fcose",
          animationDuration: 0,
          fit: false,
          stop: () => {
            canvas.toolbar.tools
              .get(KitBuildToolbar.CAMERA)
              .center(null, { duration: 0 });
            resolve(true);
          },
        })
        .run();
    } else {
      canvas.toolbar.tools
        .get(KitBuildToolbar.CAMERA)
        .fit(null, { duration: 0 });
      resolve(true);
    }
    KitBuildUI.showBackgroundImage(canvas);
    resolve(true);

    // TODO: apply kit options to UI
    // console.log(kit)

    // let feedbacklevelFeature =
    //   '<button class="bt-feedback btn btn-warning"><i class="bi bi-eye-fill"></i> Feedback <span class="count"></span></button>';
    // feedbacklevelFeature +=
    //   '<button class="bt-clear-feedback btn btn-warning"><i class="bi bi-eye-slash-fill"></i> Clear Feedback</button>';
    // let saveloadFeature =
    //   '<button class="bt-save btn btn-secondary"><i class="bi bi-download"></i> Save</button>';
    // saveloadFeature +=
    //   '<button class="bt-load btn btn-secondary"><i class="bi bi-upload"></i> Load</button>';
    // let readcontentFeature =
    //   '<button class="bt-content btn btn-sm btn-secondary"><i class="bi bi-file-text-fill"></i> Contents</button>';
    // let resetFeature =
    //   '<button class="bt-reset btn btn-danger"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>';

    // if (kit.parsedOptions.feedbacklevel)
    //   $("#recompose-feedbacklevel")
    //     .html(feedbacklevelFeature)
    //     .removeClass("d-none");
    // else $("#recompose-feedbacklevel").html("").addClass("d-none");
    // if (kit.parsedOptions.saveload)
    //   $("#recompose-saveload").html(saveloadFeature).removeClass("d-none");
    // else $("#recompose-saveload").html("").addClass("d-none");
    // if (kit.parsedOptions.reset)
    //   $("#recompose-reset").html(resetFeature).removeClass("d-none");
    // else $("#recompose-reset").html("").addClass("d-none");
    // if (kit.parsedOptions.readcontent)
    //   $("#recompose-readcontent")
    //     .html(readcontentFeature)
    //     .removeClass("d-none");
    // else $("#recompose-readcontent").html("").addClass("d-none");
    // return;
  });
};

App.parseOptions = (options, defaultValueIfNull) => {
  if (options === null || options === undefined) return defaultValueIfNull;
  let option,
    defopt = defaultValueIfNull;
  try {
    option = Object.assign({}, defopt, options);
    option.feedbacklevel = option.feedbacklevel
      ? parseInt(option.feedbacklevel)
      : defopt.feedbacklevel;
  } catch (error) {
    UI.error(error).show();
  }
  return option;
};

App.getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

App.duration = (seconds) => {
  let d = Number(seconds);
  if (d <= 0) return '00:00:00';
  else {
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    let hDisplay = h == 0 ? null : (h <= 9 ? '0'+h+'°' : h+'°');
    let mDisplay = m == 0 ? null : (m <= 9 ? '0'+m+'\'' : m+'\'');
    let sDisplay = s == s <= 9 ? '0'+s : s;
    return `${hDisplay ?? ""}${mDisplay ?? ""}${sDisplay}"`; 
  }
}

App.time = (seconds) => {
  let d = Number(seconds);
  if (d <= 0) return '00:00:00';
  else {
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    let hDisplay = h <= 9 ? '0'+h : h;
    let mDisplay = m <= 9 ? '0'+m : m;
    let sDisplay = s <= 9 ? '0'+s : s;
    return `${hDisplay}:${mDisplay}:${sDisplay}`; 
  }
}



// App.enableNavbarButton = (enabled = true) => {
//   $("#recompose-readcontent button").prop("disabled", !enabled);
//   $("#recompose-saveload button").prop("disabled", !enabled);
//   $("#recompose-reset button").prop("disabled", !enabled);
//   $("#recompose-feedbacklevel button").prop("disabled", !enabled);
//   $(".bt-submit").prop("disabled", !enabled);
//   $(".bt-open-kit").prop("disabled", !enabled);
//   App.inst.canvas.toolbar.tools.forEach((tool) => {
//     tool.enable(enabled);
//   });
// };
