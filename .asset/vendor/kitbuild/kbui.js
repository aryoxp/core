class KitBuildCanvas {

  constructor(canvasId, options) {
    this.canvasId = canvasId
    this.settings = Object.assign({
      defaultColor: "#000000",
      defaultConceptColor: "#FFBF40",
      directed: true,
    }, options)

    this.direction = KitBuildCanvas.MULTIDIRECTIONAL

    // Cache for concept and link ID
    this._lastConceptId = 0;
    this._lastLinkId = 0;
    
    // start CytoscapeJS canvas
    this.cy = cytoscape({
      container: document.getElementById(this.canvasId),
      style: KitBuildCanvas.style,
      elements: [], // (this.settings.useDummy ? this._dummyElements : []),
      minZoom: 0.1,
      maxZoom: 6,
      layout: 'fcose'
    });

    // start canvas overlay tool
    this.toolCanvas = KitBuildToolCanvas.instance(this, this.settings);
    this.toolbar = KitBuildToolbar.instance(this, this.settings);

    this.toolCanvas.on('event', this.raiseEvent.bind(this));
    this.toolbar.on('event', this.raiseEvent.bind(this));

    // listeners storage for this canvas' events
    this.evtListeners = new Set();
    
  }

  // Singleton instantiator for each Canvas object
  static instance(canvasId, options) {
    return new KitBuildCanvas(canvasId, options)
  }

  raiseEvent(event, data) { // console.warn(event, data)
    // also behave as listeners for toolbar and toolcanvas
    // forward event to app
    this.evtListeners.forEach(listener => listener(this.canvasId, event, data))
  }

  on(what, listener) {
    switch(what) {
      case 'event':
        if (typeof listener == 'function') {
          this.evtListeners.add(listener)
          // this.toolbar.on(what, listener)
          // this.toolCanvas.on(what, listener)
        }
        break;
    }
    return this;
  }

  off(what, listener) {
    switch(what) {
      case 'event':
        this.evtListeners.delete(listener)
        this.toolbar.off(what, listener)
        this.toolCanvas.off(what, listener)
        break;
    }
    return this;
  }

  addToolbarTool(what, options) {
    let settings = Object.assign({}, this.settings, options)
    switch(what) {
      case KitBuildToolbar.STATE:
        this.toolbar.addTool(what, new CanvasStateTool(this, settings))
        break;
      case KitBuildToolbar.NODE_CREATE:
        this.toolbar.addTool(what, new NodeCreationTool(this, settings))
        break;
      case KitBuildToolbar.UNDO_REDO:
        this.toolbar.addTool(what, new UndoRedoTool(this, settings))
        break;
      case KitBuildToolbar.CAMERA:
        this.toolbar.addTool(what, new CameraTool(this, settings))
        break;
      case KitBuildToolbar.UTILITY:
        this.toolbar.addTool(what, new UtilityTool(this, settings))
        break;
      case KitBuildToolbar.SHARE:
        this.toolbar.addTool(what, new ShareTool(this, settings))
        break;
      case KitBuildToolbar.LAYOUT:
        this.toolbar.addTool(what, new LayoutTool(this, settings))
        break;
      case KitBuildToolbar.COMPARE:
        this.toolbar.addTool(what, new CompareSwitchTool(this, settings))
        break;
    }
    return this;
  }

  addCanvasTool(what, options) {
    let settings = Object.assign({}, this.settings, options)
    switch(what) {
      case KitBuildCanvasTool.DELETE:
        this.toolCanvas.addTool(what, new KitBuildDeleteTool(this), 
          Object.assign({ gridPos: {x: 1, y: -1} }, settings))
        break;
      case KitBuildCanvasTool.DUPLICATE:
        this.toolCanvas.addTool(what, new KitBuildDuplicateTool(this), 
          Object.assign({ gridPos: {x: 1, y: 1} }, settings))
        break;
      case KitBuildCanvasTool.EDIT:
        this.toolCanvas.addTool(what, new KitBuildEditTool(this), 
          Object.assign({ gridPos: {x: -1, y: -1} }, settings))
        break;
      case KitBuildCanvasTool.SWITCH:
        this.toolCanvas.addTool(what, new KitBuildSwitchTool(this), 
          Object.assign({ gridPos: {x: -1, y: 1} }, settings))
        break;
      case KitBuildCanvasTool.DISCONNECT:
        this.toolCanvas.addTool(what, new KitBuildDisconnectTool(this, settings))
        break;
      case KitBuildCanvasTool.CENTROID:
        this.toolCanvas.addTool(what, new KitBuildCentroidTool(this), 
          Object.assign({ gridPos: {x: 0, y: 1} }, settings))
        break;
      case KitBuildCanvasTool.CREATE_CONCEPT:
        this.toolCanvas.addTool(what, new KitBuildCreateConceptTool(this, settings))
        break;  
      case KitBuildCanvasTool.CREATE_LINK:
        this.toolCanvas.addTool(what, new KitBuildCreateLinkTool(this, settings))
        break;
      case KitBuildCanvasTool.FOCUS:
        this.toolCanvas.addTool(what, new KitBuildFocusTool(this, settings))
        break;
      case KitBuildCanvasTool.PROPOSITION:
        this.toolCanvas.addTool(what, new KitBuildPropositionTool(this, settings))
        break;
      case KitBuildCanvasTool.PROPAUTHOR:
        this.toolCanvas.addTool(what, new KitBuildPropositionAuthorTool(this, settings))
        break;
      case KitBuildCanvasTool.LOCK:
        this.toolCanvas.addTool(what, new KitBuildLockTool(this, settings))
        break;
      case KitBuildCanvasTool.UNLOCK:
        this.toolCanvas.addTool(what, new KitBuildUnlockTool(this, settings))
        break;  
      case KitBuildCanvasTool.DISTANCECOLOR:
        this.toolCanvas.addTool(what, new KitBuildDistanceColorTool(this, settings));
        break;
      case KitBuildCanvasTool.DATA:
        this.toolCanvas.addTool(what, new KitBuildDataTool(this, settings));
        break;    
    }
    return this;
  }

  addCanvasMultiTool(what, options) {
    let settings = Object.assign({}, this.settings, options)
    switch(what) {
      case KitBuildCanvasTool.DELETE:
        this.toolCanvas.addMultiTool(what, new KitBuildDeleteTool(this, settings))
        break;
      case KitBuildCanvasTool.DUPLICATE:
        this.toolCanvas.addMultiTool(what, new KitBuildDuplicateTool(this, settings))
        break;
      case KitBuildCanvasTool.LOCK:
        this.toolCanvas.addMultiTool(what, new KitBuildLockTool(this, settings))
        break;
      case KitBuildCanvasTool.UNLOCK:
        this.toolCanvas.addMultiTool(what, new KitBuildUnlockTool(this, settings))
        break;
    }
    return this;
  }

  setOptions(options) {
    this.settings = Object.assign(this.settings, options)
    return this
  }

  reset() {
    this.cy.elements().remove()
    this.toolCanvas.clearCanvas().clearIndicatorCanvas()
    this._lastConceptId = 0;
    this._lastLinkId = 0;
    return this
  }

  // Get next available concept ID
  getNextConceptId() {
    let concepts = this.cy.nodes('[type="concept"]');
    let n = 0;
    for (let i = 0; i < concepts.length; i++) {
      let num = parseInt(concepts[i].id().substring(1));
      if (num > n) n = num;
    }
    this._lastConceptId = n;
    return ++this._lastConceptId;
  }

  // Get next available link ID
  getNextLinkId() {
    let links = this.cy.nodes('[type="link"]');
    let n = 0;
    for (let i = 0; i < links.length; i++) {
      let num = parseInt(links[i].id().substring(1));
      if (num > n) n = num;
    }
    this._lastLinkId = n;
    return ++this._lastLinkId;
  }

  createNode(nodeData, options) {
    
    return new Promise((resolve) => {
      /* nodeData format:
      {
        type: 'concept'|'link',
        label: 'Node label',
        color: '#hex' // optional
        position: { // optional
          x: x,
          y: y,
        }
      }
      */

      // compose the node JSON for Cytoscape canas
      let nodeDefinition = this.toolbar.tools.get(KitBuildToolbar.NODE_CREATE).composeNode(nodeData)

      // console.log(nodeDefinition)

      // add the node at the center of canvas
      let node = this.cy.add(nodeDefinition);
      this.applyElementStyle()

      // let the system place the position
      // so that it does not overlap and resolve it to the caller
      this.cy.elements(':selected').unselect()
      node.position(this.toolbar.tools.get(KitBuildToolbar.NODE_CREATE).placement(node))
        .select().trigger('select')

      // post undo-redo command
      let nodeJson = node.json()
      let undoRedo = this.toolbar.tools.get(KitBuildToolbar.UNDO_REDO) 
      if (undoRedo) 
        undoRedo.post('create-node', {
          undoData: `#${nodeJson.data.id}`,
          redoData: nodeJson,
          undo: () => this.cy.remove(`#${nodeJson.data.id}`),
          redo: () => this.cy.add(nodeJson)
      })
      this.raiseEvent(`create-${node.data('type')}`, nodeJson)
      this.toolCanvas.clearCanvas().clearIndicatorCanvas()
      resolve(node);
    });
    
  }

  updateNode(nodeData, options) {
    
    return new Promise((resolve) => {
      /* nodeData format:
      {
        id: id
        label: 'Node label'
      }
      */

      let updateData = {
        id: nodeData.id,
        prior: this.cy.nodes(`#${nodeData.id}`).json(),
        later: {}
      }

      let dim = this.toolbar.tools.get(KitBuildToolbar.NODE_CREATE)
        .calculateDimension(nodeData) // console.log(nodeData)
      let node = this.cy.nodes(`#${nodeData.id}`).data({
        'label': nodeData.label,
        'width': dim.w | 0,
        'height': dim.h | 0
      })

      updateData.later = node.json()
      let undoRedo = this.toolbar.tools.get(KitBuildToolbar.UNDO_REDO) 
      if (undoRedo) 
        undoRedo.post(`update-${node.data('type')}`, {
        undoData: updateData,
        redoData: updateData,
        undo: (canvas, data) => 
          canvas.cy.nodes(`#${data.id}`).data({
            'label': data.prior.data.label,
            'width': data.prior.data.width | 0,
            'height': data.prior.data.height | 0
          }),
        redo: (canvas, data) =>
          canvas.cy.nodes(`#${data.id}`).data({ 
            'label': data.later.data.label,
            'width': data.later.data.width | 0,
            'height': data.later.data.height | 0
          }),
      })
      this.raiseEvent(`update-${node.data('type')}`, updateData)
      this.toolCanvas.clearCanvas().clearIndicatorCanvas()
      resolve(node)
    });
    
  }

  layout(options, lib = 'fcose') { // console.log('layout')
    let settings = Object.assign({
      name: 'fcose',
      tile: false,
      eles: this.cy.nodes(),
      nodeDimensionsIncludeLabels: true,
      fit: false,
      stop: null
    }, options)
    this.cy.layout(settings).run()
  }

  applyElementStyle() {
    this.cy.nodes('[background-color]').forEach(n => n.css('background-color', n.data('background-color')))
    this.cy.nodes('[color]').forEach(n => n.css('color', n.data('color')))
    if (this.direction == KitBuildCanvas.BIDIRECTIONAL)
      this.cy.edges().addClass('bi')
    return this;
  }

  static getCentroidPosition(concepts) {
    let sX = 0, sY = 0
    concepts.toArray().map(c => {
      sX += c.position().x
      sY += c.position().y
    })
    return {
      x: sX/concepts.length,
      y: sY/concepts.length
    }
  }

  static centroidizeLinkPosition(link) {
    return new Promise((resolve, reject) => {
      let concepts = link.neighborhood('[type="concept"]')
      link.animate({
        position: KitBuildCanvas.getCentroidPosition(concepts),
        duration: 300,
        complete: () => { resolve(link) }
      })
    })
  }




  // Commands
  moveNode(id, x, y, duration) {
    this.cy.elements(`#${id}`).animate({
      position: { x: x, y: y },
      duration: duration,
      complete: () => {
        this.toolCanvas.clearIndicatorCanvas()
        if (this.cy.elements(`#${id}`).selected())
          this.cy.elements(`#${id}`).trigger('select')
      }
    })
  }
  createEdge(data) { // data: {edgeData}
    this.cy.add({ group: "edges", data: data })

    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('id') == data.source) {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
  }
  removeEdge(source, target) { // source,target: id 
    this.cy.edges(`[source="${source}"][target="${target}"]`).remove()

    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('id') == source) {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
  }
  moveEdge(prior, later) { // prior,later: {data: {}}, 
    this.cy.edges(`[source="${prior.data.source}"][target="${prior.data.target}"]`).remove()
    this.cy.add({ group: "edges", data: later.data })

    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('id') == prior.data.source) {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
  }
  switchDirection(priors, laters) {
    if (!Array.isArray(priors)) return;
    if (!Array.isArray(laters)) return;
    priors.forEach(prior => 
      this.cy.edges(`[source="${prior.data.source}"][target="${prior.data.target}"]`).remove())
    laters.forEach(later => 
      this.cy.add({ group: "edges", data: later.data }))
    
    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('id') == prior.data.source) {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
  }
  addNode(data, position) { // data: { nodeData }, position: {x, y}
    this.cy.add({ group: "nodes", data: data, position: position }).unselect()
    this.toolCanvas.clearIndicatorCanvas()
    this.applyElementStyle()
  }
  addElements(elements) { // [ elementsCyData ]
    if (!Array.isArray(elements)) return;
    elements.forEach(element => this.cy.add(element).unselect())
    
    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('type') == 'link') {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
    this.applyElementStyle()
  }
  removeElements(elements) { // [ elementData ]
    if (!Array.isArray(elements)) return;
    elements.forEach(element => {
      if (['left', 'right'].includes(element.type)) {
        this.cy.edges(`[source="${element.source}"][target="${element.target}"]`).remove()
      }
      if (['concept', 'link'].includes(element.type)) {
        this.cy.nodes(`[id="${element.id}"]`).remove()
      }
    })
    
    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('type') == 'link') {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
    this.applyElementStyle()
  }
  updateNodeData(id, data) {
    this.cy.nodes(`#${id}`).data(data);
    this.applyElementStyle()
  }
  updateEdgeData(id, data) {
    let edge = this.cy.edges(`#${id}`).data(data);
    // restore selection of related link
    if (this.toolCanvas.activeNode && this.toolCanvas.activeNode.data('id') == edge.data('source')) {
      let node = this.cy.nodes(`[id="${this.toolCanvas.activeNode.data('id')}"]`)
      if (!node.length) this.toolCanvas.clearCanvas()
      else node.trigger('select')
    }
    this.toolCanvas.clearIndicatorCanvas()
  }
  changeNodesColor(nodesData) { // nodesData: [ id, color, bgColor ]
    if (!Array.isArray(nodesData)) return;
    nodesData.forEach(node => {
      this.cy.nodes(`#${node.id}`).data('color', node.color).css('color', node.color);
      this.cy.nodes(`#${node.id}`).data('background-color', node.bgColor).css('background-color', node.bgColor);
    })
  }
  convertType(type, elements) {
    if (!Array.isArray(elements)) return;
    this.cy.elements('[type="link"],[type="left"],[type="right"]').remove()
    elements.forEach(element => {
      if (['link'].includes(element.data.type)) this.cy.add(element)
    })
    elements.forEach(element => {
      if (['left', 'right'].includes(element.data.type)) {
        let edge = this.cy.add(element)
        if (type == KitBuildCanvas.BIDIRECTIONAL) edge.addClass('bi')
        else edge.removeClass('bi')
      }
    })
    this.toolbar.tools.get(KitBuildToolbar.NODE_CREATE).setActiveDirection(type)
    this.toolCanvas.clearIndicatorCanvas()
  }
  

}

