$(() => {
  // jQuery onReady callback
  let app = App.instance();
});

class L {
  static log(action, data, extra, options) {
    Logger.logsc(action, data, extra, options);
  }
  static dataMap(cmid) {
    return new Map([["cmid", cmid]]);
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
  static proposition(dataMap, appCanvas) {
    let learnerMapData = KitBuildUI.buildConceptMapData(appCanvas);
    let proposition = Analyzer.composePropositions(learnerMapData);
    // console.warn(learnerMapData, proposition);
    dataMap.set('concept', Core.compress(JSON.stringify(appCanvas.cy.elements('node[type="concept"]').jsons())));
    dataMap.set('link', Core.compress(JSON.stringify(appCanvas.cy.elements('node[type="link"]').jsons())));
    dataMap.set('proposition', Core.compress(proposition));
    dataMap.set('nc', appCanvas.cy.elements('node[type="concept"]').length);
    dataMap.set('nl', appCanvas.cy.elements('node[type="link"]').length);
    dataMap.set('np', proposition.length);
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
CDM.cookieid = 'CORESID-mgm__sb';
CDM.options = {};

class App {
  constructor() {
    
    // Main data
    this.fileName;
    this.fileData;
    this.conceptMap;

    this.kbui = KitBuildUI.instance(App.canvasId);
    let canvas = this.kbui.canvases.get(App.canvasId);
    canvas.addToolbarTool(KitBuildToolbar.UNDO_REDO, { priority: 3 });
    canvas.addToolbarTool(KitBuildToolbar.NODE_CREATE, { priority: 2 });
    canvas.addToolbarTool(KitBuildToolbar.UTILITY, { priority: 5 });
    canvas.addToolbarTool(KitBuildToolbar.CAMERA, { priority: 4 });
    // canvas.addToolbarTool(KitBuildToolbar.SHARE, { priority: 6 })
    canvas.addToolbarTool(KitBuildToolbar.LAYOUT, { priority: 7 });
    canvas.toolbar.render();

    canvas.addCanvasTool(KitBuildCanvasTool.DELETE);
    canvas.addCanvasTool(KitBuildCanvasTool.DUPLICATE);
    canvas.addCanvasTool(KitBuildCanvasTool.EDIT);
    canvas.addCanvasTool(KitBuildCanvasTool.SWITCH);
    canvas.addCanvasTool(KitBuildCanvasTool.DISCONNECT);
    canvas.addCanvasTool(KitBuildCanvasTool.CENTROID);
    canvas.addCanvasTool(KitBuildCanvasTool.CREATE_CONCEPT);
    canvas.addCanvasTool(KitBuildCanvasTool.CREATE_LINK);
    canvas.addCanvasTool(KitBuildCanvasTool.IMAGE);
    canvas.addCanvasTool(KitBuildCanvasTool.REMOVE_IMAGE);
    canvas.addCanvasTool(KitBuildCanvasTool.LOCK); // also UNLOCK toggle

    canvas.addCanvasMultiTool(KitBuildCanvasTool.DELETE);
    canvas.addCanvasMultiTool(KitBuildCanvasTool.DUPLICATE);
    canvas.addCanvasMultiTool(KitBuildCanvasTool.LOCK);
    canvas.addCanvasMultiTool(KitBuildCanvasTool.UNLOCK);

    this.resizeTool = new ResizeTool(canvas);
    canvas.canvasTool.addTool('TOOL_RESIZE', this.resizeTool);
    KitBuildCanvasKonva.instance.addListener(this.resizeTool);

    this.canvas = canvas;

    this.ajax    = Core.instance().ajax();
    this.runtime = Core.instance().runtime();
    this.config  = Core.instance().config();
    this.session = Core.instance().session();
    
    // Enable tooltip;
    $('[data-bs-toggle="tooltip"]').tooltip();

    this.handleEvent();
    this.handleRefresh();

  }

  static instance() {
    App.inst = new App();
    return App.inst;
  }

  setConceptMap(conceptMap = null) {
    console.warn("CONCEPT MAP SET:", conceptMap);
    this.conceptMap = conceptMap;
    if (conceptMap) {
      this.canvas.direction = conceptMap.map.direction;
      let status =
        `<span class="mx-2 d-flex align-items-center status-cmap">` +
        `<span class="badge rounded-pill bg-secondary">ID: ${conceptMap.map.cmid}</span>` +
        `</span>`;
      StatusBar.instance().remove(".status-cmap").append(status);
    } else {
      StatusBar.instance().remove(".status-cmap");
    }
  }

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
            $('textarea.encoded-data').val(data.conceptMap);
            let conceptMap = Core.decompress(data.conceptMap.replaceAll('"',''));
            console.log(conceptMap);
            CDM.conceptMap = conceptMap;
            CDM.conceptMapId = conceptMap.map.cmid;
          } catch(e) {
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

    /**
     *
     * New Map
     *
     **/

    $(".app-navbar .bt-new").on("click", () => {

      App.newDialog = (new CoreWindow('#concept-map-new-dialog', {
        draggable: true,
        width: '650px',
        closeBtn: '.bt-cancel'
      })).show();
      $('#concept-map-new-dialog .bt-generate-uuid').trigger('click');
      $('input[name="userid"]').val(App.getCookie('userid'));
      return;

      let proceed = () => {
        this.canvas.reset();
        App.inst.setConceptMap(null);
        this.fileName = undefined;
        UI.info("Canvas has been reset").show();
        L.log(
          "reset-concept-map",
          this.conceptMap ? this.conceptMap.map.cmid : null
        );
      };
      if (this.canvas.cy.elements().length > 0 || App.inst.conceptMap) {
        let confirm = new CoreConfirm(
          "Discard this map and create a new concept map from scratch?"
        )
          .positive(() => {
            proceed();
            confirm.hide();
            return;
          })
          .show();
        return;
      }
      proceed();
    });

    $('#concept-map-new-dialog .bt-generate-uuid').on('click', e => {
      $('input[name="cmid"]').val(App.uuidv4());
    });

    $('#concept-map-new-dialog .bt-new').on('click', e => {
      e.preventDefault();
      let remember = $('#concept-map-new-dialog input#inputrememberme:checked').val();
      let userid = $('#concept-map-new-dialog input[name="userid"]').val().trim();
      let title = $('#concept-map-new-dialog input[name="title"]').val().trim();
      let cmid = $('#concept-map-new-dialog input[name="cmid"]').val().trim();

      if (!userid) {
        UI.warningDialog("Please enter your name or a user ID.").show();
        return;
      }

      let proceed = () => {
        this.canvas.reset();

        if (remember) Core.instance().cookie().set('userid', userid);
        else Core.instance().cookie().unset('userid');
        App.newDialog.hide();
  
        CDM.conceptMapId = cmid;
        CDM.userId = userid;
        CDM.title = title;
        Logger.userid = CDM.userId;

        console.log(CDM);
  
        let canvasJsons = this.canvas.cy.elements().jsons();
        let dataMap = new Map([
          ['cmid', CDM.conceptMapId],
          ['canvas', Core.compress(canvasJsons)]
        ]);
        App.inst.session.regenerateId().then(sessid => {
          Logger.sessid = App.getCookie(CDM.cookieid);
          Logger.seq = 1;
          L.log("new-concept-map", CDM.conceptMapId, dataMap);
        });
  
        App.timer = new Timer('.app-navbar .timer');
        App.timer.on();
        App.lastFeedback = App.timer.ts;

        UI.info("Canvas has been reset").show();
        this.enable();
        // L.log("reset-concept-map", CDM.conceptMapId);
      };

      if (this.canvas.cy.elements().length > 0) {
        UI.confirm('Create a new concept map from scratch?').positive(e => {
          // this.canvas.cy.elements().remove();
          proceed();
        }).show();
      } else proceed();



    });


    /**
     * Save Load Concept Map
     * */

    $(".app-navbar").on("click", ".bt-save", () => {

      // console.log(CDM); return;
      // if(!CDM.kit) new CoreDialog('Please open a kit').show();

      // let {d, lmapdata} = this.buildLearnerMapData(); // console.log(canvas);
      let data = {};
      // data.id = CDM.kit.map.id;
      data.cmid = CDM.conceptMapId;
      data.userid = CDM.userid;
      data.title = CDM.title;
      data.data = this.canvas.cy.elements().jsons();
      data.sessid = App.getCookie(CDM.cookieid);
      
      console.warn(data);

      this.session.set('draft-map', Core.compress(data)).then((result) => {
        console.warn(result);
        UI.success("Concept map has been saved successfully.").show();
        let dataMap = L.dataMap(CDM.conceptMapId);
        L.canvas(dataMap, App.inst.canvas);
        L.proposition(dataMap, App.inst.canvas);
        L.log('save-draft', {
          id: data.id,
          cmid: data.cmid,
          userid: data.userid,
          sessid: data.sessid
        }, dataMap);
      });


    });
    $(".app-navbar").on("click", ".bt-load", () => {

      // if(!CDM.kit) new CoreDialog('Please open a kit').show();
      this.session.get('draft-map').then(result => {
        let lmapdata = Core.decompress(result);

        console.warn(lmapdata, App.getCookie(CDM.cookieid));

        CDM.title = lmapdata.title?.length > 0 ? lmapdata.title : CDM.title;
        // CDM.conceptMapId = lmapdata.cmid;

        if (!lmapdata.data) {
          UI.error('Invalid data.').show();
          return;
        }
        if(lmapdata.userid != CDM.userid) {
          UI.error('Invalid draft.').show();
          return;
        }

        UI.confirm('Replace current concept map with the saved one?')
          .positive(e => {
            // console.log(lmapdata);
            // lmapdata.data.canvas.conceptMap = CDM.conceptMap.canvas;
            // let lmap = KitBuildUI.composeLearnerMap(lmapdata.data.canvas);
            // console.log(lmap);
            this.canvas.cy.elements().remove();
            this.canvas.cy.add(lmapdata.data);
            this.canvas.applyElementStyle();
            this.canvas.toolbar.tools
              .get(KitBuildToolbar.CAMERA)
              .fit(null, { duration: 0 });
            KitBuildUI.showBackgroundImage(this.canvas);

            let sessid = App.getCookie(CDM.cookieid); 
            // console.log(sessid, lmapdata.sessid);

            let dataMap = L.dataMap(CDM.conceptMapId);
            L.canvas(dataMap, App.inst.canvas);
            L.proposition(dataMap, App.inst.canvas);
            L.log('load-draft', {
              sessid: sessid,
              psessid: lmapdata.sessid,
              pcmid: lmapdata.cmid
            }, dataMap);
            App.lastFeedback = App.timer.ts;
          }).show();
      });
    });



    // $(".app-navbar .bt-save").on("click", () => {
    //   if (!this.conceptMap) {
    //     (new CoreInfo('Please open a concept map to save')).show();
    //     return;
    //   }
    //   // console.log(this.conceptMap);
    //   $('input[name="fid"]').val(this.conceptMap.map.id);
    //   $('input[name="title"]').val(this.conceptMap.map.title);
    //   let mapdata = {};
    //   mapdata.canvas = KitBuildUI.buildConceptMapData(this.canvas);
    //   mapdata.map = {
    //     cmid: this.conceptMap.map.cmid,
    //     direction: this.canvas.direction,
    //   };
    //   let data = {
    //     id: this.conceptMap.map.cmid,
    //     title: this.conceptMap.title,
    //     data: Core.compress(mapdata)
    //   }; // console.log(data, mapdata);
    //   // return;
    //   (new CoreConfirm("Save concept map?")).positive(() => {
    //     this.ajax.post('m/x/kb/kitBuildApi/save', data).then(conceptMap => { 
    //       // console.warn(conceptMap);
    //       conceptMap = Object.assign(conceptMap, Core.decompress(conceptMap.data));
    //       new CoreInfo('Concept map has been saved.').show();
    //       this.setConceptMap(conceptMap);
    //       // App.saveAsDialog.hide();
    //     }, error => {
    //       new CoreError(`An error has occurred. ${error}`).show();
    //       console.error(error);
    //     });
    //   }).show();
    // });

    // $(".app-navbar .bt-save-as").on("click", (e) => {
    //   if (this.canvas.cy.elements().length == 0) {
    //     UI.warning("Nothing to save. Canvas is empty.").show();
    //     return;
    //   }
    //   (new CoreConfirm("Save concept map on a new file?")).positive((e) => {
    //     let data = {};
    //     data.canvas = KitBuildUI.buildConceptMapData(this.canvas);
    //     data.map = {
    //       cmid: App.uuidv4(),
    //       direction: this.canvas.direction,
    //     };
    //     data.fileName = null;

    //     App.saveAsDialog = (new CoreWindow('#concept-map-save-as-dialog', {
    //       draggable: true,
    //       width: '650px',
    //       // height: '600px',
    //       closeBtn: '.bt-cancel'
    //     })).show();
    //   }).show();
    // });

    // $('#concept-map-save-as-dialog').on('click', '.bt-generate-fid', () => {
    //   $('input[name="fid"]').val(App.uuidv4);
    // });
    // $('#concept-map-save-as-dialog').on('click', '.bt-save', () => {
    //   let mapdata = {};
    //   mapdata.canvas = KitBuildUI.buildConceptMapData(this.canvas);
    //   mapdata.map = {
    //     cmid: $('input[name="fid"]').val(),
    //     direction: this.canvas.direction,
    //   };
    //   let data = {
    //     id: $('input[name="fid"]').val(),
    //     title: $('input[name="title"]').val(),
    //     data: Core.compress(mapdata)
    //   }; // console.log(data); 
    //   this.ajax.post('m/x/kb/kitBuildApi/save', data).then(conceptMap => { 
    //     if (conceptMap) { 
    //       conceptMap = Object.assign(conceptMap, Core.decompress(conceptMap.data));
    //       this.setConceptMap(conceptMap);
    //     } 
    //     // console.warn(conceptMap);
    //     new CoreInfo('Concept map has been saved.').show();
    //     App.saveAsDialog.hide();
    //   }, error => {
    //     new CoreError(`An error has occurred. ${error}`).show();
    //     console.error(error);
    //   });
    // });

    /**
     *
     * Open
     *
     **/

    // $(".app-navbar .bt-open").on("click", (e) => { // console.log(e);
    //   App.dialogOpen = (new CoreWindow('#concept-map-open-dialog', {
    //     draggable: true,
    //     width: '650px',
    //     height: '600px',
    //     closeBtn: '.bt-cancel'
    //   })).show();
    //   $('.bt-refresh-cmap-list').trigger('click');
    // });
    // $('.bt-refresh-cmap-list').on('click', (e) => {
    //   this.ajax.get(`m/x/kb/kitBuildApi/searchConceptMaps/`).then(cmaps => { // console.log(cmaps)
    //     let conceptMapsHtml = '';
    //     cmaps.forEach(t => { // console.log(t);
    //       conceptMapsHtml += `<span class="cmap list-item" data-cmid="${t.id}">`
    //        + `<span class="d-flex align-items-center">`
    //        + `<span class="text-truncate" style="font-size:0.9rem">${t.title}</span> <code class="bg-danger-subtle rounded mx-2 px-2 text-danger">${t.id}</code> <span class="badge text-bg-warning">${t.created}</span></span>`
    //        + `<i class="bi bi-check-lg text-primary d-none"></i></span>`
    //     });
    //     $('#concept-map-open-dialog .list-concept-map').slideUp({
    //       duration: 100,
    //       complete: () => {
    //         $('#concept-map-open-dialog .list-concept-map .list-item').not('.default').remove();
    //         $('#concept-map-open-dialog .list-concept-map').append(conceptMapsHtml).slideDown({
    //           duration: 100,
    //           complete: () => {
    //             if (this.conceptMap && this.conceptMap.map) {
    //               // console.log(this.conceptMap);
    //               $(`#concept-map-open-dialog .list-concept-map .list-item[data-cmid="${this.conceptMap.map.cmid}"]`).trigger('click');
    //             }
    //           }
    //         });
    //         $('#concept-map-open-dialog .list-kit').html('');
    //         delete App.dialogOpen.kid;
    //       }
    //     });
    //   });
    // });
    // $('#concept-map-open-dialog .list-concept-map').on('click', '.list-item', (e) => {
    //   let cmid = $(e.currentTarget).attr('data-cmid');
    //   App.dialogOpen.cmid = cmid;
    //   $('#concept-map-open-dialog .list-concept-map .list-item').removeClass('active');
    //   $('#concept-map-open-dialog .list-concept-map .bi-check-lg').addClass('d-none');
    //   $(e.currentTarget).addClass('active').find('i.bi-check-lg').removeClass('d-none');
    // });
    // $("#concept-map-open-dialog").on("click", ".bt-paste", async (e) => {
    //   let encoded = await navigator.clipboard.readText();
    //   $('#decode-textarea').val(encoded);
    // });
    // $("#concept-map-open-dialog").on("click", ".bt-open", async (e) => {
    //   if (App.dialogOpen.cmid) {
    //     this.ajax.get(`m/x/kb/kitBuildApi/openConceptMap/${App.dialogOpen.cmid}`).then(conceptMap => { 
    //       // console.log(conceptMap);
    //       conceptMap = Object.assign(conceptMap, this.decodeMap(conceptMap.data));
    //       this.setConceptMap(conceptMap);
    //       this.showConceptMap(conceptMap);
    //       App.dialogOpen.hide();
    //     });
    //     return;
    //   }
    //   this.decodeMap(App.dialogOpen, $('#decode-textarea').val());
    // });

    /**
     *
     * Export
     * 
     **/

    $(".app-navbar .bt-export").on("click", (e) => {
      // console.log(this.conceptMap);
      let data = {};
      data.canvas = KitBuildUI.buildConceptMapData(this.canvas);
      data.map = {
        cmid: this.conceptMap ? this.conceptMap.map.cmid : App.uuidv4(),
        direction: this.canvas.direction,
      };
      // console.log(data);
      $("#concept-map-export-dialog .encoded-data").val(
        `conceptMap=${Core.compress(data)}`
      );
      App.dialogExport = (new CoreWindow('#concept-map-export-dialog', {
        draggable: true,
        width: '650px',
        height: '600px',
        closeBtn: '.bt-cancel'
      })).show();
    });

    $("#concept-map-export-dialog").on("click", ".bt-clipboard", async (e) => { // console.log(e);
      navigator.clipboard.writeText($("#concept-map-export-dialog .encoded-data").val().trim());
      $(e.currentTarget).html('<i class="bi bi-clipboard"></i> Data has been copied to Clipboard!');
      setTimeout(() => {
        $(e.currentTarget).html('<i class="bi bi-clipboard"></i> Copy to Clipboard');
      }, 3000);
      let dataMap = L.dataMap(CDM.conceptMapId);
      L.canvas(dataMap, App.inst.canvas);
      L.proposition(dataMap, App.inst.canvas);
      L.log('concept-map-export', {duration: App.timer.ts}, dataMap);
    });

    $("#concept-map-export-dialog").on("click", ".bt-download-cmap", async (e) => { // console.log(e);
      let cmapdata = $("#concept-map-export-dialog .encoded-data").val().trim();
      App.download(`${CDM.conceptMapId ?? 'untitled'}.cmap`, cmapdata);
      let dataMap = L.dataMap(CDM.conceptMapId);
      L.canvas(dataMap, App.inst.canvas);
      L.proposition(dataMap, App.inst.canvas);
      L.log('concept-map-download-cmap', {duration: App.timer.ts}, dataMap);
    });

    /**
     *  
     * Import
     *
     **/  

    $(".app-navbar .bt-import").on("click", (e) => {
      App.dialogImport = (new CoreWindow('#concept-map-import-dialog', {
        draggable: true,
        width: '650px',
        height: '600px',
        closeBtn: '.bt-cancel'
      })).show();
    });

    $("#concept-map-import-dialog").on("click", ".bt-paste", async (e) => {
      let encoded = await navigator.clipboard.readText();
      $('#concept-map-import-dialog .encoded-data').val(encoded);
    });

    $('#concept-map-import-dialog').on("click", ".bt-decode", async (e) => {
      let data = $('#concept-map-import-dialog .encoded-data').val().trim();
      let parsedData = App.parseIni(data);
      // console.log(data, parsedData);
      let conceptMap = this.decodeMap(parsedData.conceptMap ? parsedData.conceptMap : data);
      let prevMap = Core.compress(this.canvas.cy.elements().jsons());
      // console.log(conceptMap, prevMap);
      let proceed = () => {
        this.showConceptMap(conceptMap);
        this.canvas.cy.elements('node[type="link"]').data('limit', 9);
        App.dialogImport.hide();
        let dataMap = L.dataMap(CDM.conceptMapId);
        L.canvas(dataMap, App.inst.canvas);
        L.proposition(dataMap, App.inst.canvas);
        L.log('concept-map-import', {
          prevMap: prevMap,
          nextMap: Core.compress(this.canvas.cy.elements().jsons())
        }, dataMap);
      }
      // console.log(this.canvas.cy.elements());
      if (this.canvas.cy.elements().length > 0) {
        (UI.confirm('Do you want to replace current concept map in canvas?')).positive(() => {
          proceed();
        }).show();
      } else proceed();
    });
  
    /**
     * 
     * Compose Kit
     * 
     **/

    $(".app-navbar").on("click", ".bt-compose-kit", () => {
      if (!this.conceptMap) {
        new CoreInfo('Please save your concept map before composing a kit.').show();
        return;
      }
      new CoreConfirm('Save the concept map and begin composing a kit for this concept map?')
        .positive(() => {
          // console.log(this.fileData);
          let data = Core.decompress(this.fileData.conceptMap);
          data.canvas = KitBuildUI.buildConceptMapData(this.canvas);
          data.fileName = this.fileName;
          // api.saveFileAsSilent(data);
        })
        .show();
    });

    /**
     *
     * Submit
     */
    $(".app-navbar").on("click", ".bt-submit", () => {
      let confirm = UI.confirm(
        "Do you want to submit your concept map?"
      ).positive(() => {
        // console.warn(CDM);
        let data = {
          id: CDM.conceptMapId,
          userid: CDM.userId,
          title: CDM.title,
          type: 'submit',
          data: Core.compress(this.canvas.cy.elements().jsons())
        };
        // console.log(data);
        confirm.hide();
        // return;
        this.ajax
          .post("mapApi/saveScratchMap", data)
          .then(map => { // console.log(map);
            data.id = map.id;
            data.created = map.created;
            data.duration = App.timer.ts;
            data.logcmid = CDM.conceptMapId;
            let dataMap = L.dataMap(CDM.conceptMapId);
            L.canvas(dataMap, this.canvas);
            L.proposition(dataMap, this.canvas);
            L.log('submit', data, dataMap);
            UI.dialog('Your concept map has been submitted.').show();
          }).catch((error) => {
            console.error(error);
          });
        }).show();
    });

    $(".app-navbar").on("click", ".bt-finalize", () => {
      let confirm = UI.confirm(
        "Do you want to finalize your concept map?"
      ).positive(() => {
        // console.warn(CDM);
        let data = {
          id: CDM.conceptMapId,
          userid: CDM.userId,
          title: CDM.title,
          type: 'finalized',
          data: Core.compress(this.canvas.cy.elements().jsons())
        };
        // console.log(data);
        confirm.hide();
        // return;
        this.ajax
          .post("mapApi/saveScratchMap", data)
          .then(map => { // console.log(map);
            data.id = map.id;
            data.created = map.created;
            data.logcmid = CDM.conceptMapId;
            data.duration = App.timer.ts;
            let dataMap = L.dataMap(CDM.conceptMapId);
            L.canvas(dataMap, this.canvas);
            L.proposition(dataMap, this.canvas);
            L.log('finalized', data, dataMap);
            UI.dialog('Your concept map has been finalized.').show();
          }).catch((error) => {
            console.error(error);
          });
        }).show();
    });

    /**
     * 
     * Data Generator: for Gakuto
     * 
     **/

    $(".app-navbar").on("click", ".bt-data-gen", () => {
      // api.openDataGenerator();
    });

    /*
    *
    * Electron API
    * 
    */

    // api.saveFileAsCancelled((e, result) => {
    //   // console.log(e, result);
    //   UI.info("Save cancelled.").show();
    // });

    // api.saveFileAsResult((e, data, fileName, fileData) => {
    //   // console.log(e, data, fileName, fileData);
    //   if(data) new CoreInfo('Save successful.').show();
    //   else new CoreInfo('Save error.').show();
    //   this.fileName = fileName;
    //   this.fileData = fileData;
    // });

    // api.saveFileAsResultSilent((e, data, fileName, fileData) => {
    //   // console.log(e, data, fileName, fileData);
    //   api.composeKit(fileName);
    // }); 

    // api.openFileResult((e, data) => {
    //   // console.log(e, data);
    //   this.fileName = data.fileName;
    //   delete data.fileName;
    //   this.fileData = data;
    //   this.decodeMap(importDialog, data.conceptMap);
    // });

    // api.openFileCancelled((e, data) => {
    //   // console.warn(e, data, "Open file cancelled.");
    //   UI.warning('Open file cancelled').show();
    // });

    $('.bt-test').on('click', (e) => {

    });

  }

  // decodeMap(importDialog, data) {
  //   try {
  //     let conceptMap = Core.decompress(data.replaceAll('"',''));
  //     console.warn(conceptMap);
  //     if (typeof conceptMap == "string")
  //       conceptMap = JSON.parse(conceptMap);
  //     // console.log(res);
  //     // console.log(JSON.parse(conceptMap));
  //     Object.assign(conceptMap, {
  //       cyData: KitBuildUI.composeConceptMap(conceptMap.canvas),
  //     });
  //     // KitBuildUI.composeConceptMap(conceptMap);
  //     // console.log(conceptMap);
  //     let proceed = () => {
  //       App.inst.setConceptMap(conceptMap);
  //       this.canvas.cy.elements().remove();
  //       this.canvas.cy.add(conceptMap.cyData);
  //       this.canvas.applyElementStyle();
  //       this.canvas.toolbar.tools
  //         .get(KitBuildToolbar.CAMERA)
  //         .fit(null, { duration: 0 });
  //       this.canvas.toolbar.tools
  //         .get(KitBuildToolbar.NODE_CREATE)
  //         .setActiveDirection(conceptMap.map.direction);
  //       this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
  //       KitBuildUI.showBackgroundImage(this.canvas);
  //       UI.success("Concept map loaded.").show();
  //       L.log("open-concept-map", conceptMap.map, null, {
  //         cmid: conceptMap.map.cmid,
  //         includeMapData: true,
  //       });
  //       importDialog.hide();
  //     };
  //     if (this.canvas.cy.elements().length) {
  //       let confirm = new CoreConfirm(
  //         "Do you want to open and replace current concept map on canvas?"
  //       ).positive(() => {
  //           confirm.hide();
  //           proceed();
  //         }).show();
  //     } else
  //       proceed();
  //   } catch (error) {
  //     console.error(error);
  //     new CoreInfo("The concept map data is invalid.", {
  //       icon: "exclamation-triangle",
  //       iconStyle: "danger",
  //     }).show();
  //   }
  // }

  showConceptMap(conceptMap) {
    // App.inst.setConceptMap(conceptMap);
    this.canvas.cy.elements().remove();
    this.canvas.cy.add(conceptMap.cyData);
    this.canvas.applyElementStyle();
    this.canvas.toolbar.tools
      .get(KitBuildToolbar.CAMERA)
      .fit(null, { duration: 0 });
    this.canvas.toolbar.tools
      .get(KitBuildToolbar.NODE_CREATE)
      .setActiveDirection(conceptMap.map.direction);
    this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
    KitBuildUI.showBackgroundImage(this.canvas);
  }

  decodeMap(data, dialog) {
    try {
      // console.log(data, typeof data);
      let conceptMap = (typeof data != 'object') ? Core.decompress(data.replaceAll('"','')) : data;
      // console.log(data, conceptMap);
      Object.assign(conceptMap, {
        cyData: KitBuildUI.composeConceptMap(conceptMap.canvas),
      });
      // KitBuildUI.composeConceptMap(conceptMap);
      // console.log(conceptMap);
      return conceptMap;
    } catch (error) {
      console.error(error);
      new CoreInfo("The concept map data is invalid.", {
        icon: "exclamation-triangle",
        iconStyle: "danger",
      }).show();
    }
  }

  disable() {
    $('.app-navbar button').prop('disabled', true);
    $('.app-navbar button.bt-new').prop('disabled', false);
    this.canvas.toolbar.tools.get(KitBuildToolbar.UNDO_REDO).disable();
    this.canvas.toolbar.tools.get(KitBuildToolbar.NODE_CREATE).disable();
    this.canvas.canvasTool.tools.get("create-concept").disable();
    this.canvas.canvasTool.tools.get("create-link").disable();
  }
  
  enable() {
    $('.app-navbar button').prop('disabled', false);
    this.canvas.toolbar.tools.get(KitBuildToolbar.UNDO_REDO).enable();
    this.canvas.toolbar.tools.get(KitBuildToolbar.NODE_CREATE).enable();
    this.canvas.canvasTool.tools.get("create-concept").enable();
    this.canvas.canvasTool.tools.get("create-link").enable();
  }

  handleRefresh() {

    this.disable();
    this.session.getAll().then((sessions) => {

      if (sessions.userid) this.enable();
      // console.log(sessions, document.cookie);
      Logger.userid = sessions.userid;
      Logger.sessid = App.getCookie(CDM.cookieid);
      Logger.canvasid = App.canvasId;
      // console.log(Logger.userid, Logger.sessid);
      this.canvas.on("event", App.onCanvasEvent);

    });
  }


  
}



App.onCanvasEvent = (canvasId, event, data) => { 
  // console.log(canvasId, event, data);
  Logger.canvasid = canvasId;
  let skip = [ // for canvas data
    'camera-reset', 
    'camera-center', 
    'camera-fit', 
    'camera-zoom-in', 
    'camera-zoom-out'
  ];

  let dataMap = L.dataMap(CDM.conceptMapId);
  if (!skip.includes(event))
    L.canvas(dataMap, App.inst.canvas);
  // if (!F && !F)  T && T
  if (!event.includes("move") && !event.includes('layout') && !skip.includes(event))
    L.proposition(dataMap, App.inst.canvas);
  L.log(event, data, dataMap);
  // App.collab("command", event, canvasId, data);
};

App.uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

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

// App.getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }

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

App.download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

App.canvasId = "goalmap-canvas";
App.defaultMapType = "scratch";
App.timer = null;



