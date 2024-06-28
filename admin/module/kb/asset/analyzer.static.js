$(() => {
  let app = App.instance();
});

class CanvasState {}

CanvasState.INIT = "init";
CanvasState.TEACHER = "teacher-map";
CanvasState.STUDENT = "student-map";
CanvasState.COMPARE = "compare-map";
CanvasState.GROUPCOMPARE = "group-compare-map";

class App {
  constructor() {
    this.kbui = KitBuildUI.instance(App.canvasId);
    let canvas = this.kbui.canvases.get(App.canvasId);
    canvas.addToolbarTool(KitBuildToolbar.NODE_CREATE, { priority: 1, visible: false})
    // canvas.addToolbarTool(KitBuildToolbar.UNDO_REDO, { priority: 3 })
    canvas.addCanvasTool(KitBuildCanvasTool.FOCUS, {
      gridPos: { x: 0, y: -1 },
    });
    canvas.addCanvasTool(KitBuildCanvasTool.PROPOSITION);
    canvas.addCanvasTool(KitBuildCanvasTool.PROPAUTHOR);
    canvas.addToolbarTool(KitBuildToolbar.CAMERA, { priority: 4 });
    canvas.addToolbarTool(KitBuildToolbar.UTILITY, {
      priority: 5,
      trash: false,
    });
    canvas.addToolbarTool(KitBuildToolbar.LAYOUT, { priority: 6 });
    canvas.addToolbarTool(KitBuildToolbar.COMPARE, {
      priority: 1,
      stack: "left",
    });
    canvas.canvasTool.enableConnector(false).enableIndicator(false);
    canvas.toolbar.render();
    // canvas.addCanvasTool(KitBuildCanvasTool.CENTROID)
    this.canvas = canvas;
    this.session = Core.instance().session();
    this.ajax = Core.instance().ajax();
    // Hack for sidebar-panel show/hide
    // To auto-resize the canvas.
    let observer = new MutationObserver((mutations) =>
      $(`#${App.canvasId} > div`).css("width", 0)
    );
    observer.observe(document.querySelector("#admin-sidebar-panel"), {
      attributes: true,
    });
    // Enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip({ html: true });
    this.handleEvent();
    this.handleRefresh();

    // listen to events of canvas
    this.canvas.on("event", this.onCanvasEvent);
  }

  static instance() {
    App.inst = new App();
    // App.handleEvent(App.inst.kbui);
    // App.handleRefresh(App.inst.kbui);
  }

  setConceptMap(conceptMap) {
    console.warn("CONCEPT MAP SET:", conceptMap);
    this.conceptMap = conceptMap;
    // console.log(this)
    if (conceptMap) {
      this.canvas.direction = conceptMap.map.direction;
      this.session.set("cmid", conceptMap.map.cmid);
      let status =
        `<span class="mx-2 d-flex align-items-center">` +
        `<span class="badge rounded-pill bg-secondary">ID: ${conceptMap.map.cmid}</span>` +
        `<span class="text-secondary ms-2 text-truncate"><small>${conceptMap.title}</small></span>` +
        `</span>`;
      StatusBar.instance().content(status);
      App.canvasState = CanvasState.TEACHER;
    } else {
      StatusBar.instance().content("");
      this.session.unset("cmid");
    }
  }