KitBuildCanvas.BIDIRECTIONAL = 'bi'
KitBuildCanvas.UNIDIRECTIONAL = 'uni'
KitBuildCanvas.MULTIDIRECTIONAL = 'multi'

class KitBuildUIDialog {
  constructor(content, canvasId, options) {
    this.settings = Object.assign({
      okLabel: 'OK',
      cancelLabel: 'Cancel',
      canvas: canvasId ? canvasId : KitBuildUI.canvas().canvasId,
      backdrop: true,
      icon: 'info-circle-fill',
      iconColor: 'primary'
    }, options)
    this.positive = null
    this.promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        let cardClass = this.positive
          ? `justify-content-end`
          : `justify-content-center`;
        let cancelButton = this.positive
          ? `<a class="bt-cancel btn btn-secondary" style="min-width: 5rem">${this.settings.cancelLabel}</a>`
          : ``;
        let dialogIcon = `<span class="me-4"><i class="bi bi-${this.settings.icon} display-5 text-${this.settings.iconColor}"></i></span>`
        let backdrop = `<div class="kb-dialog-backdrop w-100 h-100 position-fixed top-0 start-0" style="background-color:#00000088"></div>`
        let dialogHtml = `<div class="card border-secondary kb-dialog shadow" style="min-width: 15rem; max-width: 52rem; position: absolute; top: 0; display: none">
          <div class="card-body text-center scroll-y px-5 py-4 d-flex flex-column align-items-center">
            <div class="d-flex align-items-center">${dialogIcon} <span class="text-start">${content}</span></div>
            <div class="d-flex ${cardClass} align-items-center mt-3">
              ${cancelButton}
              <a class="bt-ok btn btn-primary mx-2" style="min-width: 5rem">${this.settings.okLabel}</a>
            </div>
          </div>
        </div>`
        $('.kb-dialog').hide().remove()
        $('.kb-dialog-backdrop').hide().remove()
        if (this.settings.backdrop) {
          $('body').append(backdrop)
          $('.kb-dialog-backdrop').append(dialogHtml)
        } else $('body').append(dialogHtml)
        
        $('.kb-dialog-backdrop').on('click', (e) => {
          if ($.contains(e.currentTarget, e.target)) return
          if (this.settings.backdrop != 'static') {
            this.close()
            reject(e)
          } else {
            $('.kb-dialog').addClass('animate__animated animate__headShake animate__fast')
            $('.kb-dialog').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", (e) => {
              $(e.target).removeClass('animate__animated animate__headShake')
            });
          }
        })
        $('.kb-dialog').show({
          duration: 0,
          complete: () => { // console.log(settings)
            let parent = $(`#${this.settings.canvas}`)
            let offset = $(parent).offset()
            let child = $('.kb-dialog')
            $('.kb-dialog').css({
              top:  (parent.height()/2 - child.height()/2) + offset.top, 
              left: (parent.width()/2 - child.width()/2) + offset.left
            })
            child.on('click', '.bt-ok', (e) => {
              if (this.positive) resolve(e)
              else this.negative()
              this.close()
            })
            child.on('click', '.bt-cancel', (e) => {
              e.stopImmediatePropagation() // prevent shake
              reject(e)
            })
          }
        })
      }, 50);
    })
  }

  negative() {
    this.close()
  }

  then(callback, reject = null) {
    this.positive = callback
    this.promise.then(callback, reject ? reject : this.negative.bind(this))
    return this
  }
  
  catch(callback) { 
    this.promise.catch(callback)
    return this
  }

  close() { //console.log(this.settings, this)
    $('.kb-dialog').fadeOut({
      duration: 100,
      complete: () => {
        $('.kb-dialog-backdrop').fadeOut({
          duration: 100,
          complete: () => $('.kb-dialog-backdrop').remove()
        })
      }
    })
  }
}

