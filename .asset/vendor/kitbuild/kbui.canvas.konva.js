class KitBuildCanvasKonva {

  constructor(id) {
    this.listeners = [];
    var stage = new Konva.Stage({
      container: `kb-${id}-canvas-konva`,
      width: $(`#${id}`).width(),
      height: $(`#${id}`).height(),
    });
    this.stage = stage;
  
    var layer = new Konva.Layer();
    stage.add(layer);
    this.layer = layer;
  
    var rect = new Konva.Rect({
      x: 60,
      y: 60,
      width: 100,
      height: 90,
      fill: 'rgba(0,0,0,0.05)',
      name: 'rect',
      draggable: false,
      visible: false
    });
    layer.add(rect);
    this.rect = rect;
  
    var tr = new Konva.Transformer({
      rotateEnabled: false,
      boundBoxFunc: function (oldBoundBox, newBoundBox) {
        if (newBoundBox.width < 50 || newBoundBox.height < 50) {
          return oldBoundBox;
        }
        return newBoundBox;
      },
    });
    layer.add(tr);
    this.tr = tr;
  
    stage.on('mousedown touchstart', (e) => { // console.log(e.target)
      // do nothing if we mousedown on any shape
      if (e.target !== stage) {
        e.evt.cancelBubble = true;
        e.evt.preventDefault();
        return;
      }
      e.evt.preventDefault();
    });
  
    stage.on('mousemove touchmove', (e) => {
      // do nothing if we didn't start selection
      if (!rect.visible()) {
        return;
      }
      e.evt.preventDefault();
    });
  
    stage.on('mouseup touchend', (e) => { // console.log('up-end');
      // do nothing if we didn't start selection
      if (!rect.visible()) {
        return;
      }
      e.evt.preventDefault();
    });
  
    // clicks should select/deselect shapes
    stage.on('click tap', (e) => { // console.log('click-tap');
      this.hide();
      tr.nodes([]);
    });

    rect.on('transformend', (e) => {
      rect.setAttrs({
        width: Math.abs(rect.width()*rect.scaleX()),
        height: Math.abs(rect.height()*rect.scaleY()),
        scaleX: 1,
        scaleY: 1
      });
      // console.log(rect);
      this.listeners.forEach(listener => {
        if (listener && typeof listener.onResizeEnd == 'function')
          listener.onResizeEnd(
            parseInt(rect.attrs.x), 
            parseInt(rect.attrs.y), 
            parseInt(rect.width()), 
            parseInt(rect.height())
          );
      });
      console.warn('transform-end');
    });

  }

  show(x, y, w, h) {
    this.rect.setAttrs({
      x: x-(w/2), y: y-(h/2), width: w, height: h, scaleX: 1, scaleY: 1
    });
    this.rect.show();
    this.tr.nodes([this.rect]);
  }

  hide() {
    this.rect.hide();
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

}

class ResizeTool extends KitBuildCanvasTool {

  constructor(canvas, options) {
    super(
      canvas,
      Object.assign(
        {
          showOn: KitBuildCanvasTool.SH_CONCEPT,
          color: "#5069c7",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bezier" viewBox="-4 -4 24 24"><path d="M5 2V0H0v5h2v6H0v5h5v-2h6v2h5v-5h-2V5h2V0h-5v2H5zm6 1v2h2v6h-2v2H5v-2H3V5h2V3h6zm1-2h3v3h-3V1zm3 11v3h-3v-3h3zM4 15H1v-3h3v3zM1 4V1h3v3H1z"/></svg>',
          gridPos: { x: 0, y: 1 },
        },
        options
      )
    );
  }

  action(event, e, nodes) {
    // console.error(event, e, nodes);
    let w = nodes[0].renderedOuterWidth();
    let h = nodes[0].renderedOuterHeight();
    let x = nodes[0].renderedPosition().x;
    let y = nodes[0].renderedPosition().y;
    KitBuildCanvasKonva.instance.show(x, y, w, h);
    this.node = nodes[0];
    return;
  }

  onResizeEnd(x, y, w, h) {
    let width = parseInt((w / this.canvas.cy.zoom()) - 45);
    let height = parseInt((h / this.canvas.cy.zoom()) - 45);
    this.node.data('width', width > 20 ? width : 20);
    this.node.data('height', height > 20 ? height : 20);
    // console.log(x, y, w, h, width, height);
    this.node.renderedPosition({x: x + parseInt(w/2), y: y + parseInt(h/2)});
  }

}