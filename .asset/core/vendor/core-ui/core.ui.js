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

class CoreSuccess extends CoreWindow {
  constructor(content = "Hello, world!", options) {
    super('.app-dialog-info', Object.assign({
      backdrop: true,
      title: '<span class="text-success">Success</span>'
    }, options));
    this.setContent(content);
    if (this.options.title) this.title(this.options.title);
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

class CorePagination {
  constructor (containerElement, count = 1, perpage = 5) {
    this.containerElement = containerElement
    this.pagination = {
      page: 1,
      maxpage: Math.ceil(count/perpage),
      perpage: perpage,
      count: count,
    }
  }
  static instance(containerElement, count, perpage) {
    return new CorePagination(containerElement, count, perpage);
  }
  set page(p) {
    this.pagination.page = parseInt(p);
  }
  set perpage(p) {
    this.pagination.perpage = parseInt(p);
  }
  set count(c) {
    this.pagination.count = parseInt(c);
  }
  get page() {
    return this.pagination.page;
  }
  get perpage() {
    return this.pagination.perpage
  }
  get count() {
    return this.pagination.count;
  }
  listen(formElement) {
    this.formElement = formElement;
    $(this.containerElement).off('click', '.pagination-next').on('click', '.pagination-next', (e) => {
      // console.log(this.pagination.page, this.pagination.maxpage)
      if (this.pagination.page < this.pagination.maxpage) {
        this.pagination.page++
        $(formElement).trigger('submit')
        // console.log(this.pagination.page, this.pagination.maxpage)
        this.update()
      }
      e.preventDefault();
    })

    $(this.containerElement).off('click', '.pagination-prev').on('click', '.pagination-prev', (e) => {
      e.preventDefault();
      if (this.pagination.page > 1) {
        this.pagination.page--
        $(formElement).trigger('submit')
        this.update()
      }
    })

    $(this.containerElement).off('click', '.pagination-page').on('click', '.pagination-page', (e) => {
      e.preventDefault();
      this.pagination.page = parseInt($(e.currentTarget).attr('data-page'))
      $(formElement).trigger('submit')
      this.update()
    })
    return this;
  }
  callback(callback) {
    $(this.containerElement).off('click', '.pagination-next').on('click', '.pagination-next', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.pagination.page < this.pagination.maxpage) {
        this.pagination.page++;
        if (typeof callback == "function")
          callback(this.pagination.page, this.pagination.perpage);
        this.update();
      }
    })

    $(this.containerElement).off('click', '.pagination-prev').on('click', '.pagination-prev', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.pagination.page > 1) {
        this.pagination.page--
        if (typeof callback == "function")
          callback(this.pagination.page, this.pagination.perpage);
        this.update()
      }
    })

    $(this.containerElement).off('click', '.pagination-page').on('click', '.pagination-page', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.pagination.page = parseInt($(e.currentTarget).attr('data-page'))
      if (typeof callback == "function")
        callback(this.pagination.page, this.pagination.perpage);
      this.update()
    });
    return this;
  }
  update(count = null, perpage = null) { // console.warn(this.pagination)
    if (count !== null) this.pagination.count = parseInt(count);
    if (perpage !== null) this.pagination.perpage = parseInt(perpage);

    count   = parseInt(count);
    perpage = parseInt(perpage);

    let paginationHtml = '';
    let page = this.pagination.page;
    let maxpage = count == 0 ? 1 : Math.ceil(this.pagination.count/this.pagination.perpage);
    if (page > maxpage) {
      page = maxpage;
      return this;
    }
    this.pagination.page = page;
    this.pagination.maxpage = maxpage;    
    
    if (this.pagination.count) {
      paginationHtml += `<li class="page-item${page == 1 ? ' disabled': ''}">`
      paginationHtml += `  <a class="page-link pagination-prev" href="#" tabindex="-1" aria-disabled="true"> <i class="bi bi-chevron-left"></i> Prev</a>`
      paginationHtml += `</li>`
      let min = page - 2 < 1 ? 1 : page - 2
      let max = page + 2 > maxpage ? maxpage : page + 2
      for(let p = min; p <= max; p++) {
        paginationHtml += `<li class="page-item${page == p ? ' disabled': ''}"><a class="page-link pagination-page" data-page="${p}" href="#">${p}</a></li>`
      }
      paginationHtml += `<li class="page-item${page == maxpage ? ' disabled': ''}">`
      paginationHtml += `  <a class="page-link pagination-next" href="#">Next <i class="bi bi-chevron-right"></i></a>`
      paginationHtml += `</li>`
      $(this.containerElement).addClass('pagination').html(paginationHtml)
    } else this.renderEmpty();
    return this;
  }

  renderEmpty(paginationHtml) {
    let html = '';
    html += `<li class="page-item disabled">`
    html += `  <a class="page-link pagination-prev" href="#">Previous</a>`
    html += `</li>`
    html += `<li class="page-item disabled">`
    html += `  <a class="page-link" href="#">--</a>`
    html += `</li>`
    html += `<li class="page-item disabled">`
    html += `  <a class="page-link pagination-next" href="#">Next</a>`
    html += `</li>`
    $(this.containerElement).addClass('pagination').html(html)
  }
}

class CUI {
  static confirm(content, options) {
    return new CoreConfirm(content, options);
  }
  static info(content, options) {
    return new CoreInfo(content, options);
  }
  static success(content, options) {
    return new CoreSuccess(content, options);
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
