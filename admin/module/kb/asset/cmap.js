$(() => {
  // jQuery onReady callback
  let app = App.instance();
});

class L {
  static log() {}
}

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

    this.ajax = Core.instance().ajax();
    this.runtime = Core.instance().runtime();
    this.config = Core.instance().config();
    
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

    // let exportDialog = UI.modal("#concept-map-export-dialog", {
    //   hideElement: ".bt-cancel",
    // });

    // let importDialog = UI.modal("#concept-map-import-dialog", {
    //   hideElement: ".bt-cancel",
    // });

    /**
     *
     * New Map
     *
     **/

    $(".app-navbar .bt-new").on("click", () => {
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

    $(".app-navbar .bt-save").on("click", () => {
      if (!this.conceptMap) {
        (new CoreInfo('Please open a concept map to save')).show();
        return;
      }
      // console.log(this.conceptMap);
      $('input[name="fid"]').val(this.conceptMap.map.id);
      $('input[name="title"]').val(this.conceptMap.map.title);
      let mapdata = {};
      mapdata.canvas = KitBuildUI.buildConceptMapData(this.canvas);
      mapdata.map = {
        cmid: this.conceptMap.map.cmid,
        direction: this.canvas.direction,
      };
      let data = {
        id: this.conceptMap.map.cmid,
        title: this.conceptMap.title,
        data: Core.compress(mapdata)
      }; // console.log(data, mapdata);
      // return;
      (new CoreConfirm("Save concept map?")).positive(() => {
        this.ajax.post('m/x/kb/kitBuildApi/save', data).then(conceptMap => { 
          // console.warn(conceptMap);
          conceptMap = Object.assign(conceptMap, Core.decompress(conceptMap.data));
          new CoreInfo('Concept map has been saved.').show();
          this.setConceptMap(conceptMap);
          // App.saveAsDialog.hide();
        }, error => {
          new CoreError(`An error has occurred. ${error}`).show();
          console.error(error);
        });
      }).show();
    });

    $(".app-navbar .bt-save-as").on("click", (e) => {
      if (this.canvas.cy.elements().length == 0) {
        UI.warning("Nothing to save. Canvas is empty.").show();
        return;
      }
      (new CoreConfirm("Save concept map on a new file?")).positive((e) => {
        let data = {};
        data.canvas = KitBuildUI.buildConceptMapData(this.canvas);
        data.map = {
          cmid: App.uuidv4(),
          direction: this.canvas.direction,
        };
        data.fileName = null;

        App.saveAsDialog = (new CoreWindow('#concept-map-save-as-dialog', {
          draggable: true,
          width: '650px',
          // height: '600px',
          closeBtn: '.bt-cancel'
        })).show();
      }).show();
    });

    $('#concept-map-save-as-dialog').on('click', '.bt-generate-fid', () => {
      $('input[name="fid"]').val(App.uuidv4);
    });

    $('#concept-map-save-as-dialog').on('click', '.bt-save', () => {
      let mapdata = {};
      mapdata.canvas = KitBuildUI.buildConceptMapData(this.canvas);
      mapdata.map = {
        cmid: $('input[name="fid"]').val(),
        direction: this.canvas.direction,
      };
      let data = {
        id: $('input[name="fid"]').val(),
        title: $('input[name="title"]').val(),
        data: Core.compress(mapdata)
      }; // console.log(data); 
      this.ajax.post('m/x/kb/kitBuildApi/save', data).then(conceptMap => { 
        if (conceptMap) { 
          conceptMap = Object.assign(conceptMap, Core.decompress(conceptMap.data));
          this.setConceptMap(conceptMap);
        } 
        // console.warn(conceptMap);
        new CoreInfo('Concept map has been saved.').show();
        App.saveAsDialog.hide();
      }, error => {
        new CoreError(`An error has occurred. ${error}`).show();
        console.error(error);
      });
    });

    /**
     *
     * Open
     *
     **/

    $(".app-navbar .bt-open").on("click", (e) => { // console.log(e);
      App.dialogOpen = (new CoreWindow('#concept-map-open-dialog', {
        draggable: true,
        width: '650px',
        height: '600px',
        closeBtn: '.bt-cancel'
      })).show();
      $('.bt-refresh-cmap-list').trigger('click');
    });
    $('.bt-refresh-cmap-list').on('click', (e) => {
      this.ajax.get(`m/x/kb/kitBuildApi/searchConceptMaps/`).then(cmaps => { // console.log(cmaps)
        let conceptMapsHtml = '';
        cmaps.forEach(t => { // console.log(t);
          conceptMapsHtml += `<span class="cmap list-item" data-cmid="${t.id}">`
           + `<span class="d-flex align-items-center">`
           + `<span class="text-truncate" style="font-size:0.9rem">${t.title}</span> <code class="bg-danger-subtle rounded mx-2 px-2 text-danger">${t.id}</code> <span class="badge text-bg-warning">${t.created}</span></span>`
           + `<i class="bi bi-check-lg text-primary d-none"></i></span>`
        });
        $('#concept-map-open-dialog .list-concept-map').slideUp({
          duration: 100,
          complete: () => {
            $('#concept-map-open-dialog .list-concept-map .list-item').not('.default').remove();
            $('#concept-map-open-dialog .list-concept-map').append(conceptMapsHtml).slideDown({
              duration: 100,
              complete: () => {
                if (this.conceptMap && this.conceptMap.map) {
                  // console.log(this.conceptMap);
                  $(`#concept-map-open-dialog .list-concept-map .list-item[data-cmid="${this.conceptMap.map.cmid}"]`).trigger('click');
                }
              }
            });
            $('#concept-map-open-dialog .list-kit').html('');
            delete App.dialogOpen.kid;
          }
        });
      });
    });
    $('#concept-map-open-dialog .list-concept-map').on('click', '.list-item', (e) => {
      let cmid = $(e.currentTarget).attr('data-cmid');
      App.dialogOpen.cmid = cmid;
      $('#concept-map-open-dialog .list-concept-map .list-item').removeClass('active');
      $('#concept-map-open-dialog .list-concept-map .bi-check-lg').addClass('d-none');
      $(e.currentTarget).addClass('active').find('i.bi-check-lg').removeClass('d-none');
    });
    $("#concept-map-open-dialog").on("click", ".bt-paste", async (e) => {
      let encoded = await navigator.clipboard.readText();
      $('#decode-textarea').val(encoded);
    });
    $("#concept-map-open-dialog").on("click", ".bt-open", async (e) => {
      if (App.dialogOpen.cmid) {
        this.ajax.get(`m/x/kb/kitBuildApi/openConceptMap/${App.dialogOpen.cmid}`).then(conceptMap => { 
          // console.log(conceptMap);
          conceptMap = Object.assign(conceptMap, this.decodeMap(conceptMap.data));
          this.setConceptMap(conceptMap);
          this.showConceptMap(conceptMap);
          App.dialogOpen.hide();
        });
        return;
      }
      this.decodeMap(App.dialogOpen, $('#decode-textarea').val());
    });

    /**
     * 
     * Content
     * 
     */

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
        let fileName = $(fileInput).val().split('\\').pop();
        let cmid = App.dialogOpen.cmid;
        let file = $(fileInput)[0].files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
          let content = event.target.result;
          // console.log(content);
          let data = {
            id: fileName,
            cmid: cmid,
            type: file.type,
            data: content
          }
          
          // let data = App.parseIni(content);
          // console.log(data);
          this.ajax.post('m/x/kb/kitBuildApi/addConceptMapResource', data).then(result => {
            console.log(result);
            $('#content-dialog .bt-refresh').trigger('click');
          });
          // try {
          //   let conceptMap = Core.decompress(data.conceptMap.replaceAll('"',''));
          //   let kit = Core.decompress(data.kit.replaceAll('"',''));
          //   console.log(conceptMap, kit);
          //   CDM.conceptMap = conceptMap;
          //   CDM.kitId = fileName;
          //   CDM.conceptMapId = conceptMap.map.cmid;
          //   CDM.kit = kit;
          //   console.error(kit);
          // } catch(e) {
          //   // 
          //   textContainer.html(fileName + ' <strong class="text-danger">File is invalid.</strong>');
          //   return;
          // }
        };
        // console.log(file);
        reader.readAsDataURL(file);
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

    $(".app-navbar .bt-content").on("click", (e) => { // console.log(e);
      if (!App.dialogOpen.cmid) {
        (new CoreInfo('Please open a concept map to assign its content reference.')).show();
        return;
      }
      App.dialogContent = (new CoreWindow('#content-dialog', {
        draggable: true,
        width: '400px',
        height: '400px',
        closeBtn: '.bt-close'
      })).show();
      $('#content-dialog .bt-refresh').trigger('click');
    });

    $('#content-dialog .bt-refresh').on('click', e => {
      let cmid = App.dialogOpen.cmid;
      this.ajax.get(`m/x/kb/kitBuildApi/getConceptMapReferenceList/${cmid}`).then(result => {
        // console.log(result);
        let html = '';
        for(let res of result) {
          html += `<div class="d-flex flex-row justify-content-between align-items-center">`;
          html += `<span>${res.id} <code class="ms-2">${res.type}</code></span>`;
          html += `<span><button class="btn btn-sm btn-danger bt-delete"`;
          html += ` data-id="${res.id}" data-cmid="${res.cmid}">`;
          html += `<i class="bi bi-x"></i>`;
          html += `</button><span>`;
          html += `</div>`;
        }
        $('#content-dialog .list-references').html(html);
      });
    });

    $('#content-dialog .list-references').on('click', '.bt-delete', e => {
      let id = $(e.currentTarget).attr('data-id');
      let cmid = $(e.currentTarget).attr('data-cmid');
      console.log($(e.currentTarget), id, cmid);
    });

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
      navigator.clipboard.writeText(
        $("#concept-map-export-dialog .encoded-data").val().trim()
      );
      $(e.currentTarget).html(
        '<i class="bi bi-clipboard"></i> Data has been copied to Clipboard!'
      );
      setTimeout(() => {
        $(e.currentTarget).html(
          '<i class="bi bi-clipboard"></i> Copy to Clipboard'
        );
      }, 3000);
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
      let conceptMap = this.decodeMap((parsedData.conceptMap ? parsedData.conceptMap : data));
      if (this.canvas.cy.elements().length > 0) {
        (new CoreConfirm('Do you want to replace current concept map in canvas?')).positive(() => {
          this.showConceptMap(conceptMap);
          App.dialogImport.hide();
        }).show();
      } else {
        this.showConceptMap(conceptMap);
        App.dialogImport.hide();
      }
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
      let conceptMap = Core.decompress(data.replaceAll('"',''));
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

  handleRefresh() {
    
  }
  
}

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

App.canvasId = "goalmap-canvas";
App.defaultMapType = "scratch";
