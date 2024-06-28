$(() => { let app = App.instance() })

CDM = {};
CDM.canvasId = "analyzer-canvas"

class App {
  constructor() {
    this.kbui = KitBuildUI.instance(CDM.canvasId)
    let canvas = this.kbui.canvases.get(CDM.canvasId)
    // canvas.addToolbarTool(KitBuildToolbar.UNDO_REDO, { priority: 3 })
    canvas.addToolbarTool(KitBuildToolbar.NODE_CREATE, { priority: 1, visible: false})
    canvas.addCanvasTool(KitBuildCanvasTool.FOCUS, { gridPos: { x: 0, y: -1}})
    canvas.addToolbarTool(KitBuildToolbar.CAMERA, { priority: 4 })
    canvas.addToolbarTool(KitBuildToolbar.UTILITY, { priority: 5, trash: false })
    canvas.toolbar.addTool("compare-switch", new CompareSwitchTool(canvas))
    canvas.canvasTool.enableConnector(false).enableIndicator(false)
    canvas.toolbar.render()
    // canvas.addCanvasTool(KitBuildCanvasTool.CENTROID)

    this.session = Core.instance().session()
    // Hack for sidebar-panel show/hide
    // To auto-resize the canvas.
    let observer = new MutationObserver((mutations) => $(`#${CDM.canvasId} > div`).css('width', 0))
    observer.observe(document.querySelector('#admin-sidebar-panel'), {attributes: true})
    // Enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip({ html: true }) 

    this.handleEvent();
    this.handleRefresh();
  }

  static instance() {
    App.inst = new App();
  }

