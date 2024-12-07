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
    let type = this.constructor.name;
    let el = $(this.element).find('.app-card-body').html(content);
    if (type == 'CoreInfo') el.addClass('text-center');
    else el.removeClass('text-center');
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

class CoreLoading {
  constructor(content, opts) {
    this.settings = Object.assign({}, Loading.default, opts)
    this.content = content;
  }
  static instance(content, opts) {
    return new Loading(content, opts)
  }
  static load(element, content, options) {
    let settings = Object.assign({
      loadingContent: content ?? 'Loading...',
      disable: true,
      target: false,
      addSpinner: true
    }, options);
    let html = (settings.target) ? $(element).find(settings.target).html() : $(element).html();
    settings.loadingContent = `<div class="d-flex align-items-center"><div class="spinner-border spinner-border-sm me-2" role="status"></div> ${settings.loadingContent}</div>`;
    if (settings.target) 
      $(element).find(settings.target).html(settings.loadingContent);
    else $(element).html(settings.loadingContent);
    $(element).attr('disabled', true).prop('disabled', true).addClass('disabled');
    return html;
  }
  static done(element, content, options) {
    let settings = Object.assign({
      doneContent: content ?? 'OK',
      target: false
    }, options);
    if (settings.target) 
      $(element).find(settings.target).html(settings.doneContent);
    else $(element).html(settings.doneContent);
    $(element).attr('disabled', false).prop('disabled', false).removeClass('disabled');
  }
  show(opts) {
    let content = this.content
    this.settings = Object.assign(this.settings, opts)
    if (content) $('#modal-loading .loading-text').html(content)
    if (this.settings.width) $('#modal-loading .modal-dialog').css('max-width', this.settings.width)
    if (!$('#modal-loading .animation').html()) {
      let dotSvgs = '', dots = ['primary', 'danger', 'warning', 'success', 'secondary']
      for(let d of dots) {
        dotSvgs += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-fill text-${d}" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>`
      }
      $('#modal-loading .animation').html(dotSvgs)
    }
    Loading.modal = new bootstrap.Modal($('#modal-loading'), this.settings)
    Loading.modal.show()
    function rand() {
      if (!Loading.modal._isShown && !Loading.modal._isTransitioning) return
      let pos = []
      return anime({
        targets: '#modal-loading svg',
        translateY: content ? 0 : 3,
        scale: 1.5,
        translateX: function() {
          let p
          do {
            p = ((anime.random(-2, 2)) * 16) - 6
          } while (pos.includes(p))
          pos.push(p)
          return p;
        },
        delay: 100,
        rotate: anime.stagger(anime.random(-3, 3) * 15),
        easing: 'easeInOutQuad',
        duration: 400,
        complete: rand
      })
    }
    rand()
    return Loading.modal
  }
  hide() {
    if (Loading.modal) Loading.modal.hide()
  }
}

class CUI {
  static confirm(content, options) {
    return new CoreConfirm(content, options);
  }
  static info(content, options) {
    return new CoreInfo(content, options);
  }
  static error(content, options) {
    return new CoreError(content, options);
  }
  static load(el, content, options) {
    return CoreLoading.load(el, content, options);
  }
  static done(el, content, options) {
    return CoreLoading.done(el, content, options);
  }
}
