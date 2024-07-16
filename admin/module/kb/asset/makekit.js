$(() => { // jQuery onReady callback
  let app = App.instance()
})

class CDM {}

CDM.options = {};

class App {
  constructor() {
    this.kbui = KitBuildUI.instance(App.canvasId);
    let canvas = this.kbui.canvases.get(App.canvasId);
    canvas.addToolbarTool(KitBuildToolbar.NODE_CREATE, { priority: 1, visible: false});
    canvas.addToolbarTool(KitBuildToolbar.UNDO_REDO, { priority: 3 });
    canvas.addToolbarTool(KitBuildToolbar.CAMERA, { priority: 4 });
    canvas.addToolbarTool(KitBuildToolbar.UTILITY, { priority: 5, trash: false });
    canvas.addToolbarTool(KitBuildToolbar.LAYOUT, { stack: 'right' });
    canvas.toolbar.render();
    canvas.addCanvasTool(KitBuildCanvasTool.CENTROID);
    canvas.addCanvasTool(KitBuildCanvasTool.DISCONNECT);
    canvas.addCanvasTool(KitBuildCanvasTool.LOCK);
    canvas.addCanvasTool(KitBuildCanvasTool.DATA);
    canvas.addCanvasMultiTool(KitBuildCanvasTool.LOCK);
    canvas.addCanvasMultiTool(KitBuildCanvasTool.UNLOCK);
    
    this.canvas = canvas;
    this.session = Core.instance().session();
    this.ajax = Core.instance().ajax();

    canvas.canvasTool.addTool("ref", new KitBuildReferenceTool(canvas, {ajax: this.ajax}));


    // Hack for sidebar-panel show/hide
    // To auto-resize the canvas.
    // let observer = new MutationObserver((mutations) => $(`#${canvasId} > div`).css('width', 0))
    // observer.observe(document.querySelector('#admin-sidebar-panel'), {attributes: true})
    // Enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip({ html: true });

    this.handleEvent()
    this.handleRefresh()
  }

  static instance() {
    App.inst = new App();
    return App.inst;
  }

  setConceptMap(conceptMap) { console.warn("CONCEPT MAP SET:", conceptMap, this)
    this.conceptMap = conceptMap
    if (conceptMap) {
      this.canvas.direction = conceptMap.map.direction;
      this.session.set('cmid', conceptMap.map.cmid)
      let status = `<span class="mx-2 d-flex align-items-center status-cmap">`
        + `<span class="badge rounded-pill bg-secondary">ID: ${conceptMap.map.cmid}</span>`
        + `<span class="text-secondary ms-2 text-truncate"><small>${conceptMap.title}</small></span>`
        + `</span>`
      StatusBar.instance().remove('.status-cmap').prepend(status);
    } else {
      StatusBar.instance().remove('.status-cmap');
      this.session.unset('cmid')
    }
  }

  setKitMap(kitMap) { console.warn("KIT MAP SET:", kitMap)
    if (!kitMap) {
      this.kitMap = null;
      return;
    } 
    try {
      let data = Core.decompress(kitMap.data);
      kitMap.options = JSON.parse(kitMap.options);
      kitMap = Object.assign(kitMap, data);
      // console.warn(kitMap);
    } catch(e) {}
    this.kitMap = kitMap;
    CDM.options = kitMap.options;
    // if (kitMap) {
    //   this.setConceptMap(kitMap.conceptMap)
    //   this.session.set('kid', kitMap.map.kid)
    //   let status = `<span class="mx-2 d-flex align-items-center status-kit">`
    //     + `<span class="badge rounded-pill bg-primary">ID: ${kitMap.map.kid}</span>`
    //     + `<span class="text-secondary ms-2 text-truncate"><small>${kitMap.map.name}</small></span>`
    //     + `</span>`
    //   StatusBar.instance().remove('.status-kit').append(status);
    // } else {
    //   StatusBar.instance().remove('.status-kit');
    //   this.session.unset('kid')
    // }
  }