class KitBuildUI {
  constructor(canvasId, options) {
    this.canvases = new Map()
    if (canvasId)
      this.canvases.set(canvasId, KitBuildCanvas.instance(canvasId, options));
    UI.addListener((evt, data) => { // console.error("UI EVENT", evt, data)
      switch(evt) {
        case "window-resize":
        case "sidebar-toggle":
        case "toolbar-render":
          this.canvases.forEach(canvas => {
            // console.error(evt, canvas.cy)
            $(`#${canvasId} > div`).css('height', 0).css('width', 0)
            setTimeout(() => {
              $(`#${canvasId} > div`)
                .css('height', $(`#${canvasId}`).height() | 0)
                .css('width', $(`#${canvasId}`).width() | 0)
            }, 5) 
            // canvas.cy.resize()
            // canvas.cy.forceRender()
          })
          break;
      }
    })    
    // lifecycle.addEventListener('statechange', (event) => {
    //   console.log(event.oldState, event.newState, event.originalEvent, Date.now(), this.canvases);
    // });
  }
  // static addLifeCycleListener(listener) {
  //   if (!lifecycle) {
  //     console.error("Lifecycle library is not defined.")
  //     return
  //   }
  //   lifecycle.addEventListener('statechange', listener)
  // }
  static instance(canvasId, options) {
    if (KitBuildUI.inst) {
      if (!KitBuildUI.inst.canvases.has(canvasId)) 
        KitBuildUI.inst.canvases.set(canvasId, KitBuildCanvas.instance(canvasId, options))
      return KitBuildUI.inst
    } KitBuildUI.inst = new KitBuildUI(canvasId, options)
    return KitBuildUI.inst
  }
  static canvas(canvasId) {
    if (!canvasId && KitBuildUI.inst && KitBuildUI.inst.canvases.size)
      return KitBuildUI.inst.canvases.values().next().value
    return KitBuildUI.inst ? KitBuildUI.inst.canvases.get(canvasId) : null
  }
  static dialog(content = '', canvasId, options) {
    let kitBuildDialog = new KitBuildUIDialog(content, canvasId, options)
    return kitBuildDialog
  }
  static confirm(question, canvasId, options) {
    return KitBuildUI.dialog(question, canvasId, Object.assign({
      okLabel: 'Yes',
      cancelLabel: 'No',
      backdrop: true,
      icon: "question-diamond-fill",
      iconColor: "warning"
    }, options))
  }
  static buildConceptMapData(canvas, conceptMap) {

    if (!canvas) return null;


    let concepts = [], links = [], linktargets = [];
    canvas.cy.nodes('[type="concept"]').forEach(c => {
      let data = Object.assign({}, c.data()) // console.log(data)
      delete data.id
      delete data.label
      data.width = data.width | 0
      data.height = data.height | 0
      let concept = {
        cid: c.id(),
        cmid: null,
        label: c.data('label'),
        x: c.position().x | 0,
        y: c.position().y | 0,
        data: JSON.stringify(data)
      }
      concepts.push(concept) // console.log(concept)
    });
    canvas.cy.nodes('[type="link"]').forEach(l => {
      let data = Object.assign({}, l.data()) // console.log(data)
      delete data.id
      delete data.label
      data.width = data.width | 0
      data.height = data.height | 0
      let sdata = l.connectedEdges(`[type="left"][source="${l.id()}"]`).length ? 
        Object.assign({}, (l.connectedEdges(`[type="left"][source="${l.id()}"]`)[0]).data()) : null
      let scid = sdata ? sdata.target : null
      if (sdata) delete sdata.id
      let link = {
        lid: l.id(),
        cmid: null,
        label: l.data('label'),
        x: l.position().x | 0,
        y: l.position().y | 0,
        data: JSON.stringify(data),
        source_cid: scid,
        source_cmid: null,
        source_data: sdata ? JSON.stringify(sdata) : null,
      }
      links.push(link) // console.log(link)
    });
    canvas.cy.edges('[type="right"]').forEach(e => {
      let tdata = Object.assign({}, e.data()); // console.log(e, tdata)
      let lid = tdata ? tdata.source : null
      let tcid = tdata ? tdata.target : null
      if (tdata) delete tdata.id
      let linktarget = {
        lid: lid,
        cmid: null,
        target_cid: tcid,
        target_cmid: null,
        target_data: tdata ? JSON.stringify(tdata) : null
      }
      linktargets.push(linktarget)
    })

    let elements = {
      concepts: concepts,
      links: links,
      linktargets: linktargets,
      concepts_ext: [],
      links_ext: [],
      linktargets_ext: []
    }

    if (typeof conceptMap == "object") {

      let conceptsMap = new Map(conceptMap.concepts.map(concept => [concept.cid, concept]));
      let linksMap = new Map(conceptMap.links.map(link => [link.lid, link]));  

      let clength = elements.concepts.length;
      while(clength--) {
        let concept = elements.concepts[clength];
        if (!conceptsMap.has(concept.cid)) {
          let cext = elements.concepts.splice(clength, 1)[0]
          elements.concepts_ext.push(cext)
        }
      }
  
      let llength = elements.links.length;
      while(llength--) {
        let link = elements.links[llength];
        if (!linksMap.has(link.lid)) {
          let lext = elements.links.splice(llength, 1)[0]
          elements.links_ext.push(lext)
        }
      }
  
      let ltlength = elements.linktargets.length;
      while(ltlength--) {
        let linktarget = elements.linktargets[ltlength];
        if (!linksMap.has(linktarget.lid) || !conceptsMap.has(linktarget.target_cid)) {
          let ltext = elements.linktargets.splice(ltlength, 1)[0]
          elements.linktargets_ext.push(ltext)
        }
      }
    }
    return elements;
  }
  static composeConceptMap(conceptMapData) {
    if(!conceptMapData.concepts || !conceptMapData.links || !conceptMapData.linktargets)
      throw "Invalid concept map data.";
    try {
      let conceptmap = []
      conceptMapData.concepts.forEach(c => {
        conceptmap.push({
          group: 'nodes',
          position: {x: parseInt(c.x), y: parseInt(c.y)},
          data: Object.assign(JSON.parse(c.data), { 
            id: c.cid,
            label: c.label,
          }),
        })
      })
      conceptMapData.links.forEach(l => {
        conceptmap.push({
          group: 'nodes',
          position: {x: parseInt(l.x), y: parseInt(l.y)},
          data: Object.assign(JSON.parse(l.data), { 
            id: l.lid,
            label: l.label,
          }),
        })
        if (l.source_cid) {
          conceptmap.push({
            group: 'edges',
            data: Object.assign(JSON.parse(l.source_data), { 
              source: l.lid,
              target: l.source_cid,
            }),
          })
        }
      })
      conceptMapData.linktargets.forEach(lt => {
        conceptmap.push({
          group: 'edges',
          data: Object.assign(JSON.parse(lt.target_data), { 
            source: lt.lid,
            target: lt.target_cid,
          }),
        })
      })
      return conceptmap;  
    } catch (error) { throw error }
  }
  static composeKitMap(kitMapData) {
    if(!kitMapData.conceptMap || !kitMapData.concepts 
      || !kitMapData.links || !kitMapData.linktargets)
      throw "Invalid kit data.";
    try {
      let kitMap = [];
      let conceptsMap = new Map();
      let linksMap = new Map();
      for(let c of kitMapData.concepts) conceptsMap.set(c.cid, c);
      for(let l of kitMapData.links) linksMap.set(l.lid, l);
      let getConceptPosition = (cid) => {
        let c = conceptsMap.get(cid);
        return c ? {x: parseInt(c.x), y: parseInt(c.y)} : false;
      }
      let getLinkPosition = (lid) => {
        let l = linksMap.get(lid);
        return l ? {x: parseInt(l.x), y: parseInt(l.y)} : false;
      }
      let getLink = (lid) => {
        let l = linksMap.get(lid);
        return l ? linksMap.get(lid) : false;
      }
      let countLinkTargets = (lid) => {
        let count = 0
        for(let l of kitMapData.conceptMap.linktargets) {
          if (l.lid == lid) count++
        }
        return count;
      }
      for (let c of kitMapData.conceptMap.concepts) {
        if (conceptsMap.get(c.cid) == undefined) break;
        let position = getConceptPosition(c.cid);
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
          data: Object.assign(JSON.parse(c.data), JSON.parse(conceptsMap.get(c.cid).data), { 
            id: c.cid,
            label: c.label,
          }),
          invalid: position === false ? true : undefined
        });
      }
      for (let l of kitMapData.conceptMap.links) {
        if (linksMap.get(l.lid) == undefined) break;
        let position = getLinkPosition(l.lid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
          data: Object.assign(JSON.parse(l.data), JSON.parse(linksMap.get(l.lid).data), { 
            id: l.lid,
            label: l.label,
            limit: countLinkTargets(l.lid)
          }),
          invalid: position === false ? true : undefined
        });
        let link = getLink(l.lid)
        if (link && link.source_cid) {
          kitMap.push({
            group: 'edges',
            data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
              source: link.lid,
              target: link.source_cid,
            }),
          })
        }
      }
      kitMapData.linktargets.forEach(lt => {
        kitMap.push({
          group: 'edges',
          data: Object.assign(JSON.parse(lt.target_data), { 
            source: lt.lid,
            target: lt.target_cid,
          }),
        })
      });
      return kitMap;  
    } catch (error) { throw error }
  }
  static composeExtendedKitMap(kitMapData, kitSet, order = 1) {
    if(!kitMapData.conceptMap || !kitMapData.concepts 
      || !kitMapData.links || !kitMapData.linktargets)
      throw "Invalid kit data.";
    if (!kitSet) throw "Invalid kit set data.";
    try {
      // console.log(kitSet);
      let kitMap = [];
      let setids = [];
      
      let conceptsMap = new Map();
      let linksMap = new Map();
      for(let c of kitMapData.concepts) conceptsMap.set(c.cid, c);
      for(let l of kitMapData.links) linksMap.set(l.lid, l);

      kitSet.sets.forEach(set => {
        if (parseInt(set.order) <= order) setids.push(set.setid);
      })

      let getConceptPosition = (cid) => {
        let c = conceptsMap.get(cid);
        return c ? {x: parseInt(c.x), y: parseInt(c.y)} : false;
      }
      let getLinkPosition = (lid) => {
        let l = linksMap.get(lid);
        return l ? {x: parseInt(l.x), y: parseInt(l.y)} : false;
      }
      let getLink = (lid) => {
        let l = linksMap.get(lid);
        return l ? linksMap.get(lid) : false;
      }
      let countLinkTargets = (lid) => {
        let count = 0
        for(let l of kitMapData.conceptMap.linktargets) {
          if (l.lid == lid) count++
        }
        return count;
      }
      
      kitMapData.conceptMap.concepts.forEach(c => {
        let included = false;
        for (let concept of kitSet.concepts) {
          if (setids.includes(concept.setid) && c.cid == concept.cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        let position = getConceptPosition(c.cid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
          data: Object.assign(JSON.parse(c.data), JSON.parse(conceptsMap.get(c.cid).data), { 
            id: c.cid,
            label: c.label,
          }),
          invalid: position === false ? true : undefined
        })
      })
      kitMapData.conceptMap.links.forEach(l => {
        let included = false;
        for (let link of kitSet.links) {
          if (setids.includes(link.setid) && l.lid == link.lid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        let position = getLinkPosition(l.lid);
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
          data: Object.assign(JSON.parse(l.data), JSON.parse(linksMap.get(l.lid).data), { 
            id: l.lid,
            label: l.label,
            limit: countLinkTargets(l.lid)
          }),
          invalid: position === false ? true : undefined
        })
        let link = getLink(l.lid)
        included = false;
        for (let edge of kitSet.sourceEdges) {
          if (setids.includes(edge.setid) && 
            edge.lid == link.lid && 
            edge.source_cid == link.source_cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        if (link && link.source_cid) {
          kitMap.push({
            group: 'edges',
            data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
              source: link.lid,
              target: link.source_cid,
            }),
          })
        }
      })
      kitMapData.linktargets.forEach(lt => {
        let included = false;
        for (let edge of kitSet.sourceEdges) {
          if (setids.includes(edge.setid) && 
            edge.lid == lt.lid && 
            edge.target_cid == lt.target_cid) {
              included = true;
              break;
          };
        }
        if (!included) return;
        kitMap.push({
          group: 'edges',
          data: Object.assign(JSON.parse(lt.target_data), { 
            source: lt.lid,
            target: lt.target_cid,
          }),
        })
      })
      return kitMap;  
    } catch (error) { throw error }
  }
  static composeExtendedKitSet(kitMapData, kitSet, order = 1) {
    if(!kitMapData.conceptMap || !kitMapData.concepts 
      || !kitMapData.links || !kitMapData.linktargets)
      throw "Invalid kit data.";
    if (!kitSet) throw "Invalid kit set data.";
    try {
      // console.log(kitSet);
      let kitMap = [];
      let setids = [];

      let conceptsMap = new Map();
      let linksMap = new Map();
      for(let c of kitMapData.concepts) conceptsMap.set(c.cid, c);
      for(let l of kitMapData.links) linksMap.set(l.lid, l);

      for (let set of kitSet.sets) {
        if (parseInt(set.order) == order) {
          setids.push(set.setid);
          break;
        }
      }
      let getConceptPosition = (cid) => {
        let c = conceptsMap.get(cid);
        return c ? {x: parseInt(c.x), y: parseInt(c.y)} : false;
      }
      let getLinkPosition = (lid) => {
        let l = linksMap.get(lid);
        return l ? {x: parseInt(l.x), y: parseInt(l.y)} : false;
      }
      let getLink = (lid) => {
        let l = linksMap.get(lid);
        return l ? linksMap.get(lid) : false;
      }
      let countLinkTargets = (lid) => {
        let count = 0
        for(let l of kitMapData.conceptMap.linktargets) {
          if (l.lid == lid) count++
        }
        return count;
      }
      
      kitMapData.conceptMap.concepts.forEach(c => {
        let included = false;
        for (let concept of kitSet.concepts) {
          if (setids.includes(concept.setid) && c.cid == concept.cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        let position = getConceptPosition(c.cid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
          data: Object.assign(JSON.parse(c.data), JSON.parse(conceptsMap.get(c.cid).data), { 
            id: c.cid,
            label: c.label,
          }),
          invalid: position === false ? true : undefined
        })
      })
      kitMapData.conceptMap.links.forEach(l => {
        let included = false;
        for (let link of kitSet.links) {
          if (setids.includes(link.setid) && l.lid == link.lid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        let position = getLinkPosition(l.lid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
          data: Object.assign(JSON.parse(l.data), JSON.parse(linksMap.get(l.lid).data), { 
            id: l.lid,
            label: l.label,
            limit: countLinkTargets(l.lid)
          }),
          invalid: position === false ? true : undefined
        })
        let link = getLink(l.lid)
        included = false;
        for (let edge of kitSet.sourceEdges) {
          if (setids.includes(edge.setid) && 
            edge.lid == link.lid && 
            edge.source_cid == link.source_cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        if (link && link.source_cid) {
          kitMap.push({
            group: 'edges',
            data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
              source: link.lid,
              target: link.source_cid,
            }),
          })
        }
      })
      kitMapData.linktargets.forEach(lt => {
        let included = false;
        for (let edge of kitSet.sourceEdges) {
          if (setids.includes(edge.setid) && 
            edge.lid == lt.lid && 
            edge.target_cid == lt.target_cid) {
              included = true;
              break;
          };
        }
        if (!included) return;
        kitMap.push({
          group: 'edges',
          data: Object.assign(JSON.parse(lt.target_data), { 
            source: lt.lid,
            target: lt.target_cid,
          }),
        })
      })
      return kitMap;  
    } catch (error) { throw error }
  }
  static composeLearnerMap(learnerMapData) {
    if(!learnerMapData.conceptMap || !learnerMapData.concepts 
      || !learnerMapData.links || !learnerMapData.linktargets)
      throw "Invalid kit data.";
    try {
      let cids = new Set();
      let lids = new Set();
      for(let c of learnerMapData.conceptMap.concepts) cids.add(c.cid);
      for(let l of learnerMapData.conceptMap.links) lids.add(l.lid);

      let kitMap = []
      let getConceptPosition = (cid) => {
        for(let c of learnerMapData.concepts) {
          if (c.cid == cid) return {x: parseInt(c.x), y: parseInt(c.y)};
        }
        if (learnerMapData.concepts_ext) {
          for(let c of learnerMapData.concepts_ext) {
            if (c.cid == cid) return {x: parseInt(c.x), y: parseInt(c.y)};
          }
        }
        return false;
      }
      let getLinkPosition = (lid) => {
        for(let l of learnerMapData.links) {
          if (l.lid == lid) return {x: parseInt(l.x), y: parseInt(l.y)};
        }
        if (learnerMapData.links_ext) {
          for(let l of learnerMapData.links_ext) {
            if (l.lid == lid) return {x: parseInt(l.x), y: parseInt(l.y)};
          }
        }
        return false;
      }
      let getLink = (lid) => {
        for(let l of learnerMapData.links) {
          if (l.lid == lid) return l
        }
        if (learnerMapData.links_ext) {
          for(let l of learnerMapData.links_ext) {
            if (l.lid == lid) return l
          }
        }
        return false;
      }
      let countLinkTargets = (lid) => {
        let count = 0
        for(let l of learnerMapData.conceptMap.linktargets) {
          if (l.lid == lid) count++
        }
        return count;
      }

      // console.error(learnerMapData)
      learnerMapData.conceptMap.concepts.forEach(c => {
        let position = getConceptPosition(c.cid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
          data: Object.assign(JSON.parse(c.data), { 
            id: c.cid,
            label: c.label,
          }),
          invalid: position === false ? true : undefined
        })
      })
      if (learnerMapData.concepts_ext) {
        learnerMapData.concepts_ext.forEach(c => {
          let position = getConceptPosition(c.cid);
          cids.add(c.cid);
          kitMap.push({
            group: 'nodes',
            position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
            data: Object.assign(JSON.parse(c.data), { 
              id: c.cid,
              label: c.label,
              extension: true
            }),
            invalid: position === false ? true : undefined
          })
        })
      }

      learnerMapData.conceptMap.links.forEach(l => {
        let position = getLinkPosition(l.lid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
          data: Object.assign(JSON.parse(l.data), { 
            id: l.lid,
            label: l.label,
            limit: countLinkTargets(l.lid)
          }),
          invalid: position === false ? true : undefined
        })
      });
      if (learnerMapData.links_ext) {
        learnerMapData.links_ext.forEach(l => {
          let position = getLinkPosition(l.lid);
          lids.add(l.lid);
          kitMap.push({
            group: 'nodes',
            position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
            data: Object.assign(JSON.parse(l.data), { 
              id: l.lid,
              label: l.label,
              limit: 9,
              extension: true
            }),
            invalid: position === false ? true : undefined
          })
        });
      }

      learnerMapData.conceptMap.links.forEach(l => {
        let link = getLink(l.lid)
        if (link && link.source_cid) {
          if (lids.has(link.lid) && cids.has(link.source_cid))
          kitMap.push({
            group: 'edges',
            data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
              source: link.lid,
              target: link.source_cid,
            }),
          })
        }
      });

      if (learnerMapData.links_ext) {
        learnerMapData.links_ext.forEach(l => {
          let link = getLink(l.lid)
          if (link && link.source_cid) {
            if (lids.has(link.lid) && cids.has(link.source_cid))
            kitMap.push({
              group: 'edges',
              data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
                source: link.lid,
                target: link.source_cid,
              }),
            })
          }
        });
      }

      learnerMapData.linktargets.forEach(lt => {
        if (lids.has(lt.lid) && cids.has(lt.target_cid))
        kitMap.push({
          group: 'edges',
          data: Object.assign(JSON.parse(lt.target_data), { 
            source: lt.lid,
            target: lt.target_cid,
          }),
        })
      })

      if (learnerMapData.linktargets_ext) {
        learnerMapData.linktargets_ext.forEach(lt => {
          if (lids.has(lt.lid) && cids.has(lt.target_cid))
          kitMap.push({
            group: 'edges',
            data: Object.assign(JSON.parse(lt.target_data), { 
              source: lt.lid,
              target: lt.target_cid,
            }),
          })
        })
      }
      return kitMap;  
    } catch (error) { throw error }
  }
  static composeExtendedLearnerMap(learnerMapData, kitSet, order = 1) {
    if(!learnerMapData.conceptMap || !learnerMapData.concepts 
      || !learnerMapData.links || !learnerMapData.linktargets)
      throw "Invalid kit data.";
    if (!kitSet) throw "Invalid kit set data.";
    try {
      // console.log(learnerMapData);
      let kitMap = [];
      let setids = [];
      kitSet.sets.forEach(set => {
        if (parseInt(set.order) <= order) setids.push(set.setid);
      })
      let getConceptPosition = (cid) => {
        for(let c of learnerMapData.concepts) {
          if (c.cid == cid) return {x: parseInt(c.x), y: parseInt(c.y)};
        }
        if (learnerMapData.concepts_ext) {
          for(let c of learnerMapData.concepts_ext) {
            if (c.cid == cid) return {x: parseInt(c.x), y: parseInt(c.y)};
          }
        }
        return false;
      }
      let getLinkPosition = (lid) => {
        for(let l of learnerMapData.links) {
          if (l.lid == lid) return {x: parseInt(l.x), y: parseInt(l.y)};
        }
        if (learnerMapData.links_ext) {
          for(let l of learnerMapData.links_ext) {
            if (l.lid == lid) return {x: parseInt(l.x), y: parseInt(l.y)};
          }
        }
        return false;
      }
      let getLink = (lid) => {
        for(let l of learnerMapData.links) {
          if (l.lid == lid) return l
        }
        if (learnerMapData.links_ext) {
          for(let l of learnerMapData.links_ext) {
            if (l.lid == lid) return l
          }
        }
        return false;
      }
      let countLinkTargets = (lid) => {
        let count = 0
        for(let l of learnerMapData.conceptMap.linktargets) {
          if (l.lid == lid) count++
        }
        return count;
      }

      // console.error(learnerMapData)
      learnerMapData.conceptMap.concepts.forEach(c => {
        let included = false;
        for (let concept of kitSet.concepts) {
          if (setids.includes(concept.setid) && c.cid == concept.cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        let position = getConceptPosition(c.cid)
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
          data: Object.assign(JSON.parse(c.data), { 
            id: c.cid,
            label: c.label,
          }),
          invalid: position === false ? true : undefined
        })
      })
      if (learnerMapData.concepts_ext) {
        learnerMapData.concepts_ext.forEach(c => {
          let position = getConceptPosition(c.cid)
          kitMap.push({
            group: 'nodes',
            position: position === false ? {x: parseInt(c.x), y: parseInt(c.y)} : position,
            data: Object.assign(JSON.parse(c.data), { 
              id: c.cid,
              label: c.label,
              extension: true
            }),
            invalid: position === false ? true : undefined
          })
        })
      }

      learnerMapData.conceptMap.links.forEach(l => {
        let included = false;
        for (let link of kitSet.links) {
          if (setids.includes(link.setid) && l.lid == link.lid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        let position = getLinkPosition(l.lid);
        kitMap.push({
          group: 'nodes',
          position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
          data: Object.assign(JSON.parse(l.data), { 
            id: l.lid,
            label: l.label,
            limit: countLinkTargets(l.lid)
          }),
          invalid: position === false ? true : undefined
        })
      });

      if (learnerMapData.links_ext) {
        learnerMapData.links_ext.forEach(l => {
          let position = getLinkPosition(l.lid)
          kitMap.push({
            group: 'nodes',
            position: position === false ? {x: parseInt(l.x), y: parseInt(l.y)} : position,
            data: Object.assign(JSON.parse(l.data), { 
              id: l.lid,
              label: l.label,
              limit: 9,
              extension: true
            }),
            invalid: position === false ? true : undefined
          })
        });
      }

      learnerMapData.conceptMap.links.forEach(l => {
        let link = getLink(l.lid)
        let included = false;
        for (let concept of kitSet.concepts) {
          if (setids.includes(concept.setid) && link.source_cid == concept.cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        included = false;
        for (let lk of kitSet.links) {
          if (setids.includes(lk.setid) && lk.lid == link.lid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        if (link && link.source_cid) {
          kitMap.push({
            group: 'edges',
            data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
              source: link.lid,
              target: link.source_cid,
            }),
          })
        }
      });

      if (learnerMapData.links_ext) {
        learnerMapData.links_ext.forEach(l => {
          let link = getLink(l.lid)
          if (link && link.source_cid) {
            kitMap.push({
              group: 'edges',
              data: Object.assign(link.source_data ? JSON.parse(link.source_data) : {}, { 
                source: link.lid,
                target: link.source_cid,
              }),
            })
          }
        });
      }
      learnerMapData.linktargets.forEach(lt => {
        let included = false;
        for (let concept of kitSet.concepts) {
          if (setids.includes(concept.setid) && lt.target_cid == concept.cid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        included = false;
        for (let lk of kitSet.links) {
          if (setids.includes(lk.setid) && lk.lid == lt.lid) {
            included = true;
            break;
          };
        }
        if (!included) return;
        kitMap.push({
          group: 'edges',
          data: Object.assign(JSON.parse(lt.target_data), { 
            source: lt.lid,
            target: lt.target_cid,
          }),
        })
      })

      if (learnerMapData.linktargets_ext) {
        learnerMapData.linktargets_ext.forEach(lt => {
          kitMap.push({
            group: 'edges',
            data: Object.assign(JSON.parse(lt.target_data), { 
              source: lt.lid,
              target: lt.target_cid,
            }),
          })
        })
      }
      return kitMap;  
    } catch (error) { throw error }
  }
  static showBackgroundImage(canvas) {
    canvas.cy.nodes().forEach(n => {
      let base64 = n.data('image');
      if(base64)
        KitBuildUI.showNodeBackgroundImage(n, base64);
    });
  }
  static showNodeBackgroundImage(n, base64) {
    n.style('background-image', `url("data:image/png;base64,${base64}")`);
    n.style('background-fit', `cover`);
    n.style('background-color', `rgba(255,255,255,0)`);
    n.style('text-valign', `bottom`);
    n.style('text-margin-y', `10px`);
    n.style('text-background-color', `#FFF`);
    n.data('image', base64);
  }

  static removeNodeBackgroundImage(n, canvas) {
    if (!canvas) return;
    let no = Object.assign({
      id: 0,
      label: n.data('label'),
      type: n.data('type')
    });
    canvas.createNode(no).then(node => {
      // console.log(node.data());
      n.data('width', node.data('width'));
      n.data('height', node.data('height'));
      canvas.cy.remove(`#${node.id()}`);
    });
    n.style('background-image', `none`);
    n.style('background-fit', `none`);
    n.style('text-valign', `center`);
    n.style('text-margin-y', `0px`);
    n.removeData('image');
  }

}