  handleEvent() {
    let openDialog = UI.modal("#concept-map-open-dialog", {
      hideElement: ".bt-cancel",
    });

    this.propositionDialog = UI.modal("#proposition-dialog", {
      hideElement: ".bt-close",
      draggable: true,
      dragHandle: ".drag-handle",
    });
    this.propositionDialog.propositions = [];
    this.propositionDialog.listProposition = (edgeData, conceptMap) => {
      // console.log(
      //   edgeData,
      //   conceptMap,
      //   this.canvas.cy.edges(`#${edgeData.id}`),
      //   App.canvasState,
      //   CanvasState.STUDENT
      // );
      let lid = edgeData.source;
      let cid = edgeData.target;
      let edge = this.canvas.cy.edges(`#${edgeData.id}`);
      this.propositionDialog.propositions = [];
      switch (App.canvasState) {
        case CanvasState.TEACHER:
        case CanvasState.STUDENT: {
          let learnerMap = conceptMap;
          learnerMap.propositions.forEach((p) => { 
            if (p.link.lid == lid) {
              if (edgeData.type == "right" && p.target.cid == cid) {
                this.propositionDialog.propositions.push(p);
              }
              if (edgeData.type == "left" && p.source.cid == cid) {
                this.propositionDialog.propositions.push(p);
              }
            }
          });
          break;
        }
        case CanvasState.COMPARE: {
          let learnerMap = conceptMap;
          let compare = Analyzer.compare(
            learnerMap,
            learnerMap.conceptMap.map.direction
          );
          learnerMap.propositions.forEach((p) => {
            if (p.link.lid == lid) {
              if (
                (edgeData.type == "right" && p.target.cid == cid) ||
                (edgeData.type == "left" && p.source.cid == cid)
              ) {
                compare.match.forEach((m) => {
                  if (
                    m.sid == p.source.cid &&
                    m.lid == p.link.lid &&
                    m.tid == p.target.cid
                  ) {
                    p.type = "match";
                    this.propositionDialog.propositions.push(p);
                  }
                });
                compare.excess.forEach((e) => {
                  if (
                    e.sid == p.source.cid &&
                    e.lid == p.link.lid &&
                    e.tid == p.target.cid
                  ) {
                    p.type = "excess";
                    this.propositionDialog.propositions.push(p);
                  }
                });
              }
            }
          });
          compare.miss.forEach((e) => {
            if (edgeData.type == "right" && (lid != e.lid || !edge.hasClass('miss'))) {
              return;
            }
            this.propositionDialog.propositions.push({
              source: { label: e.source },
              link: { label: e.link },
              target: { label: e.target },
              type: "miss"
            });
          });
          break;
        }
        case CanvasState.GROUPCOMPARE: {
          let lmids = [];
          let learnerMaps = [];
          $('#list-learnermap input[type="checkbox"]:checked').each((i, e) => {
            lmids.push($(e).parents(".learnermap").attr("data-lmid"));
          });
          if (lmids.length == 0) {
            UI.info(
              "Please open a concept map and select at least two student maps from the list"
            ).show();
            return;
          }
          App.inst.learnerMaps.forEach((lm, k) => {
            if (lmids.includes(k)) learnerMaps.push(lm);
          });
          let edge = this.canvas.cy.edges(`#${edgeData.id}`);
          let link = edge.connectedNodes('[type="link"]');
          let edgeClasses = edge.classes();
          let groupCompare = Analyzer.groupCompare(learnerMaps);
          groupCompare.match.forEach((p) => {
            if (!edgeClasses.includes("match") && edge.data("type") == "right")
              return;
            if (
              p.lid == lid &&
              ((edgeData.type == "right" && p.tid == cid) ||
                (edgeData.type == "left" && p.sid == cid))
            )
              this.propositionDialog.propositions.push({
                source: { label: p.source },
                target: { label: p.target },
                link: { label: p.link },
                type: "match",
                count: p.count,
              });
          });
          groupCompare.miss.forEach((p) => {
            if (!edgeClasses.includes("miss") && edge.data("type") == "right")
              return;
            if ((p.lid == lid || p.link == link.data('label')) && // matching id or link's label 
              ((edgeData.type == "right" && p.tid == cid) ||
                (edgeData.type == "left" && p.sid == cid))
            )
              this.propositionDialog.propositions.push({
                source: { label: p.source },
                target: { label: p.target },
                link: { label: p.link },
                type: "miss",
                count: p.count,
              });
          });
          groupCompare.excess.forEach((p) => {
            if (!edgeClasses.includes("excess") && edge.data("type") == "right")
              return;
            if (
              p.lid == lid &&
              ((edgeData.type == "right" && p.tid == cid) ||
                (edgeData.type == "left" && p.sid == cid))
            )
              this.propositionDialog.propositions.push({
                source: { label: p.source },
                target: { label: p.target },
                link: { label: p.link },
                type: "excess",
                count: p.count,
              });
          });
          break;
        }
      }

      // console.log(lid, cid, this.propositionDialog.propositions);
      let html = "";
      this.propositionDialog.propositions.forEach((p) => {
        html += '<div class="proposition">';
        html += `<span class="source badge rounded-pill bg-warning text-dark mx-2">${p.source.label}</span>`;
        html += "&mdash;";
        html += `<span class="link badge bg-secondary mx-2">${p.link.label}</span>`;
        html += "&mdash;";
        html += `<span class="target badge rounded-pill bg-warning text-dark mx-2">${p.target.label}</span>`;
        if (p.type) {
          let bg = "bg-secondary";
          switch (p.type) {
            case "excess":
              bg = "bg-info text-dark";
              break;
            case "match":
              bg = "bg-success";
              break;
            case "miss":
              bg = "bg-danger";
              break;
          }
          html += `<span class="target badge rounded-pill ${bg} mx-1">${p.type}</span>`;
        }
        if (p.count) {
          html += `<span class="target badge rounded-pill bg-primary mx-1">${p.count}</span>`;
        }
        html += "</div>";
      });
      $("#proposition-dialog .proposition-list").html(html);
    };

    this.propositionAuthorDialog = UI.modal('#proposition-author-dialog', {
      hideElement: ".bt-close",
      draggable: true,
      dragHandle: ".drag-handle",
    })

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
           + `<code class="bg-danger-subtle rounded mx-2 px-2 text-danger text-nowrap text-truncate">${t.id}</code>`
           + `<span class="badge text-bg-warning">${t.created}</span></span>`
           + `<bi class="bi bi-check-lg text-primary d-none"></bi></span>`;
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
      KitBuild.openConceptMap(openDialog.cmid)
        .then((conceptMap) => {
          // console.log(conceptMap);
          conceptMap = Object.assign(conceptMap, Core.decompress(conceptMap.data));
          conceptMap.cyData = KitBuildUI.composeConceptMap(conceptMap.canvas);
          // console.log(x);
          // conceptMap = Object.assign(conceptMap, App.inst.decodeMap(conceptMap.data, openDialog));
          // console.log(conceptMap);
          this.showConceptMap(conceptMap);
          this.setConceptMap(conceptMap);
          openDialog.hide();
          
          // populate kit list
          App.populateKits(openDialog.cmid);
          App.populateLearnerMaps(openDialog.cmid);

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

    $(".app-navbar .bt-teacher-map").on("click", (e) => {
      // console.log(e)
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
    });

    /**
     *
     * Student Map
     * */

    $(".app-navbar .bt-student-map").on("click", (e) => {
      // console.log(e)
      if (!App.inst.conceptMap) {
        UI.info("Please open a concept map.").show();
        return;
      }
      let lmid = $("#list-learnermap").find(".active").data("lmid");
      if (!lmid) {
        UI.info("Please select a student concept map from the student concept map list.").show();
        return;
      }
      KitBuild.openLearnerMap(lmid).then((learnerMap) => {
        learnerMap = Object.assign(learnerMap, Core.decompress(learnerMap.data));
        learnerMap.canvas.conceptMap = App.inst.conceptMap.canvas;
        let cyData = KitBuildUI.composeLearnerMap(learnerMap.canvas);
        this.canvas.cy.elements().remove();
        this.canvas.cy.add(cyData);
        this.canvas.applyElementStyle();
        this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
        KitBuildUI.showBackgroundImage(this.canvas);
        let camera = this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA);
        if (camera) camera.center(null, { duration: 0 });
        App.canvasState = CanvasState.STUDENT;
      });
    });

    /**
     *
     * Compare Map
     * */

    $(".app-navbar .bt-compare-map").on("click", (e) => {
      // console.log(e)
      if (!App.inst.conceptMap) {
        UI.info("Please open a concept map.").show();
        return;
      }
      let lmid = $("#list-learnermap").find(".active").data("lmid");
      if (!lmid) {
        UI.info(
          "Please select a student concept map from the student concept map list."
        ).show();
        return;
      }
      $("#list-learnermap").find(".active").trigger("click");
    });

    /**
     *
     * Learnermap List
     * */

    $("#list-learnermap").on("click", ".learnermap", (e) => {
      let lmid = $(e.currentTarget).data("lmid").toString();
      let learnerMap = App.inst.learnerMaps.get(lmid);
      learnerMap.map.id = lmid;
      // console.log(App.inst.learnerMaps);
      $("#list-learnermap .learnermap")
        .removeClass("active")
        .filter(`[data-lmid="${learnerMap.map.id}"]`)
        .addClass("active");

      // console.log(App.inst.conceptMap);
      learnerMap.canvas.conceptMap = App.inst.conceptMap.canvas;
      // console.log(learnerMap);
      let cyData = KitBuildUI.composeLearnerMap(learnerMap.canvas);
      this.canvas.cy.elements().remove();
      this.canvas.cy.add(cyData);
      this.canvas.applyElementStyle();
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
      let camera = this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA);
      if (camera) camera.center(this.canvas.cy.elements(), { duration: 0 });

      Analyzer.composePropositions(learnerMap.canvas);
      
      let compare = Analyzer.compare(
        learnerMap.canvas,
        App.inst.conceptMap.map.direction
      );
      // console.log(compare);
      // console.error(compare, this.canvas, learnerMap.conceptMap.map.direction)
      Analyzer.showCompareMap(
        compare,
        this.canvas.cy,
        App.inst.conceptMap.map.direction,
        Analyzer.MATCH | Analyzer.MISS | Analyzer.EXCESS
      );
      KitBuildUI.showBackgroundImage(this.canvas);
      App.updateStatus(learnerMap, compare);

      this.canvas.canvasTool.tools
        .get(KitBuildCanvasTool.FOCUS)
        .changeState("show");
      this.canvas.toolbar.tools.get(KitBuildToolbar.COMPARE).apply();
      this.session.set({ lmid: learnerMap.map.id });

      App.canvasState = CanvasState.COMPARE;
    });

    $(".bt-download-xlsx").on("click", (e) => {
      // console.error(this.learnerMaps);
      UI.confirm('Download selected concept maps score data?').positive(() => {
        
        let checkedMaps = new Set();

        $("#list-learnermap .learnermap").each((i, lm) => {
          let lmid = $(lm).data("lmid");
          let checked = $(`#cb-lm-${lmid}`).prop("checked");
          if (checked) checkedMaps.add(lmid);
        });

        let rows = [];
        for (const [ key, value ] of this.learnerMaps) {
          if (checkedMaps.has(parseInt(key))){
            let unordered = Object.assign({}, value.map, {score: value.score});
            const ordered = Object.keys(unordered).sort().reduce(
              (obj, key) => { 
                obj[key] = unordered[key]; 
                return obj;
              }, 
              {}
            );            
            rows.push(ordered);
          }
        }
        
        /* generate worksheet and workbook */
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Learner Maps");

        /* fix headers */
        XLSX.utils.sheet_add_aoa(worksheet, [["Username", "Name", "DateTime", "Data", "KitID", "LearnerMapID", "Score", "MapType"]], { origin: "A1" });

        /* calculate column width */
        function ln(w, d, min = 10) {
          return Math.max(w, d ? d.toString().length : min, min);
        }
        const mx0 = rows.reduce((w, c) => ln(w, c.author), 10);
        const mx1 = rows.reduce((w, c) => ln(w, c.authorname), 10);
        const mx2 = rows.reduce((w, c) => ln(w, c.create_time), 10);
        const mx3 = rows.reduce((w, c) => ln(w, c.data, 5), 5);
        const mx4 = rows.reduce((w, c) => ln(w, c.kid), 10);
        const mx5 = rows.reduce((w, c) => ln(w, c.lmid, 13), 10);
        const mx6 = rows.reduce((w, c) => ln(w, c.score), 10);
        const mx7 = rows.reduce((w, c) => ln(w, c.type), 10);

        worksheet["!cols"] = [ 
          { wch: mx0 }, { wch: mx1 }, { wch: mx2 }, { wch: mx3 }, 
          { wch: mx4 }, { wch: mx5 }, { wch: mx6 }, { wch: mx7 } ];

        /* create an XLSX file and try to save into xlsx file */
        
        function toIsoString(date) {
          var tzo = -date.getTimezoneOffset(),
              dif = tzo >= 0 ? '+' : '-',
              pad = function(num) {
                  return (num < 10 ? '0' : '') + num;
              };

          return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
        }

        let ts = toIsoString(new Date()).replaceAll(/[\:\-]/ig, '').replace('T', '-').substring(0, 15);
        XLSX.writeFile(workbook, `KB-LearnerMaps-${ts}.xlsx`, { compression: true });
      }).show();
    });      

    $("#cb-lm-score").on("change", (e) => {
      if ($("#cb-lm-score").prop("checked"))
        $("#list-learnermap .score").removeClass("d-none");
      else $("#list-learnermap .score").addClass("d-none");
    });

    $("#cb-lm-feedback").on("change", App.onCheckBoxChanged);
    $("#cb-lm-draft").on("change", App.onCheckBoxChanged);
    $("#cb-lm-final").on("change", App.onCheckBoxChanged);
    $("#cb-lm-first").on("change", App.onCheckBoxChanged);
    $("#cb-lm-last").on("change", App.onCheckBoxChanged);
    $("#cb-lm-auto").on("change", App.onCheckBoxChanged);
    $("#cb-lm-all").on("change", App.onCheckBoxChanged);

    /**
     *
     * Kit List
     * */

    $('#select-kid').on('change', (e) => {
      let index = $(e.currentTarget).prop('selectedIndex');
      let kid = $(e.currentTarget).val();
      // console.log(kid);
      $('#list-learnermap .learnermap').each((i, e) => {
        // console.log(e, $(e), $(e).data('kid'), index, $(e).data('kid') == kid);
        $(e).find('.cb-learnermap').prop('checked', false);
        switch(index) {
          case 0: $(e).removeClass('d-none'); break;
          default: 
            if ($(e).data('kid') == kid) $(e).removeClass('d-none');
            else $(e).addClass('d-none');
        }
      });
      App.onCheckBoxChanged();
    });

    $("#group-map-tools").on("click", ".bt-group-map", (e) => {
      let lmids = [];
      $('#list-learnermap input[type="checkbox"]:checked').each((i, e) => {
        lmids.push($(e).parents(".learnermap").attr("data-lmid"));
      });
      if (
        !App.inst.learnerMaps ||
        App.inst.learnerMaps.size == 0 ||
        lmids.length == 0
      ) {
        UI.info(
          "Please open a concept map and select at least two student maps from the list"
        ).show();
        return;
      }

      let cyData = KitBuildUI.composeConceptMap(
        App.inst.conceptMap.canvas
      );
      this.canvas.cy.elements().remove();
      this.canvas.cy.add(cyData);
      this.canvas.applyElementStyle();
      this.canvas.canvasTool.clearCanvas().clearIndicatorCanvas();
      this.canvas.canvasTool.tools
        .get(KitBuildCanvasTool.FOCUS)
        .changeState("show");

      let learnerMaps = [];
      App.inst.learnerMaps.forEach((lm, k) => {
        lm.canvas.conceptMap = App.inst.conceptMap.canvas;
        // console.log(lm);
        Analyzer.composePropositions(lm.canvas);
        let direction = App.inst.conceptMap.map.direction;
        lm.compare = Analyzer.compare(lm.canvas, direction);
        if (lmids.includes(k)) learnerMaps.push(lm);
      });

      let groupCompare = Analyzer.groupCompare(learnerMaps);
      let mapData = Analyzer.showGroupCompareMap(groupCompare, this.canvas.cy);
      KitBuildUI.showBackgroundImage(this.canvas);
      this.canvas.toolbar.tools.get("compare").apply();

      $("#group-min-val")
        .attr("max", mapData.max)
        .attr("min", mapData.min)
        .val(mapData.min);
      $("#group-max-val")
        .attr("max", mapData.max)
        .attr("min", mapData.min)
        .val(mapData.max);
      $("#group-min-val-label").html(mapData.min);
      $("#group-max-val-label").html(mapData.max);
      $("#min-max-range").html(
        `${$("#group-min-val").val()} ~ ${$("#group-max-val").val()}`
      );

      App.updateStatus(null, groupCompare);
      this.canvas.toolbar.tools
        .get(KitBuildToolbar.CAMERA)
        .center(null, { duration: 0 });
      App.canvasState = CanvasState.GROUPCOMPARE;
    });

    $("#group-min-val").on("change", (e) => {
      let val = $("#group-min-val").val();
      let maxVal = $("#group-max-val").val();
      if (val > maxVal) $("#group-min-val").val(maxVal);
      this.updateRangeInformation();
    });

    $("#group-max-val").on("change", (e) => {
      let val = $("#group-max-val").val();
      let minVal = $("#group-min-val").val();
      if (val < minVal) $("#group-max-val").val(minVal);
      this.updateRangeInformation();
    });

    this.canvas.cy.on("tap", "edge", (e) => {
      if (e.target.hasClass && e.target.hasClass("count")) {
        // console.error("COUNT", e.target.data("count"));
      }
    });
  }