  handleEvent() {

    this.canvas = this.kbui.canvases.get(CDM.canvasId);
    this.ajax = Core.instance().ajax();
    this.session = Core.instance().session();
  
    let openDialog = UI.modal('#concept-map-open-dialog', {
      hideElement: '.bt-cancel',
      width: '650px'
    });

    let devchartDialog = UI.modal('#devchart-dialog', {
      hideElement: '.bt-cancel',
      width: '800px'
    });
  
  
  
  
  
  
  
  
  
  
  
    /** 
     * 
     * Open
    */
  
    $(".app-navbar .bt-open").on("click", (e) => {
      openDialog.show();
      $('#concept-map-open-dialog .bt-refresh-cmap-list').trigger('click');
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
           + `<code class="bg-danger-subtle rounded mx-2 px-2 text-danger text-nowrap">${t.id}</code>`
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
  
    $("#concept-map-open-dialog .list-concept-map").on(
      "click",
      ".list-item",
      (e) => {
        openDialog.cmid = $(e.currentTarget).attr("data-cmid");
        $("#concept-map-open-dialog .list-concept-map .bi-check-lg").addClass(
          "d-none"
        );
        $("#concept-map-open-dialog .list-concept-map .list-item").removeClass(
          "active"
        );
        $(e.currentTarget).find(".bi-check-lg").removeClass("d-none");
        $(e.currentTarget).addClass("active");
      }
    );
  
    $("#concept-map-open-dialog").on("click", ".bt-open", (e) => {
      e.preventDefault();
      if (!openDialog.cmid) {
        (new CoreInfo("Please select a concept map.")).show();
        return;
      }

      openDialog.hide();
      App.populateKits(openDialog.cmid);
      App.populateSessions(openDialog.cmid);

      KitBuild.openConceptMap(openDialog.cmid)
        .then((conceptMap) => {
          conceptMap = Object.assign(conceptMap, App.inst.decodeMap(conceptMap.data, openDialog));
          this.showConceptMap(conceptMap);
          this.setConceptMap(conceptMap);
        })
        .catch(error => {
          console.error(error);
          UI.dialog("The concept map data is invalid.", {
            icon: "exclamation-triangle",
            iconStyle: "danger",
          }).show();
        });
    });
  
  
  
  
  
    
  
  
  
    /** 
     * 
     * Teacher Map
     * */
  
    $('.app-navbar .bt-teacher-map').on('click', (e) => { // console.log(e)
      if (!App.inst.conceptMap) {
        UI.info("Please open a concept map.").show();
        return;
      }
      let cyData = KitBuildUI.composeConceptMap(App.inst.conceptMap.canvas);
      this.canvas.cy.elements().remove();
      this.canvas.cy.add(cyData);
      this.canvas.applyElementStyle();
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
      KitBuildUI.showBackgroundImage(this.canvas);
      let camera = this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA);
      if (camera) camera.center(null, { duration: 0 });
      App.canvasState = CanvasState.TEACHER;
    })
  
  
  
  
  
    
  
  
  
    /** 
     * 
     * Student Map
     * */
  
    //  $('.app-navbar .bt-student-map').on('click', (e) => { // console.log(e)
    //   if (!App.inst.conceptMap) {
    //     UI.info("Please open a concept map.").show();
    //     return;
    //   }
    //   let lmid = $("#list-session").find(".active").data("lmid");
    //   if (!lmid) {
    //     UI.info("Please select a student concept map from the student concept map list.").show();
    //     return;
    //   }
    //   KitBuild.openLearnerMap(lmid).then((learnerMap) => {
    //     learnerMap = Object.assign(learnerMap, Core.decompress(learnerMap.data));
    //     learnerMap.canvas.conceptMap = App.inst.conceptMap;
    //     let cyData = KitBuildUI.composeLearnerMap(learnerMap.canvas);
    //     this.canvas.cy.elements().remove();
    //     this.canvas.cy.add(cyData);
    //     this.canvas.applyElementStyle();
    //     this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
    //     KitBuildUI.showBackgroundImage(this.canvas);
    //     let camera = this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA);
    //     if (camera) camera.center(null, { duration: 0 });
    //     App.canvasState = CanvasState.STUDENT;
    //   });
    // })
  
  
  
  
  
    
  
  
  
    /** 
     * 
     * Compare Map
     * */
  
    //  $('.app-navbar .bt-compare-map').on('click', (e) => { // console.log(e)
    //   if (!App.inst.conceptMap) {
    //     UI.info('Please open a concept map.').show()
    //     return
    //   }
    //   let lmid = $('#list-session').find('.active').data('lmid')
    //   if (!lmid) {
    //     UI.info('Please select a student concept map from the student concept map list.').show()
    //     return
    //   } 
    //   $('#list-session').find('.active').trigger('click')
    // })
  
  
  
  
  
  
  
  
  
    /** 
     * 
     * Learnermap List
     * */
  
    $('#list-session').on('click', '.session', (e) => {
      let lid = $(e.currentTarget).attr('data-id');
      let log = CDM.sessions.get(lid);
      CDM.log = log;
      CDM.propLength = CDM.conceptMap.canvas.linktargets.length;
      // console.log(CDM);
      // console.log(log, lid);
      this.ajax.get(`m/x/kb/analyzerApi/getSessionLogs/${log.sessid}`).then(logs => {
        CDM.logs = new Map(); 
        CDM.feedbackAnn = [];
        logs = Core.decompress(logs);
        // console.log(logs);
        let index = 0;
        logs.map(log => {
          // console.log(log);
          let canvas = log.canvas ? Core.decompress(log.canvas) : null;
          let compare = log.compare ? Core.decompress(log.compare) : null;
          // console.log(canvas, compare);
          if (log.canvas) log.canvas = typeof canvas == "string" ? JSON.parse(canvas) : canvas;
          if (log.compare) log.compare = typeof compare == "string" ? JSON.parse(compare) : compare;
          if (log.data) log.data = JSON.parse(log.data);
          if (log.compare) { 
            log.n = {
              nmatch: log.compare.match.length,
              nmiss: log.compare.miss.length,
              nexcess: log.compare.excess.length,
              nleave: log.compare.leave.length,
              nmatchg: log.compare.matchg.length
            };
          }
          if (log.action == 'feedback') {
            log.feedback = Number((CDM.propLength/2).toFixed(0));
            CDM.feedbackAnn.push(log.seq);
          }
          if (log.action == 'submit') log.submit = Number(log.n.nmatch).toFixed(0);
          log.event = 0;
          CDM.logs.set(index, log);
          index++;
        });
        
        // console.log(logs, CDM.logs);
        this.canvas.cy.elements().remove();
        this.showStateMap(CDM.logs.get(0).canvas, CDM.conceptMap.map.direction);


        let tinfo = `<span class="sessid">userid: ${log.userid}</span> `;
        tinfo += `<span class="ms-1">sessid: ${log.sessid}</span>`;
        tinfo += `<span class="ms-1">cmid: ${log.cmid}</span>`;
        tinfo += `<span class="ms-1">kid: ${log.kid}</span>`;
        tinfo += `<span class="ms-1">start: ${log.tstamp}</span>`;
        tinfo += `<span class="ms-1">end ${log.etstamp}</span>`;
        tinfo += `<span class="ms-1">length: ${logs.length} activity logs</span>`;
        tinfo += `<span class="ms-1">duration: ${App.duration(log.duration)}</span>`;
        $('.timeline-info').html(tinfo);
        $('#timeline-range').attr('min', 0).attr('max', logs.length-1);
        $('#timeline-range').val(0);
        $('#timeline-max-val-label').html(logs.length);

        $('#list-session .session').removeClass('active');
        $(`#list-session .session[data-id="${lid}"]`).addClass('active');
      });  
    });


    $('.bt-map-dev-chart').on('click', (e) => {
      if (!CDM.logs) {
        (new CoreInfo('Please select a session.')).show();
        return;
      }
      devchartDialog.show();
      let data = [...CDM.logs.values()];
      var annArray = CDM.feedbackAnn.map(function(value, index) {
        return {
          type: 'line',
          xMin: value,
          xMax: value,
          borderColor: 'rgb(255, 204, 64)',
          borderWidth: 2,
        }
      });
      CDM.feedbackAnn.map((v, i) => annArray.push({
        type: 'label',
        xValue: v,
        yValue: Number(CDM.propLength/2).toFixed(0),
        backgroundColor: 'rgb(255, 204, 64)',
        content: ['Feedback'],
        font: {
          size: 11
        }
      }));
      const ctx = document.getElementById('analyzer-chart');
      const cfg = {
        type: "line",
        data: {
          datasets: [
            {
              data: data,
              label: "Match",
              borderColor: "#36eb72",
              backgroundColor: "#9bf5b6",
              spanGaps: true,
              parsing: {
                yAxisKey: "n.nmatch",
              },
            },
            {
              data: data,
              label: "Miss",
              borderColor: "#eb3636",
              backgroundColor: "#f59b9b",
              spanGaps: true,
              parsing: {
                yAxisKey: "n.nmiss",
              },
            },
            {
              data: data,
              label: "Excess",
              borderColor: "#36a9eb",
              backgroundColor: "#9be0f5",
              spanGaps: true,
              parsing: {
                yAxisKey: "n.nexcess",
              },
            },
            {
              data: data,
              label: "Leave",
              borderColor: "#d3d3d3",
              backgroundColor: "#ebebeb",
              spanGaps: true,
              parsing: {
                yAxisKey: "n.nleave",
              },
            },
            {
              type: "scatter",
              data: data,
              label: "Feedback",
              borderColor: "#ffb731",
              backgroundColor: "#ffdd95",
              pointStyle: 'circle',
              pointRadius: 10,
              pointHoverRadius: 15,
              spanGaps: true,
              parsing: {
                yAxisKey: "feedback",
              },
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                },
              },
            },
            {
              type: "scatter",
              data: data,
              label: "Submit",
              borderColor: "#31ff5e",
              backgroundColor: "#ace7ac",
              pointStyle: 'circle',
              pointRadius: 10,
              pointHoverRadius: 15,
              spanGaps: true,
              parsing: {
                yAxisKey: "submit",
              },
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                },
              },
            },
            {
              type: "scatter",
              data: data,
              label: "Submit",
              borderColor: "#dfdfdf",
              backgroundColor: "#dfdfdf",
              pointStyle: 'circle',
              pointRadius: 3,
              pointHoverRadius: 5,
              spanGaps: true,
              parsing: {
                yAxisKey: "event",
              },
              scales: {
                x: {
                  type: "linear",
                  position: "bottom",
                },
              },
            }
          ],
        },
        options: {
          parsing: {
            xAxisKey: "seq",
          },
          scale: {
            ticks: {
              precision: 0
            }
          },
          plugins: {
            tooltip: {
              yAlign: (e) => { 
                // console.log(e);
                if (e.tooltipItems.length > 0 && e.tooltipItems[0].datasetIndex == 6) return 'bottom';
                return;
              },
              callbacks: {
                title: function (context) {
                  // console.warn(context, context[0]);
                  if (context[0].datasetIndex == 4) return "Feedback";
                  else return `${context[0].label}: ${context[0].raw.action}\n${context[0].raw.tstamp}`;
                },
                label: function (context) {
                  // console.log(context);
                  if (context.datasetIndex == 4) {
                    context.dataset.label = 'Timestamp';
                    return context.dataset.label += ": " + context.raw.tstamp;
                  }
                  let label = context.dataset.label || "";
                  if (label) { label += ": "; }
                  // if (context.parsed.y !== null) {
                  //   label += new Intl.NumberFormat("en-US", {
                  //     style: "currency",
                  //     currency: "USD",
                  //   }).format(context.parsed.y);
                  // }
                  return label += context.parsed.y;
                },
              }
            },
            annotation: {
              annotations: annArray
            }
          }
        },
      };
      if (CDM.chart) CDM.chart.destroy();
      CDM.chart = new Chart(ctx, cfg); 
    });

    $('input[type="range"').on('input', (e) => {
      let log = CDM.logs.get(Number($(e.currentTarget).val()));
      if (log.canvas) {
        log.canvas = log.canvas.filter(e => {
          let cmapNode = CDM.conceptMap.nodes.get(e.data.id);
          if (cmapNode) Object.assign(e.data, cmapNode.data);
          delete e.selected;
          delete e.removed;
          delete e.selectable;
          delete e.locked;
          delete e.pannable;
          return (e.data.id != 'VIRTUAL');
        });
        this.showStateMap(log.canvas, this.conceptMap.map.direction);
      }
    });
  
    // $('#cb-lm-score').on('change', (e) => {
    //   if ($('#cb-lm-score').prop('checked'))
    //     $('#list-session .score').removeClass('d-none')
    //   else $('#list-session .score').addClass('d-none')
    // })
  
    // $('#cb-lm-feedback').on('change', App.onCheckBoxChanged)
    // $('#cb-lm-draft').on('change', App.onCheckBoxChanged)
    // $('#cb-lm-final').on('change', App.onCheckBoxChanged)
    // $('#cb-lm-first').on('change', App.onCheckBoxChanged)
    // $('#cb-lm-last').on('change', App.onCheckBoxChanged)
    // $('#cb-lm-auto').on('change', App.onCheckBoxChanged)
    // $('#cb-lm-all').on('change', App.onCheckBoxChanged)
  
  
  
  
  
  
  
  
  
  
    /** 
     * 
     * Learnermap List
     * */
  
    // $('#group-map-tools').on('click', '.bt-group-map', (e) => {
    //   let lmids = []
    //   $('#list-session input[type="checkbox"]:checked').each((i, e) => {
    //     lmids.push($(e).parents('.learnermap').attr('data-lmid'))
    //   })
    //   if (!App.inst.learnerMaps || 
    //       App.inst.learnerMaps.size == 0 ||
    //       lmids.length == 0) {
    //         UI.info('Please open a concept map and tick student maps from the list').show()
    //         return
    //   }
  
    //   let cyData = KitBuildUI.composeConceptMap(App.inst.conceptMap)
    //   this.canvas.cy.elements().remove()
    //   this.canvas.cy.add(cyData)
    //   this.canvas.applyElementStyle()
    //   this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas()
    //   this.canvas.canvasTool.tools.get(KitBuildCanvasTool.FOCUS).changeState('show')
  
    //   let learnerMaps = []
    //   App.inst.learnerMaps.forEach((lm, k) => {
    //     if (lmids.includes(k)) learnerMaps.push(lm)
    //   })
  
    //   let groupCompare = Analyzer.groupCompare(learnerMaps)
    //   let mapData = Analyzer.showGroupCompareMap(groupCompare, this.canvas.cy)
    //   this.canvas.toolbar.tools.get("compare-switch").apply()
    //   $('#group-min-val').attr('max', mapData.max).attr('min', mapData.min).val(mapData.min)
    //   $('#group-max-val').attr('max', mapData.max).attr('min', mapData.min).val(mapData.max)
    //   $('#group-min-val-label').html(mapData.min)
    //   $('#group-max-val-label').html(mapData.max)
    //   $("#min-max-range").html(`${$('#group-min-val').val()} ~ ${$('#group-max-val').val()}`)
  
    //   App.updateStatus(null, groupCompare)
  
    // });
  
    // $('#group-min-val').on('change', (e) => {
    //   let val = $('#group-min-val').val()
    //   let maxVal = $('#group-max-val').val()
    //   if (val > maxVal) $('#group-min-val').val(maxVal)
    //   App.updateRangeInformation()
    // })
  
    // $('#group-max-val').on('change', (e) => {
    //   let val = $('#group-max-val').val()
    //   let minVal = $('#group-min-val').val()
    //   if (val < minVal) $('#group-max-val').val(minVal)
    //   App.updateRangeInformation()
    // })
  
    // this.canvas.cy.on('tap', 'edge', (e) => {
    //   if (e.target.hasClass && e.target.hasClass('count')) {
    //     console.error("COUNT", e.target.data('count'))
    //   }
    // });
  
  }

  handleRefresh() {
    // let session = Core.instance().session()
    // let canvas  = this.kbui.canvases.get(CDM.canvasId)
    // session.getAll().then(sessions => { // console.log(sessions)
    //   let cmid = sessions.cmid
    //   let lmid = sessions.lmid
    //   if (cmid) {
    //     KitBuild.openConceptMap(cmid).then(conceptMap => {
    //       canvas.cy.elements().remove()
    //       canvas.cy.add(KitBuildUI.composeConceptMap(conceptMap))
    //       canvas.applyElementStyle()
    //       canvas.toolbar.tools.get(KitBuildToolbar.CAMERA).fit(null, {duration: 0})
    //       App.inst.setConceptMap(conceptMap)
    //       App.populateLearnerMaps(cmid).then(() => {
    //         if (lmid) {
    //           let row = $('#list-session')
    //             .find(`.learnermap[data-lmid="${lmid}"]`)
    //             .trigger('click')
    //           if (row.length) row[0].scrollIntoView({ block: 'center' })
    //         }
    //       })
    //       App.populateKits(cmid)
    //     })
    //   }
    // });
  }

  setConceptMap(conceptMap) { console.warn("CONCEPT MAP SET:", conceptMap)
    this.conceptMap = conceptMap;
    CDM.conceptMap = conceptMap;
    CDM.conceptMap.nodes = new Map();
    conceptMap.cyData.map(e => {
      if (e.group == 'nodes')
        CDM.conceptMap.nodes.set(e.data.id, e);
    });
    // console.warn(this.conceptMap);
    if (conceptMap) {
      // this.session.set('cmid', conceptMap.map.cmid);
      let status = `<span class="mx-2 d-flex align-items-center">`
        + `<span class="badge rounded-pill bg-secondary">ID: ${conceptMap.map.cmid}</span>`
        + `<span class="text-secondary ms-2 text-truncate"><small>${conceptMap.title}</small></span>`
        + `</span>`;
      StatusBar.instance().content(status);
    } else {
      StatusBar.instance().content('');
      this.session.unset('cmid');
    }
  }

  showConceptMap(conceptMap) {
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

  showStateMap(cyData, direction) {
    // App.inst.setConceptMap(conceptMap);
    this.canvas.cy.elements().remove();
    this.canvas.cy.add(cyData);
    this.canvas.applyElementStyle();
    this.canvas.toolbar.tools
      .get(KitBuildToolbar.NODE_CREATE)
      .setActiveDirection(direction);
    this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
    KitBuildUI.showBackgroundImage(this.canvas);
  }

  decodeMap(data) {
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
}

App.populateLearnerMaps = (cmid) => {
  return new Promise((resolve, reject) => {
    Core.instance().ajax().get(`m/x/kb/analyzerApi/getLearnerMapsOfConceptMap/${cmid}`)
      .then(learnerMaps => { // console.log(learnerMaps)
      learnerMaps = Core.decompress(learnerMaps);
      let list = ''
      let score = '147%'
      App.inst.learnerMaps = new Map(
        learnerMaps.map((obj) => [obj.id, Core.decompress(obj.data)])
      );
      
      learnerMaps.map((learnerMap) => {
        // console.log(learnerMap);
        Object.assign(learnerMap, Core.decompress(learnerMap.data));
        learnerMap.canvas.conceptMap = App.inst.conceptMap;
        // console.log(learnerMap);
        Analyzer.composePropositions(learnerMap.canvas);
        let direction = learnerMap.canvas.conceptMap.map.direction;
        learnerMap.compare = Analyzer.compare(learnerMap.canvas, direction);
      });

      learnerMaps.forEach((lm, i) => {
        // console.log(lm);
        let isFirst = i == 0 || i > 0 && learnerMaps[i-1].map.userid != lm.map.userid
        let isLast = (learnerMaps[i+1] && learnerMaps[i+1].map.userid != lm.map.userid) || !learnerMaps[i+1]
        let score = (lm.compare.score * 1000 | 0) / 10 + '%' 
        list += `<div data-lmid="${lm.id}" data-type="${lm.map.type}" data-kid="${lm.map.kid}" data-first="${isFirst}" data-last="${isLast}"`
        list += ` class="py-1 mx-1 d-flex justify-content-between border-bottom learnermap list-item fs-6" role="button">`
        list += `<span class="d-flex align-items-center">`
        list += `<input type="checkbox" class="cb-learnermap" id="cb-lm-${lm.id}">`
        list += `<label class="text-truncate ms-1"><small>${lm.map.userid}</small></label>`
        list += `</span>`
        list += `<span class="d-flex align-items-center">`
        if (lm.map.type == "feedback") list += `<span class="badge bg-warning text-dark ms-1">Fb</span>`
        if (lm.map.type == "draft") list += `<span class="badge bg-warning text-dark ms-1">D</span>`
        if (lm.map.type == "final") list += `<span class="badge bg-primary ms-1">Fl</span>`
        if (lm.map.type == "auto") list += `<span class="badge bg-secondary ms-1">A</span>`
        if (isFirst) list += `<span class="badge bg-secondary ms-1">1</span>`
        if (isLast) list += `<span class="badge bg-info text-dark ms-1">L</span>`
        list += `<span class="ms-2 score d-none"><small>${score}</small></span>`
        list += `</span>`
        list += `</div>`
      })
      $('#list-session').html(list == '' ? '<em class="text-secondary">No learnermaps.</em>' : list)
      App.onCheckBoxChanged()
      resolve()
    })
  }).catch(error => reject(error))
}

App.populateKits = (cmid) => {
  Core.instance()
    .ajax()
    .get(`m/x/kb/kitBuildApi/getKitListByConceptMap/${cmid}`)
    .then((kits) => {
      // console.log(kits)
      $("#select-kid option").not(".default").remove();
      kits.forEach((k, i) => {
        let kit = `<option value=${k.id}>`;
        kit += `${k.title}`;
        kit += `</option>`;
        $("#select-kid").append(kit);
      });
    });
};

App.populateSessions = (cmid) => {
  return new Promise((resolve, reject) => {
    Core.instance().ajax().get(`m/x/kb/analyzerApi/getSessionsOfConceptMap/${cmid}`)
      .then(sessions => { // console.log(sessions)
      let list = ''
      CDM.sessions = new Map();
      sessions = Core.decompress(sessions);
      sessions.map(s => CDM.sessions.set(s.id, s));
      // console.log(CDM.sessions);
      sessions.forEach((s, i) => {
        // console.log(s);
        list += `<div class="d-flex py-1 mx-1 list-item session" data-id="${s.id}" role="button">`;
        list += `<span class="userid me-1 text-truncate" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${s.sessid} / ${s.tstamp}">${s.userid}</span>`;
        list += `<span class="d-flex text-nowrap ms-1">`;
        list += `<span class="tstamp badge text-bg-primary text-nowrap text-truncate me-1">${s.tstamp.substring(0,10)}</span>`;
        list += `<span class="duration badge text-bg-warning d-flex align-items-center"><i class="bi bi-clock-fill me-1"></i> ${App.duration(s.duration)}</span>`;
        list += `</span>`;
        list += `</div>`;
      })
      $('#list-session').html(list == '' ? '<p><em class="text-smaller text-secondary mx-2">No sessions.</em></p>' : list)
      new bootstrap.Tooltip("body", {
        selector: "[data-bs-toggle='tooltip']"
      });
      App.onCheckBoxChanged()
      resolve()
    })
  }).catch(error => reject(error))
}

App.onCheckBoxChanged = (e) => { // onsole.log(e)
  $('#list-session .learnermap').each((i, lm) => {
    let lmid = $(lm).data('lmid')
    let type = $(lm).data('type')
    let first = $(lm).data('first') == true
    let last = $(lm).data('last') == true
    let checked = ($(`#cb-lm-${type}`).prop('checked'));
    if (!checked) checked = first == $(`#cb-lm-first`).prop('checked') && first
    if (!checked) checked = last == $(`#cb-lm-last`).prop('checked') && last
    if (!checked) checked = $(`#cb-lm-all`).prop('checked')
    $(`#cb-lm-${lmid}`).prop('checked', checked);
  })
}

App.updateStatus = (learnerMap, compare) => {
  // console.log(learnerMap);
  if (learnerMap) {
    let statusLearnerMap = `<span class="mx-2 d-flex align-items-center status-learnermap">`
      + `<span class="badge rounded-pill bg-warning text-dark ms-1">ID: ${learnerMap.map.id}</span> `
      + `<small class="text-secondary text-truncate mx-2">${learnerMap.map.userid}</small>`
      + `</span>`
      StatusBar.instance().remove('.status-learnermap').append(statusLearnerMap);
  } else StatusBar.instance().remove('.status-learnermap')

  if (compare) {
    let statusCompare = `<span class="mx-2 d-flex align-items-center status-compare">`
      + `<span class="badge rounded-pill bg-success ms-1">Match: ${compare.match.length}</span>`
      + `<span class="badge rounded-pill bg-danger ms-1">Miss: ${compare.miss.length}</span>`
      + `<span class="badge rounded-pill bg-info text-dark ms-1">Excess: ${compare.excess.length}</span>`
      + `<span class="badge rounded-pill bg-secondary ms-1">Leave: ${compare.leave.length}</span>`
      + `<span class="badge rounded-pill bg-warning text-dark ms-1">Abandon: ${compare.abandon.length}</span>`
      + `</span>`
    StatusBar.instance().remove('.status-compare').append(statusCompare);
  } else StatusBar.instance().remove('.status-compare')
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