  handleEvent() {

    let saveAsDialog = UI.modal('#kit-save-as-dialog', {
      onShow: () => { 
        if (saveAsDialog.kitMap) { // means save existing kit...
          $('#kit-save-as-dialog .input-title').val(saveAsDialog.kitMap.map.title)
          $('#kit-save-as-dialog .input-title').focus().select()
          $('#input-fid').val(saveAsDialog.kitMap.map.id)
          $('#input-title').val(saveAsDialog.kitMap.map.title)
          // $(`#input-layout-${saveAsDialog.kitMap.map.layout}`).prop('checked', true)
          // $('#input-enabled').prop('checked', saveAsDialog.kitMap.map.enabled == "1" ? true : false)
        } else {
          $('#kit-save-as-dialog .input-title').val('Kit of ' + App.inst.conceptMap.title)
          $('#kit-save-as-dialog .input-title').focus().select()
          $('#kit-save-as-dialog .bt-generate-fid').trigger('click')
          // $('#input-layout-preset').prop('checked', true)
          // $('#input-enabled').prop('checked', true)
        }
      },
      hideElement: '.bt-cancel'
    })
    saveAsDialog.setKitMap = (kitMap) => { // console.log(kitMap)
      if (kitMap) saveAsDialog.kitMap = kitMap
      else saveAsDialog.kitMap = null
      return saveAsDialog;
    }
    saveAsDialog.setTitle = (title) => {
      $('#kit-save-as-dialog .dialog-title').html(title)
      return saveAsDialog
    }
    saveAsDialog.setIcon = (icon) => {
      $('#kit-save-as-dialog .dialog-icon').removeClass()
        .addClass(`dialog-icon bi bi-${icon} me-2`)
      return saveAsDialog
    }
  
    let openDialog = UI.modal('#concept-map-open-dialog', {
      hideElement: '.bt-cancel',
      width: '700px'
    })
  
    let optionDialog = UI.modal('#kit-option-dialog', {
      hideElement: '.bt-cancel',
      width: '650px',
      onShow: () => { 
        try {
          let kitMapOptions = optionDialog.kitMap.map.options ?
          JSON.parse(optionDialog.kitMap.map.options) : null;
          this.populateOptions(kitMapOptions);
        } catch(e) {
          optionDialog.setDefault();
          this.populateOptions(CDM.options);
          return;
        }
  
        
      }
    })
    optionDialog.setKitMap = (kitMap) => {
      optionDialog.kitMap = kitMap
      return optionDialog
    }
    optionDialog.setDefault = () => {
      // console.error(CDM.options);
      let layout = $('#kit-option-dialog input[name="layout"][value="preset"]'); 
      let feedbackleveldefault = $('#kit-option-dialog select[name="feedbacklevel"] option.default');
      let fullfeedback = $('#kit-option-dialog input[name="fullfeedback"]');
      let modification = $('#kit-option-dialog input[name="modification"]');
      let readcontent = $('#kit-option-dialog input[name="readcontent"]');
      let saveload = $('#kit-option-dialog input[name="saveload"]');
      let reset = $('#kit-option-dialog input[name="reset"]');
      let feedbacksave = $('#kit-option-dialog input[name="feedbacksave"]');
      let countfb = $('#kit-option-dialog input[name="countfb"]');
      let countsubmit = $('#kit-option-dialog input[name="countsubmit"]');
      let log = $('#kit-option-dialog input[name="log"]');
  
      layout.prop('checked', true);
      feedbackleveldefault.prop('selected', true);
      fullfeedback.prop('checked', true);
      modification.prop('checked', true);
      readcontent.prop('checked', true);
      saveload.prop('checked', true);
      reset.prop('checked', true);
      feedbacksave.prop('checked', true);
      countfb.prop('checked', false);
      countsubmit.prop('checked', false);
      log.prop('checked', false);
    }
    optionDialog.enableAll = () => {
      let layout = $('#kit-option-dialog input[name="layout"][value="random"]');
      let feedbacklevel = $('#kit-option-dialog select[name="feedbacklevel"]');
      let fullfeedback = $('#kit-option-dialog input[name="fullfeedback"]');
      let modification = $('#kit-option-dialog input[name="modification"]');
      let readcontent = $('#kit-option-dialog input[name="readcontent"]');
      let saveload = $('#kit-option-dialog input[name="saveload"]');
      let reset = $('#kit-option-dialog input[name="reset"]');
      let feedbacksave = $('#kit-option-dialog input[name="feedbacksave"]');
      let countfb = $('#kit-option-dialog input[name="countfb"]');
      let countsubmit = $('#kit-option-dialog input[name="countsubmit"]');
      let log = $('#kit-option-dialog input[name="log"]');
  
      layout.prop('checked', true);
      feedbacklevel.val(3).change();
      fullfeedback.prop('checked', true);
      modification.prop('checked', true);
      readcontent.prop('checked', true);
      saveload.prop('checked', true);
      reset.prop('checked', true);
      feedbacksave.prop('checked', true);
      countfb.prop('checked', true);
      countsubmit.prop('checked', true);
      log.prop('checked', true);
    }
    optionDialog.disableAll = () => {
      let layout = $('#kit-option-dialog input[name="layout"][value="preset"]');
      let feedbacklevel = $('#kit-option-dialog select[name="feedbacklevel"]');
      let fullfeedback = $('#kit-option-dialog input[name="fullfeedback"]');
      let modification = $('#kit-option-dialog input[name="modification"]');
      let readcontent = $('#kit-option-dialog input[name="readcontent"]');
      let saveload = $('#kit-option-dialog input[name="saveload"]');
      let reset = $('#kit-option-dialog input[name="reset"]');
      let feedbacksave = $('#kit-option-dialog input[name="feedbacksave"]');
      let countfb = $('#kit-option-dialog input[name="countfb"]');
      let countsubmit = $('#kit-option-dialog input[name="countsubmit"]');
      let log = $('#kit-option-dialog input[name="log"]');
  
      layout.prop('checked', true);
      feedbacklevel.val(0).change()
      fullfeedback.prop('checked', false)
      modification.prop('checked', false)
      readcontent.prop('checked', false)
      saveload.prop('checked', false)
      reset.prop('checked', false)
      feedbacksave.prop('checked', false)
      countfb.prop('checked', false);
      countsubmit.prop('checked', false);
      log.prop('checked', false)
    }
  
    let textDialog = UI.modal('#text-dialog', {
      hideElement: '.bt-close',
      onShow: () => { // console.log(textDialog.kit)
        if (!textDialog.kitMap.map.text) {
          $("#assigned-text").html('<em class="text-danger px-3">This kit has no text assigned.</em>')
          $('form.form-search-text').trigger('submit')
        } else {
          this.ajax.get(`contentApi/getText/${textDialog.kitMap.map.text}`).then(text => {
            let assignedTextHtml = `<span class="text-danger">Text:</span> ${text.title} <span class="badge rounded-pill bg-danger bt-unassign px-3 ms-3" role="button" data-text="${text.tid}" data-kid="${textDialog.kitMap.map.kid}">Unassign</span>`
            $("#assigned-text").html(assignedTextHtml)
          })
        }
        $("#kit-name").html(textDialog.kitMap.map.name)
      }
    })
    textDialog.setKitMap = (kitMap) => {
      textDialog.kitMap = kitMap;
      return textDialog
    }
  
  
  
  
  
  
  
  
  
  
  
    /** 
     * Open or Create New Kit
     * */
  
    $('.app-navbar .bt-open-kit').on('click', () => {
      openDialog.show()
      let tid = openDialog.tid;
      if (!tid) $('#concept-map-open-dialog .list-cmap .list-item.default').trigger('click');
      else $(`#concept-map-open-dialog .list-cmap .list-item[data-tid="${tid}"]`).trigger('click');
      $(`#concept-map-open-dialog .bt-refresh-cmap-list`).trigger('click');
    });

    $('#concept-map-open-dialog .bt-refresh-cmap-list').on('click', () => {
      let keyword = $('#form-search-concept-map input[name="keyword"]').val();
      this.ajax.get(`m/x/kb/kitBuildApi/searchConceptMaps/${keyword}`).then(cmaps => { 
        // console.log(cmaps)
        let conceptMapsHtml = '';
        cmaps.forEach(t => { 
          // console.log(t);
          conceptMapsHtml += `<span class="cmap list-item" data-cmid="${t.id}">`
           + `<span class="d-flex align-items-center">`
           + `<span class="text-truncate" style="font-size:0.9rem">${t.title}</span>`
           + `<code class="bg-danger-subtle rounded mx-2 px-2 text-danger text-nowrap text-truncate">${t.id}</code>`
           + `<span class="badge text-bg-warning">${t.created}</span></span>`
           + `<bi class="bi bi-check-lg text-primary d-none"></bi></span>`
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
            delete openDialog.kid;
          }
        });
      });
    });
    