  handleRefresh() {
    

    let session = Core.instance().session();
    let canvas = this.kbui.canvases.get(App.canvasId);
    session.getAll().then((sessions) => {
      // console.log(sessions)
      let cmid = sessions.cmid;
      let lmid = sessions.lmid;
      if (cmid) {
        KitBuild.openConceptMap(cmid).then((conceptMap) => {
          conceptMap = Object.assign(conceptMap, Core.decompress(conceptMap.data));
          canvas.direction = conceptMap.map.direction;
          canvas.cy.elements().remove();
          canvas.cy.add(KitBuildUI.composeConceptMap(conceptMap));
          canvas.applyElementStyle();
          let camera = this.canvas.toolbar.tools.get(KitBuildToolbar.CAMERA);
          if (camera) camera.fit(null, { duration: 0 });
          this.setConceptMap(conceptMap);
          App.populateLearnerMaps(cmid).then(() => {
            if (lmid) {
              let row = $("#list-learnermap")
                .find(`.learnermap[data-lmid="${lmid}"]`)
                .trigger("click");
              if (row.length) row[0].scrollIntoView({ block: "center" });
            }
          });
          App.populateKits(cmid);
        });
      }
    });
  }

  updateRangeInformation() {
    $("#min-max-range").html(
      `${$("#group-min-val").val()} ~ ${$("#group-max-val").val()}`
    );
    let min = $("#group-min-val").val();
    let max = $("#group-max-val").val();
    this.canvas.cy
      .edges(`[count < ${min}],[count > ${max}]`)
      .not('[type="left"]')
      .addClass("hide");
    this.canvas.cy
      .edges(`[count >= ${min}][count <= ${max}]`)
      .removeClass("hide");
  }

