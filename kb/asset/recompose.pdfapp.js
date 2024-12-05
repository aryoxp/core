class PDFApp {
  constructor(container, options) {
    PDFApp.currentPage = 3,
    PDFApp.pdf = null,
    PDFApp.zoom = 1
    this.container = container;
    this.settings = Object.assign({
      pdfData: atob(
        'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
        'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
        'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
        'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
        'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
        'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
        'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
        'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
        'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
        'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
        'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
        'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
        'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G')
    }, options);
    this.init();
    this.handleEvent();
  }

  static instance(container, options) {
    if (!PDFApp.inst)
      PDFApp.inst = new PDFApp(container, options);
    return PDFApp.inst;
  }
  
  init() {
    if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
      // eslint-disable-next-line no-alert
      alert("Please build the pdfjs-dist library using\n `gulp dist-install`");
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.min.mjs";
  
    const container = $('#viewerContainer').get(0);
    const CMAP_URL = "cmaps/";
    const CMAP_PACKED = true;
  
    const DEFAULT_URL = Core.instance().config('basefileurl') + 'files/helloworld.pdf';
  
    const ENABLE_XFA = true;
    const SEARCH_FOR = "x86"; // try "Mozilla";
  
    const SANDBOX_BUNDLE_SRC = new URL(
      "pdf.sandbox.min.mjs",
      window.location
    );
    const eventBus = new pdfjsViewer.EventBus();
    // eventBus._dispatchToDOM = true;
  
    // (Optionally) enable hyperlinks within PDF files.
    this.pdfLinkService = new pdfjsViewer.PDFLinkService({
      eventBus,
    });
  
    // (Optionally) enable find controller.
    this.pdfFindController = new pdfjsViewer.PDFFindController({
      eventBus,
      linkService: this.pdfLinkService,
      updateMatchesCountOnProgress: false
    });
  
    // (Optionally) enable scripting support.
    this.pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
      eventBus,
      sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
    });
  
    this.pdfViewer = new pdfjsViewer.PDFViewer({
      container,
      eventBus,
      linkService: this.pdfLinkService,
      findController: this.pdfFindController,
      scriptingManager: this.pdfScriptingManager,
    });
  
    this.pdfLinkService.setViewer(this.pdfViewer);
    this.pdfScriptingManager.setViewer(this.pdfViewer);
    this.downloadManager = new pdfjsViewer.DownloadManager();
    // console.log(new pdfjsViewer.DownloadManager);

    eventBus.on("pagesinit", () => {
      // We can use pdfViewer now, e.g. let's change default scale.
      this.pdfViewer.currentScaleValue = "page-width";
      $(`${this.container} .page-info`).html(`${this.pdfViewer.currentPageNumber}/${this.pdfViewer.pdfDocument.numPages}`);
      // this.pdfViewer.currentScaleValue = 2;
      // console.log(this.settings);
      this.pdfViewer.currentPageNumber = Number(this.settings.page) ?? 1;
      this.query = this.settings.keyword;
      this.dispatchEvent("again", false);
      // console.log(this.pdfViewer, this.pdfLinkService);
      // this.pdfViewer.scrollPageIntoView({
      //   pageNumber: 3
      // });
      // this.pdfViewer.nextPage();
      // this.pdfLinkService.goToPage(2);
      // console.log("X");
      // We can try searching for things.
      // if (SEARCH_FOR) {
      //   eventBus.dispatch("find", { type: "VM", query: SEARCH_FOR });
      // }
      // setTimeout(() => {
      //   this.pdfLinkService.goToPage(2);
      //   console.warn("X");
      //   // $("#viewerContainer").scrollTop = 100;
      //   // $("#viewer").scrollTop = 300;
      // }, 1500);
      // // this.pdfViewer.scrollPageIntoView({pageNumber: 4});
      // console.log(this.pdfViewer);
    });

    eventBus.on("pagechanging", (e) => { // console.log(e);
      $(`${this.container} .page-info`).html(`${e.pageNumber}/${this.pdfViewer.pdfDocument.numPages}`);
    });

    eventBus.on("updatefindcontrolstate", (e) => { console.log(e, $(`${this.container} .bt-next`), $(`${this.container} .bt-prev`));
      $(`${this.container} .search-status`).html(`${e.matchesCount.current}/${e.matchesCount.total}`);
      if (e.matchesCount.current < e.matchesCount.total) $(`${this.container} .bt-next`).prop('disabled', false);
      else $(`${this.container} .bt-next`).prop('disabled', true);
      if (e.matchesCount.current > 1) $(`${this.container} .bt-prev`).prop('disabled', false);
      else $(`${this.container} .bt-prev`).prop('disabled', true);
    })

    eventBus.on("updatefindmatchescount", (e) => { // console.log(e);
      $(`${this.container} .search-status`).html(`${e.matchesCount.current}/${e.matchesCount.total}`);
      if (e.matchesCount.total > 1) $(`${this.container} .bt-next`).prop('disabled', false);
      else $(`${this.container} .bt-next`).prop('disabled', true);
      $(`${this.container} .bt-prev`).prop('disabled', true);
    });


    
    // Loading document.
    this.loadingTask = pdfjsLib.getDocument({
      // url: DEFAULT_URL,
      data: this.settings.pdfData,
      // cMapUrl: CMAP_URL,
      // cMapPacked: CMAP_PACKED,
      // enableXfa: ENABLE_XFA,
    });

    this.eventBus = eventBus;
  
    PDFApp.modal = UI.modal(this.container, {width: this.settings.width, height: this.settings.height, hideElement: '.bt-close'}).show();
    UI.makeResizable(this.container, {handle: '.bt-resize'});
    UI.makeDraggable(this.container, {handle: '.drag-handle'});
  };

  async load() {
    const pdfDocument = await this.loadingTask.promise;
    // Document loaded, specifying document for the viewer and
    // the (optional) linkService.
    this.pdfViewer.setDocument(pdfDocument);
    // console.error(this.pdfViewer);
    // this.pdfViewer.scrollPageIntoView({pageNumber: 2});
    this.pdfLinkService.setDocument(pdfDocument, null);
    // this.pdfLinkService.goToPage(2);
  }

  dispatchEvent(type, findPrev = false) {
    this.eventBus.dispatch("find", {
      source: this,
      type,
      query: this.query,
      caseSensitive: false,
      entireWord: false,
      highlightAll: true,
      findPrevious: findPrev,
      matchDiacritics: true
    });
  }

  handleEvent() {
    $(`${this.container} .input-keyword`).on('keyup', e => {
      this.query = $(`${this.container} .input-keyword`).val().trim();
      if (this.query.length == 0) return; 
      if (e.code == "Enter") {
        this.dispatchEvent("again", e.shiftKey);
      }
      L.log("reference-search-enter", this.settings.fileName);
    });
    $(`${this.container} .bt-zoom-in`).on('click', e => {
      this.pdfViewer.increaseScale();
    });
    $(`${this.container} .bt-zoom-out`).on('click', e => {
      this.pdfViewer.decreaseScale();
    });
    $(`${this.container} .bt-page-width`).on('click', e => {
      this.pdfViewer.currentScaleValue = 'page-width';
    });
    $(`${this.container} .bt-page-height`).on('click', e => {
      this.pdfViewer.currentScaleValue = 'page-height';
    });
    $(`${this.container} .bt-zoom-auto`).on('click', e => {
      this.pdfViewer.currentScaleValue = 'auto';
    });
    $(`${this.container} .bt-find`).on('click', e => {
      this.query = $(`${this.container} .input-keyword`).val().trim();
      if (this.query.length == 0) return; 
      this.dispatchEvent("again", e.shiftKey);
      L.log("reference-search-find", this.settings.fileName);
    });
    $(`${this.container} .bt-next`).on('click', e => {
      this.query = $(`${this.container} .input-keyword`).val().trim();
      if (this.query.length == 0) return; 
      this.dispatchEvent("again", false);
      L.log("reference-search-next", this.settings.fileName);
    });
    $(`${this.container} .bt-prev`).on('click', e => {
      this.query = $(`${this.container} .input-keyword`).val().trim();
      if (this.query.length == 0) return; 
      this.dispatchEvent("again", true);
      L.log("reference-search-prev", this.settings.fileName);
    });
    $(`${this.container} .bt-close-search`).click((e) => {
      console.log($(e.currentTarget).parents(`${this.container}`));
      $(e.currentTarget).parents(`${this.container}`).find('.bt-search').dropdown('toggle')
    });
    $(`${this.container}`).bind('mousewheel', (e) => { // console.log(e);
      if (e.ctrlKey) {
        if (e.originalEvent.wheelDelta > 0) {
            this.pdfViewer.currentScale += 0.02;
        } else this.pdfViewer.currentScale -= 0.02;
        e.preventDefault();
      }
    });
    $(`${this.container} .bt-download`).on('click', async e => { console.log(e);
      // this.eventBus.dispatch("download", {
      //   source: this
      // });
      let data;
      // try {
        // if (this.downloadComplete) {
          data = await this.pdfViewer.pdfDocument.getData();
          console.log(this.pdfViewer, pdfjsLib);
        // }
      // } catch {}
      this.downloadManager.download(data, null, this.settings.fileName);
      L.log("reference-download", this.settings.fileName);
      //, this._downloadUrl, this._docFilename, options);
    });
    $(document).on('keydown', (e) => { // console.log(e);
      if ( e.ctrlKey && ( e.key === 'f' ) ){
        if ($(`${this.container}`).is(":visible")) {
          e.preventDefault();
          $(`${this.container}`).find('.bt-search').trigger('click');
          let input = $(`${this.container} .input-keyword`).focus();
          // console.log(input);
          input[0].selectionStart = 0;
          input[0].selectionEnd = input.val().length;
        }
      }
    });
  }

  goToPage(page) {
    this.pdfViewer.currentPageNumber = Number(page);
  }

  search(keyword) {
    this.query = keyword;
    this.dispatchEvent("again", false);
    $(`${this.container} input.input-keyword`).val(keyword);
    // console.log($(`${this.container} input.input-keyword`), keyword);
  }
}