    $('#concept-map-open-dialog .list-concept-map').on('click', '.list-item', (e) => {
      // console.log($(e.currentTarget).attr('data-cmid'));
      if (openDialog.cmid != $(e.currentTarget).attr('data-cmid')) // different concept map?
        openDialog.id = null; // reset selected kit id.
      openDialog.cmid = $(e.currentTarget).attr('data-cmid');
      $('#concept-map-open-dialog .list-concept-map .bi-check-lg').addClass('d-none');
      $('#concept-map-open-dialog .list-concept-map .list-item').removeClass('active');
      $(e.currentTarget).find('.bi-check-lg').removeClass('d-none');
      $(e.currentTarget).addClass('active');
  
      this.ajax.get(`m/x/kb/kitBuildApi/getKitListByConceptMap/${openDialog.cmid}`).then(kits => { 
        // console.log(kits)
        let kitsHtml = '';
        kits.forEach(k => {
          kitsHtml += ``
            + `<span class="kit list-item d-flex align-items-center" data-id="${k.id}">`
            + `  <span class="text-truncate">`
            + `    <span class="text-truncate" title="${k.options.replace(/"/g, '&quot;')}" `
            + `      style="font-size:0.9rem">${k.title}</span>`
            + `    <code class="ms-2">${k.id}</code>`
            + `    <span class="ms-1 badge text-bg-warning">${k.created.substring(0, k.created.length - 3)}</span>`
            + `  </span>`
            + `  <bi class="bi bi-check-lg text-primary d-none"></bi>`
            + `</span>`;
        });
        if (kits.length == 0) kitsHtml += `<span><em class="text-muted text-center d-block p-1" style="font-size:0.9rem">No registered kits</em></span>`;
        $('#concept-map-open-dialog .list-kit').slideUp({
          duration: 100,
          complete: () => {
            $('#concept-map-open-dialog .list-kit')
              .html(kitsHtml).slideDown({
                duration: 100,
                complete: () => {
                  let item = $(`#concept-map-open-dialog .list-kit .list-item[data-id="${openDialog.id}"]`)
                  if(openDialog.id && item.length) {
                    item.trigger('click')[0]
                      .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                      });
                  } else $('#concept-map-open-dialog .list-kit').scrollTop(0);
                  delete openDialog.kid;
                }
              });
          }
        });
      });
    })
  
    $('#concept-map-open-dialog .list-kit').on('click', '.list-item', (e) => {
      openDialog.kid = $(e.currentTarget).attr('data-id');
      $('#concept-map-open-dialog .list-kit .bi-check-lg').addClass('d-none');
      $('#concept-map-open-dialog .list-kit .list-item').removeClass('active');
      $(e.currentTarget).find('.bi-check-lg').removeClass('d-none');
      $(e.currentTarget).addClass('active');
    })
    

  
    $('#concept-map-open-dialog').on('click', '.bt-open', (e) => {
      e.preventDefault()
      if (!openDialog.kid) {
        (new CoreInfo('Please select a concept map and a kit.')).show();
        return;
      }
      KitBuild.openKitMap(openDialog.kid).then(kitMap => {
        try {
          // console.warn(kitMap);
          App.inst.setKitMap(kitMap);
          kitMap.conceptMap = Object.assign(kitMap.conceptMap, App.inst.decodeMap(kitMap.conceptMap.data));
          App.inst.setConceptMap(kitMap.conceptMap);
          kitMap.canvas.conceptMap = kitMap.conceptMap.canvas;
          let cyData = KitBuildUI.composeKitMap(kitMap.canvas);
          // console.log(cyData);
          if (this.canvas.cy.elements().length) {
            let confirm = (new CoreConfirm("Open the kit replacing the current kit on Canvas?")).positive(() => {
              this.canvas.cy.elements().remove();
              this.canvas.cy.add(cyData);
              this.canvas.applyElementStyle();
              this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA).fit();
              KitBuildUI.showBackgroundImage(this.canvas);
              confirm.hide();
              openDialog.hide();
            }).show();
          } else {
            this.canvas.cy.add(cyData);
            this.canvas.applyElementStyle();
            this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA).fit();
            KitBuildUI.showBackgroundImage(this.canvas);
            openDialog.hide();
          }
        } catch (error) { console.error(error)
          UI.error("Unable to open selected kit.").show(); 
        }
      }).catch((error) => { console.error(error)
        UI.error("Unable to open selected kit.").show(); 
      })
    });
  
    $('#concept-map-open-dialog').on('click', '.bt-new', (e) => {
      e.preventDefault()
      if (!openDialog.cmid) {
        (new CoreInfo('Please select a concept map.')).show();
        return
      }
      KitBuild.openConceptMap(openDialog.cmid).then(conceptMap => {
        // console.log(conceptMap);
        try {
          conceptMap = Object.assign(conceptMap, App.inst.decodeMap(conceptMap.data, openDialog));

          let proceed = () => {
            this.showConceptMap(conceptMap);
            UI.info('Concept map loaded.').show();

            openDialog.hide();
          };
          if (this.canvas.cy.elements().length) {
            let confirm = new CoreConfirm(
              "Do you want to open and replace current concept map on canvas?"
            ).positive(() => {
                confirm.hide();
                proceed();
              }).show();
          } else
            proceed();

          App.inst.setKitMap(null);
          App.inst.setConceptMap(conceptMap);

        } catch (error) { console.error(error)
          UI.error("Unable to open selected concept map as kit.").show(); 
        }
      }).catch((error) => { console.error(error)
        UI.error("Unable to open selected concept map as kit.").show(); 
      })
    });
  
  
    $('.app-navbar .bt-close-kit').on('click', () => {
      if (App.inst.conceptMap)
        (new CoreConfirm('Close this kit?')).positive(() => {
          // console.log(this.canvas);
          this.canvas.reset();
          App.inst.setConceptMap();
          App.inst.setKitMap();
          optionDialog.setDefault();
          CDM.options = {};
        }).show();
      else UI.info('Nothing to close.').show();
    })
  
  
  
  
  
  
  
    /** 
     * Set Options for Kit
     * */
    
    $('.app-navbar .bt-option').on('click', () => { // console.log(App.inst)
      optionDialog.show();
    });
  
    $('#kit-option-dialog').on('click', '.bt-enable-all', (e) => {
      optionDialog.enableAll();
    });
  
    $('#kit-option-dialog').on('click', '.bt-disable-all', (e) => {
      optionDialog.disableAll();
    })
    
    $('#kit-option-dialog').on('click', '.bt-default', (e) => {
      optionDialog.setDefault();
    })
  
    $('#kit-option-dialog').on('click', '.bt-apply', (e) => {
      let option = {
        layout: $('#kit-option-dialog input[name="layout"]:checked').val(),
        feedbacklevel: $('#kit-option-dialog select[name="feedbacklevel"]').val(),
        fullfeedback: $('#kit-option-dialog input[name="fullfeedback"]').prop('checked') ? 1 : 0,
        modification: $('#kit-option-dialog input[name="modification"]').prop('checked') ? 1 : 0,
        readcontent: $('#kit-option-dialog input[name="readcontent"]').prop('checked') ? 1 : 0,
        saveload: $('#kit-option-dialog input[name="saveload"]').prop('checked') ? 1 : 0,
        reset: $('#kit-option-dialog input[name="reset"]').prop('checked') ? 1 : 0,
        feedbacksave: $('#kit-option-dialog input[name="feedbacksave"]').prop('checked') ? 1 : 0,
        countfb: $('#kit-option-dialog input[name="countfb"]').prop('checked') ? 1 : 0,
        countsubmit: $('#kit-option-dialog input[name="countsubmit"]').prop('checked') ? 1 : 0,
        log: $('#kit-option-dialog input[name="log"]').prop('checked') ? 1 : 0,
      }
      // console.log(option);
      // only store information, when it is not default
      if (option.layout == 'preset') delete option.layout;
      if (option.feedbacklevel == 2) delete option.feedbacklevel;
      if (option.fullfeedback) delete option.fullfeedback;
      if (option.modification) delete option.modification;
      if (option.readcontent) delete option.readcontent;
      if (option.saveload) delete option.saveload;
      if (option.reset) delete option.reset;
      if (option.feedbacksave) delete option.feedbacksave;
      if (!option.countfb) delete option.countfb;
      if (!option.countsubmit) delete option.countsubmit;
      if (!option.log) delete option.log;

      CDM.options = option;
      UI.success("Kit options applied.").show();

    })
  
  
  
  
  
  
  
  
  
  
  
  
    /** 
     * 
     * Content assignment
    */
  
    $('.app-navbar').on('click', '.bt-content', (e) => {
      if (!App.inst.kitMap) {
        UI.error('Please save or open a kit.').show()
        return
      }
      textDialog.setKitMap(App.inst.kitMap).show()
      // KitBuild.openKitMap(App.inst.kitMap.map.kid).then(kitMap => {
      //   App.inst.setKitMap(kitMap)
      // })
    })
  
    $('form.form-search-text').on('submit', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.ajax.post(`contentApi/getTexts/1/5`, {
        keyword: $('#input-keyword').val().trim()
      }).then(texts => {
        let textsHtml = ''
        texts.forEach(text => {
          textsHtml += `<div class="text-item d-flex align-items-center py-1 border-bottom" role="button"`
          textsHtml += `  data-tid="${text.tid}" data-title="${text.title}">`
          textsHtml += `  <span class="flex-fill ps-2 text-truncate text-nowrap">${text.title}</span>`
          textsHtml += `  <span class="text-end text-nowrap ms-3">`
          textsHtml += `    <button class="btn btn-sm btn-primary bt-assign"><i class="bi bi-tag-fill"></i> Assign</button>`
          textsHtml += `  </span>`
          textsHtml += `</div>`
        });
        $('#list-text').html(textsHtml)
      })
    })
  
    $('#list-text').on('click', '.bt-assign', e => {
      e.preventDefault()
      let tid = $(e.currentTarget).parents('.text-item').attr('data-tid')
      this.ajax.post(`contentApi/assignTextToKitMap`, {
        tid: tid,
        kid: textDialog.kitMap.map.kid
      }).then(kitMap => { 
        // console.log(kitMap)
        this.ajax.get(`contentApi/getText/${kitMap.map.text}`).then(text => {
          let assignedTextHtml = `<span class="text-danger">Text:</span> ${text.title} <span class="badge rounded-pill bg-danger bt-unassign px-3 ms-3" role="button" data-text="${text.tid}" data-kid="${textDialog.kitMap.map.kid}">Unassign</span>`
          $("#assigned-text").html(assignedTextHtml)
        })
        App.inst.setKitMap(kitMap)
      }).catch(error => console.error(error))
    })
  
    $('#assigned-text').on('click', '.bt-unassign', e => {
      e.preventDefault()
      let kid = $(e.currentTarget).attr('data-kid')
      this.ajax.post(`contentApi/unassignTextFromKitMap`, {
        kid: kid,
      }).then(kitMap => { 
        // console.log(kitMap)
        $("#assigned-text").html('<em class="text-danger px-3">This kit has no text assigned.</em>')
        App.inst.setKitMap(kitMap)
      }).catch(error => console.error(error))
    })
  
  
  
  
  
  
  
  
  
    /** 
     * Save/Save As Kit
     * */
  
    $('.app-navbar .bt-save').on('click', () => { // console.log(App.inst)
      if (!App.inst.kitMap) $('.app-navbar .bt-save-as').trigger('click')
      else saveAsDialog.setKitMap(App.inst.kitMap)
        .setTitle("Save Kit (Update)")
        .setIcon("file-earmark-check")
        .show()
    })
    
    $('.app-navbar .bt-save-as').on('click', () => {
      if (!App.inst.conceptMap) {
        UI.warning("Nothing to save, please open a concept map.").show()
        return;
      }
      saveAsDialog.setKitMap()
        .setTitle("Save current kit as (new or another kit)...")
        .setIcon("file-earmark-plus")
        .show();
    })

    $('#kit-save-as-dialog input[name="title"]').on('keyup', (e) => { // console.log(e)
      e.preventDefault();
      if (!saveAsDialog.kitMap)
        $('#kit-save-as-dialog .bt-generate-fid').trigger('click'); 
    })
  
    $('#kit-save-as-dialog').on('click', '.bt-generate-fid', (e) => { // console.log(e)
      $('#input-fid').val($('#input-title').val().replace(/\s/g, '')
        .substring(0, 64).trim().toLowerCase());
      e.preventDefault();
    })
  
    $('#kit-save-as-dialog').on('click', '.bt-new-topic-form', (e) => { // console.log(e)
      $('#kit-save-as-dialog .form-new-topic').slideDown('fast')
      e.preventDefault()
    })
  
    $('#kit-save-as-dialog').on('submit', (e) => {
      e.preventDefault()
      if (!App.inst.conceptMap) {
        UI.info('Please open a goalmap.').show()
        return;
      }
      if ($('#input-title').val().trim().length == 0) {
        UI.info('Please provide a name for the kit.').show()
        return;
      }

      let id = $('#input-fid').val().match(/^ *$/) ? null : $('#input-fid').val().trim();
      let title = $('#input-title').val().trim();
      if (!id) {
        (new CoreError('Invalid kit ID.')).show();
        return;
      }

      this.canvas.cy.elements().removeClass('select').unselect();
      let kitdata = {};
      kitdata.canvas = KitBuildUI.buildConceptMapData(this.canvas);
      kitdata.map = {
        id: id,
        title: title,
        cmid: this.conceptMap.map.cmid ? this.conceptMap.map.cmid : null,
        layout: CDM.options.layout ?? 'preset',
        options: CDM.options,
        enabled: true,
        // info: this.simplemde.value().trim(),
      };
      // clean image data of kit
      kitdata.canvas.concepts.forEach(c => {
        let d = JSON.parse(c.data);
        delete d.image;
        c.data = JSON.stringify(d);
      });
      let data = {
        id: id,
        title: kitdata.map.title,
        cmid: kitdata.map.cmid,
        data: Core.compress(kitdata),
        options: JSON.stringify(CDM.options)
      };
      if (saveAsDialog.kitMap) {
        data.newid = id;   
        data.id = saveAsDialog.kitMap.id;
        // console.warn(data);
        this.ajax.post("m/x/kb/kitBuildApi/updateKitMap", data).then(kitMap => { 
          // console.log(kitMap);
          App.inst.setKitMap(kitMap);
          UI.success("Kit has been updated successfully.").show(); 
          saveAsDialog.hide(); 
        })
        .catch(error => { UI.error(error).show(); })
      } else {
        // console.warn(data);
        this.ajax.post("m/x/kb/kitBuildApi/saveKitMap", data).then(kitMap => { 
            // console.log(kitMap);
            App.inst.setKitMap(kitMap);
            UI.success("Kit has been saved successfully.").show(); 
            saveAsDialog.hide(); 
          })
          .catch(error => { UI.error(error).show(); })
      }
    })
  
    
  
  
  
  
  
  
  
  
    /** 
     * Kit Edges Modification Tools
     * */ 
  
    $('.app-navbar .bt-toggle-left').on('click', () => {
      if (!App.inst.conceptMap) return
      if (this.canvas.cy.edges('[type="left"]').length)
        this.canvas.cy.edges('[type="left"]').remove();
      else {
        console.error(App.inst.conceptMap);
        App.inst.conceptMap.canvas.links.forEach(link => {
          if (!link.source_cid) return
          this.canvas.cy.add({
            group: "edges",
            data: JSON.parse(link.source_data)
          })
        });
      }
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas()
    });

    $('.app-navbar .bt-toggle-right').on('click', () => {
      if (!App.inst.conceptMap) return;
      if (this.canvas.cy.edges('[type="right"]').length)
        this.canvas.cy.edges('[type="right"]').remove();
      else {
        App.inst.conceptMap.canvas.linktargets.forEach(linktarget => {
          this.canvas.cy.add({
            group: "edges",
            data: JSON.parse(linktarget.target_data)
          })
        });
      }
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas()
    });

    $('.app-navbar .bt-remove').on('click', () => {
      if (!App.inst.conceptMap) return
      if (this.canvas.cy.edges().length) this.canvas.cy.edges().remove();
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas()
    });
  
    $('.app-navbar .bt-restore').on('click', () => {
      if (!App.inst.conceptMap) return
      this.canvas.cy.edges().remove();
      App.inst.conceptMap.canvas.links.forEach(link => {
        if (!link.source_cid) return
        this.canvas.cy.add({
          group: "edges",
          data: JSON.parse(link.source_data)
        })
      });
      App.inst.conceptMap.canvas.linktargets.forEach(linktarget => {
        this.canvas.cy.add({
          group: "edges",
          data: JSON.parse(linktarget.target_data)
        })
      });
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas()
    });
  
    $('.app-navbar .bt-reset').on('click', () => {
      if (!App.inst.conceptMap) {
        new CoreError("No concept map opened.").show();
        return;
      }
      // console.log(App.inst.conceptMap);
      let confirm = new CoreConfirm(
        "Do you want to reset the map to goalmap settings?"
      )
        .positive(() => {
          KitBuild.openConceptMap(App.inst.conceptMap.map.cmid)
            .then((conceptMap) => {
              try {
                conceptMap = App.inst.decodeMap(conceptMap.data);
                this.showConceptMap(conceptMap);
                UI.info("Concept map has been reset to goal map.").show();
                App.inst.setKitMap(null);
                App.inst.setConceptMap(conceptMap);
              } catch (error) {
                console.error(error);
                UI.error("Unable to decode and show goal map as kit.").show();
              }
            })
            .catch((error) => {
              console.error(error);
              UI.error("Cannot reset concept map as kit.").show();
            });
        })
        .show();
    })
  
  }

  populateOptions(kitMapOptions) {
    // console.warn(kitMapOptions);
    let feedbacklevel = $('#kit-option-dialog select[name="feedbacklevel"]');
    let feedbackleveldefault = $('#kit-option-dialog select[name="feedbacklevel"] option.default');
    let fullfeedback = $('#kit-option-dialog input[name="fullfeedback"]');
    let modification = $('#kit-option-dialog input[name="modification"]');
    let readcontent = $('#kit-option-dialog input[name="readcontent"]');
    let saveload = $('#kit-option-dialog input[name="saveload"]');
    let reset = $('#kit-option-dialog input[name="reset"]');
    let feedbacksave = $('#kit-option-dialog input[name="feedbacksave"]');
    let countfb = $('#kit-option-dialog input[name="countfb"]');
    let countsubmit = $('#kit-option-dialog input[name="countsubmit"]');
    let log = $('#kit-option-dialog input[name="log"]');

    if (kitMapOptions.layout == 'preset') {
      // console.warn(kitMapOptions);
      $('#kit-option-dialog input[name="layout"][value="preset"]').prop('checked', true);
    }
    if (kitMapOptions.layout == 'random') {
      // console.warn(kitMapOptions);
      $('#kit-option-dialog input[name="layout"][value="random"]').prop('checked', true);
    }

    if (kitMapOptions.feedbacklevel) feedbacklevel.val(kitMapOptions.feedbacklevel).change();
    else feedbackleveldefault.prop('selected', true);

    if (typeof kitMapOptions.fullfeedback != 'undefined')
      fullfeedback.prop('checked', parseInt(kitMapOptions.fullfeedback) == 1 ? true : false);
    else fullfeedback.prop('checked', true);

    if (typeof kitMapOptions.modification != 'undefined')
      modification.prop('checked', parseInt(kitMapOptions.modification) == 1 ? true : false);
    else modification.prop('checked', true);

    if (typeof kitMapOptions.readcontent != 'undefined')
      readcontent.prop('checked', parseInt(kitMapOptions.readcontent) == 1 ? true : false);
    else readcontent.prop('checked', true);

    if (typeof kitMapOptions.saveload != 'undefined')
      saveload.prop('checked', parseInt(kitMapOptions.saveload) == 1 ? true : false);
    else saveload.prop('checked', true);

    if (typeof kitMapOptions.reset != 'undefined')
      reset.prop('checked', parseInt(kitMapOptions.reset) == 1 ? true : false);
    else reset.prop('checked', true);

    if (typeof kitMapOptions.feedbacksave != 'undefined')
      feedbacksave.prop('checked', parseInt(kitMapOptions.feedbacksave) == 1 ? true : false);
    else feedbacksave.prop('checked', true);

    if (typeof kitMapOptions.countfb != 'undefined')
      countfb.prop('checked', parseInt(kitMapOptions.countfb) == 1 ? true : false);
    else countfb.prop('checked', false);

    if (typeof kitMapOptions.countsubmit != 'undefined')
      countsubmit.prop('checked', parseInt(kitMapOptions.countsubmit) == 1 ? true : false);
    else countsubmit.prop('checked', false);

    if (typeof kitMapOptions.log != 'undefined')
      log.prop('checked', parseInt(kitMapOptions.log) == 1 ? true : false);
    else log.prop('checked', false);
  }

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



  /**
   * Handle refresh web browser
   */

  handleRefresh() {}

}