  // callback of canvas event
  onCanvasEvent(canvasId, event, data) {
    // console.log("command", event, canvasId, data);
    switch (event) {
      case "proposition-edge-tool-clicked":
        // console.warn(App.canvasState);
        let conceptMap = App.inst.conceptMap;
        switch (App.canvasState) {
          case CanvasState.STUDENT:
          case CanvasState.COMPARE:
          case CanvasState.GROUPCOMPARE: {
            let lmid = $("#list-learnermap").find(".active").data("lmid");
            if (!lmid) break;
            conceptMap = App.inst.learnerMaps.get(
              lmid.toString()
            );
            break;
          }
        }
        App.inst.propositionDialog.listProposition(
          data,
          conceptMap
        );
        App.inst.propositionDialog.show();
        break;
      case "proposition-author-tool-clicked":
        if (!data) return;
        if (App.canvasState != CanvasState.GROUPCOMPARE) {
          UI.info("This feature only works with group maps.").show();
          return;
        }
        // console.log(data, App.inst);
        let edge = App.inst.canvas.cy.edges(`#${data.id}`);
        let learnerMaps = [];
        let lmids = [];
        $('#list-learnermap input[type="checkbox"]:checked').each((i, e) => {
          lmids.push($(e).parents(".learnermap").attr("data-lmid"));
        });
        App.inst.learnerMaps.forEach((lm, i) => {
          if (lmids.includes(i)) learnerMaps.push(lm);
        });
        let groupCompare = Analyzer.groupCompare(learnerMaps);
        let ctype = edge ? edge.data('ctype') : null;
        if (!ctype) return;

        let link = edge.connectedNodes('[type="link"]');
        // let concept = edge.connectedNodes('[type="concept"]');
                
        let gcType = groupCompare[ctype];
        let gclmids = [];
        
        gcType.forEach(gc => {
          // check matching id's
          if (gc.lid == edge.data('source') && gc.tid == edge.data('target')) {
            gclmids = gc.lmids;
            return;
          } else if (gc.link == link.data('label') && gc.tid == edge.data('target')) {
            // if student uses different link node (of same name) than expected
            gclmids = gc.lmids;
            return;
          }
        });

        let authorsMap = [];
        learnerMaps.forEach(lm => {
          if (gclmids.includes(lm.id)) authorsMap.push(lm.map);
        });
        let authorList = "";
        authorsMap.forEach(map => {
          authorList += `<div class="p-1">`;
          authorList += `<span class="pe-2">${map.authorname}</span>`;
          switch(map.type) {
            case 'feedback':
              authorList += `<span class="badge bg-warning text-dark ms-1" title="Feedback: ${map.create_time}">Fb</span>`;
              break;
            case 'draft':
              authorList += `<span class="badge bg-secondary ms-1" title="Draft: ${map.create_time}">D</span>`;
              break;
            case 'final':
              authorList += `<span class="badge bg-primary ms-1" title="Submitted: ${map.create_time}">S</span>`;
              break;
            case 'auto':
              authorList += `<span class="badge bg-secondary ms-1" title="Autosaved: ${map.create_time}">A</span>`;
              break;
          }
          authorList += `<span class="badge bg-warning text-dark ms-1">Map ID: ${map.lmid}</span>`;
          authorList += `</div>`;
          });
        $('#proposition-author-dialog .author-list').html(authorsMap.length == 0 ? '<div><em>No author</em></div>' : authorList);
        App.inst.propositionAuthorDialog.show();
        break;
    }
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

App.canvasId = "analyzer-canvas";
App.canvasState = CanvasState.INIT;

App.populateLearnerMaps = (cmid, kid = null, type = null) => {
  return new Promise((resolve, reject) => {
    $("#list-learnermap").html('<span class="p-2 mt-2 d-block text-center text-primary">Loading...</span>');
    Core.instance()
      .ajax()
      .get(`m/x/kb/analyzerApi/getLearnerMapsOfConceptMap/${cmid}${kid ? "/" + kid : ""}`)
      .then((learnerMaps) => {
        // console.log(learnerMaps);
        learnerMaps = Core.decompress(learnerMaps);
        // console.log(learnerMaps);
        App.inst.learnerMaps = new Map(
          learnerMaps.map((obj) => [obj.id, Core.decompress(obj.data)])
        );
        // console.log(App.inst.conceptMap);
        learnerMaps.map((learnerMap) => {
        //   console.log(learnerMap);
        //   // let lmap = Core.decompress(learnerMap.data);
          Object.assign(learnerMap, Core.decompress(learnerMap.data));
          delete learnerMap.data;
          learnerMap.canvas.conceptMap = App.inst.conceptMap.canvas;
        //   console.log(learnerMap);
          Analyzer.composePropositions(learnerMap.canvas);
          let direction = App.inst.conceptMap.map.direction;
          learnerMap.compare = Analyzer.compare(learnerMap.canvas, direction);
        });
        // console.log(learnerMaps);

        let fbSet = new Set();
        let dSet  = new Set();
        let fxSet = new Set();
        let aSet  = new Set();

        let fbLastMap = new Map();
        let dLastMap = new Map();
        let fxLastMap = new Map();
        let aLastMap = new Map();

        let list = "";
        learnerMaps.forEach((lm, i) => {
          // console.log(lm);
          let isFirst =
            i == 0 || (i > 0 && learnerMaps[i - 1].map.userid != lm.map.userid);
          let isLast =
            (learnerMaps[i + 1] &&
              learnerMaps[i + 1].map.userid != lm.map.userid) ||
            !learnerMaps[i + 1];
          let isTFirst = false;
          let isTLast = false;
          switch (lm.map.type) {
            case "feedback": 
              isTFirst = fbSet.has(lm.map.userid) ? false : true; 
              if (!fbSet.has(lm.map.userid)) fbSet.add(lm.map.userid);
              fbLastMap.set(lm.map.userid, lm.id);
              break;
            case "draft": 
              isTFirst = dSet.has(lm.map.userid) ? false : true; 
              if (!dSet.has(lm.map.userid)) dSet.add(lm.map.userid);
              dLastMap.set(lm.map.userid, lm.id);
              break;
            case "final": 
              isTFirst = fxSet.has(lm.map.userid) ? false : true; 
              if (!fxSet.has(lm.map.userid)) fxSet.add(lm.map.userid);
              fxLastMap.set(lm.map.userid, lm.id);
              break;
            case "auto": 
              isTFirst = aSet.has(lm.map.userid) ? false : true; 
              if (!aSet.has(lm.map.userid)) aSet.add(lm.map.userid);
              aLastMap.set(lm.map.userid, lm.id);
              break;
          }

          let score = ((lm.compare.score * 1000) | 0) / 10 + "%";
          lm.score = ((lm.compare.score * 1000) | 0) / 10;
          list += `<div data-lmid="${lm.id}" data-type="${lm.map.type}" data-kid="${lm.map.kid}" data-first="${isFirst}" data-last="${isLast}"`;
          list += ` data-tfirst="${isTFirst}" data-tlast="${isTLast}"`
          list += ` class="py-1 mx-1 d-flex justify-content-between border-bottom learnermap list-item fs-6" role="button">`;
          list += `<span class="d-flex align-items-center text-truncate">`;
          list += `<input type="checkbox" class="cb-learnermap" id="cb-lm-${lm.id}">`;
          list += `<label class="text-truncate ms-1" title="Author: ${lm.userid}; Map ID: ${lm.id}"><small>${lm.map.userid}</small></label>`;
          list += `</span>`;
          list += `<span class="d-flex align-items-center">`;
          if (lm.map.type == "feedback")
            list += `<span class="badge bg-warning text-dark ms-1" title="Feedback: ${lm.created}">Fb</span>`;
          if (lm.map.type == "draft")
            list += `<span class="badge bg-secondary ms-1" title="Draft: ${lm.created}">D</span>`;
          if (lm.map.type == "final")
            list += `<span class="badge bg-primary ms-1" title="Submitted: ${lm.created}">S</span>`;
          if (lm.map.type == "auto")
            list += `<span class="badge bg-secondary ms-1" title="Autosaved: ${lm.created}">A</span>`;
          if (isFirst)
            list += `<span class="badge bg-secondary ms-1" title="First map: ${lm.created}">1</span>`;
          if (isLast)
            list += `<span class="badge bg-info text-dark ms-1" title="Last map: ${lm.created}">L</span>`;
          list += `<span class="ms-2 score d-none"><small>${score}</small></span>`;
          list += `</span>`;
          list += `</div>`;
        });

        // display the list        
        $("#list-learnermap").html(
          list == ""
            ? '<em class="text-secondary p-2 d-block">No learnermaps.</em>'
            : list
        );

        fbLastMap.forEach((lmid) => $(`#list-learnermap .learnermap[data-lmid="${lmid}"]`).attr('data-tlast', true));
        fxLastMap.forEach((lmid) => $(`#list-learnermap .learnermap[data-lmid="${lmid}"]`).attr('data-tlast', true));
        dLastMap.forEach((lmid) => $(`#list-learnermap .learnermap[data-lmid="${lmid}"]`).attr('data-tlast', true));
        aLastMap.forEach((lmid) => $(`#list-learnermap .learnermap[data-lmid="${lmid}"]`).attr('data-tlast', true));

        App.onCheckBoxChanged();
        resolve();
      });
  }).catch((error) => reject(error));
};

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

App.onCheckBoxChanged = (e) => {
  // console.log(e);
  $("#list-learnermap .learnermap").each((i, lm) => {
    // console.log(lm);
    let lmid = $(lm).data("lmid");
    let type = $(lm).data("type");
    // let first = $(lm).data("first") == true;
    // let last = $(lm).data("last") == true;
    let first = $(lm).data("tfirst") == true;
    let last = $(lm).data("tlast") == true;
    let checked = $(`#cb-lm-${type}`).prop("checked");
    // if (!checked) checked = first == $(`#cb-lm-first`).prop("checked") && first;
    // if (!checked) checked = last == $(`#cb-lm-last`).prop("checked") && last;
    // if (!checked) checked = $(`#cb-lm-all`).prop("checked");
    // console.log(checked);
    if (checked) {
      let f = $(`#cb-lm-first`).prop("checked") && first;
      let l = $(`#cb-lm-last`).prop("checked") && last;
      let a = $(`#cb-lm-all`).prop("checked");
      checked = (f || l || a);
    }
    // console.log(checked);
    // if it is not checked on the filter checkboxes, 
    // then do not show it
    if (checked) $(lm).removeClass("d-none");
    else $(lm).addClass("d-none");

    // if it is not shown, 
    // then do not check the checkboxes
    checked = $(lm).hasClass("d-none") ? false : checked;
    $(`#cb-lm-${lmid}`).prop("checked", checked);
  });
};

App.updateStatus = (learnerMap, compare) => {
  if (learnerMap) {
    let statusLearnerMap =
      `<span class="mx-2 d-flex align-items-center status-learnermap">` +
      `<span class="badge rounded-pill bg-warning text-dark ms-1">ID: ${learnerMap.map.id}</span> ` +
      `<small class="text-secondary text-truncate mx-2">${learnerMap.map.userid}</small>` +
      `</span>`;
    StatusBar.instance().remove(".status-learnermap").append(statusLearnerMap);
  } else StatusBar.instance().remove(".status-learnermap");

  if (compare) {
    let statusCompare =
      `<span class="mx-2 d-flex align-items-center status-compare">` +
      `<span class="badge rounded-pill bg-success ms-1">Match: ${compare.match.length}</span>` +
      `<span class="badge rounded-pill bg-danger ms-1">Miss: ${compare.miss.length}</span>` +
      `<span class="badge rounded-pill bg-info text-dark ms-1">Excess: ${compare.excess.length}</span>` +
      `<span class="badge rounded-pill bg-secondary ms-1">Leave: ${compare.leave.length}</span>` +
      `<span class="badge rounded-pill bg-warning text-dark ms-1">Abandon: ${compare.abandon.length}</span>` +
      `</span>`;
    StatusBar.instance().remove(".status-compare").append(statusCompare);
  } else StatusBar.instance().remove(".status-compare");
};


// App.
