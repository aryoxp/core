class CoreWindow {
  constructor(element, options) {
    this.options = Object.assign({
      draggable: false,
      resizeable: false,
      handle: '.app-card-header',
      closeBtn: '.app-btn-close-dialog',
      positiveBtn: '.app-btn-positive-dialog',
      width: '400px',
      negative: null,
      positive: null,
      backdrop: false,
      isModal: false,
      title: null,
    }, options);
    this.element = element;
    $(element).hide();
    this.position = { x: 0, y: 0 };
    if (this.options.draggable) {            
      interact(element).draggable({
        allowFrom: this.options.handle,
        listeners: {
          start: event => {
            console.log(event.type, event.target)
          },
          move: event => {
            this.position.x += event.dx
            this.position.y += event.dy
            event.target.style.transform =
              `translate(${this.position.x}px, ${this.position.y}px)`
          },
        }
      });
    }
    if (this.options.width) $(element).css('width', this.options.width);
  }

  positive(callback = null) {
    this.options.positive = callback;
    return this;
  }

  negative(callback = null) {
    this.options.negative = callback;
    return this;
  }

  onNegative(e) {
    e.preventDefault();
    e.stopPropagation();
    let continueClose = true;
    if (this.options.negative != null 
      && typeof this.options.negative == "function") {
        let close = this.options.negative();
        if (close == false) continueClose = close;
      }  
    if (continueClose) this.hide()
    return this;
  }

  onPositive(e) {
    e.preventDefault();
    e.stopPropagation();
    let continueClose = true;
    if (this.options.positive != null 
      && typeof this.options.positive == "function") {
        let close = this.options.positive();
        if (close == false) continueClose = close;
      }  
    if (continueClose) this.hide();
    return this;
  }

  onBackdrop(e) {
    this.onNegative(e);
    return this;
  }

  setContent(content) {
    $(this.element).find('.app-card-body').html(content);
    return this;
  }

  attachListener() {
    $(this.element).find(this.options.closeBtn)
      .off('click')
      .on('click', this.onNegative.bind(this));

    $(this.element).find(this.options.positiveBtn)
      .off('click')
      .on('click', this.onPositive.bind(this));
  }

  center() {
    var pw = $(this.element).parent().width();
    var ph = $(this.element).parent().height();
    var w = $(this.element).width();
    var h = $(this.element).height();
    // console.log(pw, ph, w, h);
    this.position.x = (pw-w)/2;
    this.position.y = (ph-h)/2;
    $(this.element).css('transform', `translate(${this.position.x}px,${this.position.y}px)`);
    return this;
  }

  title(title = null) {
    $(this.element).find('.app-card-body h5').remove();
    $(this.element).find('.app-card-body').prepend(`<h5>${title ? title : this.options.title}</h5>`);
    return this; 
  }

  show() {
    $(this.element).detach().appendTo('body').css('position', 'fixed').css('z-index', '2030').css('top', 0).removeClass('d-none');
    this.center();
    if(this.options.backdrop) {
      let backdrop = $('<div class="backdrop position-fixed" style="z-index: 2029; width: 100%; height: 100%; background-color:#0005"></div>').insertBefore(this.element);
      if (!this.options.isModal)
        backdrop.on('click', this.onBackdrop.bind(this));
    }
      
    $(this.element).fadeIn('fast');
    this.attachListener();
    return this;
  }

  hide() {
    $(this.element).fadeOut('fast');
    $('.backdrop').remove();
  }
}

class CoreInfo extends CoreWindow {
  constructor(content = "Hello, world!", options) {
    super('.app-dialog-info', Object.assign({
      backdrop: true,
      title: null
    }, options));
    this.setContent(content);
    if (this.options.title) this.title(this.options.title);
  }
  show() {
    super.show();
    return this;
  }
}

class CoreConfirm extends CoreWindow {
  constructor(content = "Question?", options) {
    super('.app-dialog-confirm', Object.assign({
      isModal: true,
      backdrop: true
    }, options));
    this.setContent(content);
  }
  show() {
    super.show();
    return this;
  }
}

class CoreError extends CoreWindow {
  constructor(content = "Hello, world!", options) {
    super('.app-dialog-info', Object.assign({
      backdrop: true,
      title: '<span class="text-danger">Error</span>'
    }, options));
    this.setContent(content);
    if (this.options.title) this.title(this.options.title);
  }
  show() {
    super.show();
    return this;
  }
}
