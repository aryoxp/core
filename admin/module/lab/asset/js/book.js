$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      this.config = Core.instance().config();
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('#form-search').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        let perpage = parseInt($('#form-search .input-perpage').val())
        let keyword = $('#form-search .input-keyword').val()
        let page = (!App.pagination || 
          keyword != App.pagination.keyword ||
          perpage != App.pagination.perpage) ?
          1 : App.pagination.page;
        let params = { keyword: keyword }; 
        Promise.all([
          this.ajax.post(`m/x/lab/bookApi/search/${page}/${perpage}`, params)])
        .then(results => { // console.log(results);
          let books = results[0].book;
          let count = results[0].count;
          App.populateBook(books);
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            CorePagination.instance('.book-pagination', count, perpage).listen('#form-search').update(count, perpage);
            App.pagination.keyword = keyword;
            App.pagination.perpage = perpage;
            App.pagination.page = page;
          }, err => {
            CUI.error(err).show();
          });

      });
      $('.book-list').on('click', '.book', (e) => {
        console.log(e);
        window.location.href = this.config.get('baseurl') + 'm/x/lab/book/view/' + $(e.currentTarget).attr('data-book');
      });
    }

    onLoad() {
      $('#form-search').trigger('submit');
    }

  }

  App.populateBook = (books) => { // console.log(books);
    if (!books) books = [];
    let html = '';
    let config = Core.instance().config();
    books.forEach(book => { // console.log(book);
      let hash = btoa(encodeURIComponent(book)); // console.log(hash);
      html += `<div class="col text-center">`;
      html += `<img src="${config.get('baseurl') + '/m/x/lab/bookApi/cover/' + book}" class="book" data-book="${hash}">`;
      html += `</div>`;
    });
    if (html.length == 0) html = '<em class="d-block m-3 user-muted">No book found in current search.</em>';
    $('.book-list').html(html);
  }

  new App();

});