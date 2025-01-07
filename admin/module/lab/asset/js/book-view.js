$(() => {

  let book = Core.instance().config('book');
  let baseurl = Core.instance().config('baseurl')
  PDFViewerApplicationOptions.set('defaultUrl', 
    baseurl + "m/x/lab/bookApi/open/" + btoa(encodeURIComponent(book)));
  // console.error(PDFViewerApplication, PDFViewerApplicationOptions);
  let config = PDFViewerApplication.config;
  PDFViewerApplication.run(config);
});