App.canvasId = "makekit-canvas";

class KitBuildReferenceTool extends KitBuildCanvasTool {
  constructor(canvas, options) {
    super(
      canvas,
      Object.assign(
        {
          showOn: KitBuildCanvasTool.SH_CONCEPT,
          color: "#1174b6",
          bdColor: "#0045a0d8",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="-4 -4 24 24"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/></svg>',
          gridPos: { x: 0, y: 1 },
        },
        options
      )
    );
    this.contextPosition = { x: 0, y: 0 };
    this.contextRenderedPosition = { x: 0, y: 0 };
  }

  async action(event, e, nodes) {
    let data = nodes[0].data();
    console.log(data);

    let html = `<div class="card border-secondary kb-dialog kb-data-dialog shadow" style="width: 30rem; position: absolute; top: 0" data-id="${data.id}">
      <div class="card-header d-flex justify-content-between align-items-center"><span>Element: ${data.label} <code>${data.id}</code></span> <button class="btn bt-cancel p-0"><i class="bi bi-x-lg"></i></button></div>
      <div class="card-body">`;
      html += `<div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupSelect01">Res ID</label>
        <select class="form-select" name="id" id="inputGroupSelect01"></select>
        </div>`;
      html += `<div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupSelect01">Page</label>
        <input type="text" name="page" class="form-control" value="${data.respage ?? 1}">
        </div>`;
      html += `<div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupSelect01">Keyword</label>
        <input type="text" name="keyword" class="form-control" value="${data.reskeyword ?? data.label}">
        </div>`;
      html += `<div class="text-end">
        <button class="btn btn-outline-success bt-set" type="button" style="min-width:10rem">Set</button>
        <button class="btn btn-outline-danger bt-unset" type="button" style="min-width:10rem">Unset</button></div>`;
      html += `</div>
      <div class="card-footer d-flex justify-content-end">
        <a class="bt-cancel btn btn-sm btn-secondary ms-2" style="min-width: 5rem">OK</a>
      </div>
    </div>`;

    $('.kb-dialog').hide().remove();
    $('body').append(html);



    $('.kb-data-dialog').appendTo('body').show({
      duration: 0,
      complete: () => {
        $('.kb-data-dialog .input-label').focus();
        $('.kb-data-dialog .input-label').select();
        // handle click outside the dialog
        setTimeout(() => {
          $(document).off('click').on('click', (e) => {
            if ($('.kb-data-dialog').find(e.target).length) return;
            $('.kb-data-dialog .bt-cancel').trigger('click');
          })
          $(document).off('keyup').on('keyup', function(e) {
            if (e.key == "Escape") $('.kb-data-dialog .bt-cancel').trigger('click');
          });
        }, 500);
      }
    })
    console.log($(`#${this.canvas.canvasId}`).height(), $(`#${this.canvas.canvasId}`).width(), $(`#${this.canvas.canvasId}`).position(), $(`#${this.canvas.canvasId}`).offset())
    let parent = $(`#${this.canvas.canvasId}`);
    let offset = $(parent).offset();
    let child = $('.kb-data-dialog');
    console.log(offset, child.width(), child.height());
    $('.kb-data-dialog').css({
      top:  (parent.height()/2 - child.height()/2) + offset.top, 
      left: (parent.width()/2 - child.width()/2) + offset.left 
    });

    $('.kb-data-dialog').on('change', 'select[name="attr"]', e => {
      let attr = $(e.currentTarget).val();
      // console.log(attr);
      $('.kb-data-dialog input[name="attr"]').val(attr);
      $('.kb-data-dialog input[name="value"]').val(data[attr]);
    })

    $('.kb-data-dialog').on('click', '.bt-set', e=> {
      let resid = $('.kb-data-dialog select[name="id"]').val();
      let respage = $('.kb-data-dialog input[name="page"]').val();
      let reskeyword = $('.kb-data-dialog input[name="keyword"]').val();
      nodes[0].data('resid', resid);
      nodes[0].data('respage', respage);
      nodes[0].data('reskeyword', reskeyword);
      $(e.currentTarget).html('Set <i class="bi bi-check"></i>').removeClass('btn-outline-success').addClass('btn-success');
      setTimeout(() => {
        $(e.currentTarget).html('Set').removeClass('btn-success').addClass('btn-outline-success');
      }, 1000);
    });

    $('.kb-data-dialog').on('click', '.bt-unset', e=> {
      nodes[0].removeData('resid');
      nodes[0].removeData('respage');
      nodes[0].removeData('reskeyword');
      $('.kb-data-dialog select[name="id"] option').prop('selected', false);
      $('.kb-data-dialog input[name="page"]').val(1);
      $('.kb-data-dialog input[name="keyword"]').val(nodes[0].data('label'));
      $(e.currentTarget).html('Unset <i class="bi bi-check"></i>').removeClass('btn-outline-danger').addClass('btn-danger');
      setTimeout(() => {
        $(e.currentTarget).html('Unset').removeClass('btn-danger').addClass('btn-outline-danger');
      }, 1000);
    });

    $('.kb-data-dialog .bt-cancel').off('click').on('click', () => {
      $(document).off('click').off('keyup');
      $('.kb-dialog').hide().remove();
    });

    this.settings.ajax.get(`m/x/kb/kitBuildApi/getConceptMapReferenceList/${App.inst.conceptMap.id}`).then(list => {
      for(let ref of list) {
        let selected = nodes[0].data('resid') == ref.id ? 'selected="selected"' : '';
        $('.kb-data-dialog select[name="id"]').append(`<option value="${ref.id}" ${selected}>${ref.id}</option>`);
      }
    });

    return;
  }
}