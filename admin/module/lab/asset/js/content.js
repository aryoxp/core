$(() => {

  class App {

    constructor() {
      this.ajax = Core.instance().ajax();
      this.handleEvent();
      this.onLoad();
    }

    handleEvent() {
      $('.bt-new-content').on('click', e => {
        $('h3 .form-title').html('New Content');
        $('input#cid').val("");
        $('input#key').val("");
        $('input#title').val("");
        $('input#subtitle').val("");
        App.simplemde?.value("");
        $('code-input')[0].value = '';
        $("h3 .form-title").get(0).scrollIntoView({behavior: 'smooth'});
      });
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
          this.ajax.post(`m/x/lab/contentApi/search/${page}/${perpage}`, params)])
        .then(results => { // console.log(results);
          let contents = results[0].content;
          let count = results[0].count;
          App.populateContent(contents);
          if (App.pagination) {
            App.pagination.page = page;
            App.pagination.keyword = keyword;
            App.pagination.update(count, perpage);  
          } else App.pagination = 
            CorePagination.instance('.content-pagination', count, perpage).listen('#form-search').update(count, perpage);
            App.pagination.keyword = keyword;
            App.pagination.perpage = perpage;
            App.pagination.page = page;
          }, err => {
            CUI.error(err).show();
          });

      });
      $('.content-list').on('click', '.bt-detail', (e) => {
        $(e.currentTarget).siblings('.bt-edit').trigger('click');
      });
      $('.content-list').on('click', '.bt-edit', (e) => { // console.log(e);
        let row = $(e.currentTarget).parents('.content-item');
        let cid = row.attr('data-cid');
        $('h3 .form-title').html('Edit Content');
        this.ajax.get(`m/x/lab/contentApi/getContent/${cid}`).then((content) => { 
          // console.log(content);
          $('input#cid').val(content.cid);
          $('input#key').val(content.key);
          $('input#title').val(content.title);
          $('input#subtitle').val(content.subtitle);
          $("h3 .form-title").get(0).scrollIntoView({behavior: 'smooth'});
          $(`input[type="radio"][name="type"][value="${content.type}"]`).trigger('click');

          $('code-input')[0].value = content.content;
          App.simplemde?.value(content.content);

        }, (err) => CUI.error(err).show());
      });
      $('.content-list').on('click', '.bt-delete', (e) => { // console.log(e);
        let row = $(e.currentTarget).parents('.content-item');
        let cid = row.attr('data-cid');
        CUI.confirm(`<span class="text-danger">HAPUS</span> content ini?<br>Proses ini TIDAK DAPAT dibatalkan.`)
          .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> HAPUS Content</span>')
          .positive(e => {
            this.ajax.post('m/x/lab/contentApi/deleteContent', {
              cid: cid
            }).then((response) => { // console.log(response)
              if (response) {
                CUI.info("Content telah dihapus.").title('Information').show();
                row.slideUp('fast', () => row.remove());
              }
            }, (err) => CUI.error(err).show());
          })
          .show();
      });
      $('input[type="radio"][name="type"]').on('click', e => {
        let type = $(e.currentTarget).val();
        if (type == 'html') {
          $('code-input').removeClass('d-none');
          $('textarea#content').addClass('d-none');
          App.simplemde?.toTextArea();
          App.simplemde = null;
        } else {
          $('code-input').addClass('d-none');
          $('textarea#content').removeClass('d-none');
          App.simplemde?.toTextArea();
          App.simplemde = null;
          App.simplemde = new SimpleMDE({ element: $("textarea#content")[0],
            spellChecker: false
          });
        }
      });
      $('#content-form').on('submit', e => {
        e.preventDefault();
        e.stopPropagation();
        $('#content-form').addClass('was-validated');
        if(!$('#content-form')[0].checkValidity()) return;

        let type = $('input[type="radio"][name="type"]:checked').val();
        
        let content = (type == 'md') ? App.simplemde.value() : $('code-input')[0].value;
        let params = {
          key: $('input#key').val().trim(),
          title: $('input#title').val().trim(),
          subtitle: $('input#subtitle').val().trim(),
          type: $('input[type="radio"][name="type"]:checked').val(),
          content: content
        };
        let cid = $('input#cid').val().trim();
        if (cid) Object.assign(params, {cid: cid});
        console.log(params);
        this.ajax.post(`m/x/lab/contentApi/save`, params).then(result => {
          console.log(result);
          CUI.success('Content has been saved.').show();
        }, err => CUI.error(err).show());
      });
      $('.bt-clear').on('click', e => {
        $('.bt-new-content').trigger('click');
      });
    }

    onLoad() {
      $('#form-search').trigger('submit');
      App.simplemde = new SimpleMDE({ element: $("textarea#content")[0],
        spellChecker: false
      });
      App.ci = codeInput.registerTemplate("syntax-highlighted", 
        codeInput.templates.hljs(
          hljs, [
            new codeInput.plugins.Indent(true, 2),
            new codeInput.plugins.GoToLine(),
            new codeInput.plugins.AutoCloseBrackets()
          ]
        )
      );
      $('input[type="radio"][name="type"][value="html"]').trigger('click');
    }

  }

  App.populateContent = (contents) => { // console.log(contents);
    if (!contents) contents = [];
    let listHtml = '';
    let selected = App.selectedUsernames;
    contents.forEach(content => { 
      let checked = selected && selected.includes(content.title) ? 'checked' : '';
      listHtml += `<div class="content-item list-item d-flex align-items-center py-1 border-bottom" role="button"`
      listHtml += `  data-cid="${content.cid}" data-name="${content.title}">`
      listHtml += `  <input type="checkbox" class="cb-content ms-1" data-contentname="${content.title}" ${checked}>`
      listHtml += `  <span class="flex-fill ps-2 content-truncate content-nowrap">`
      listHtml += `  <span class="me-3">${content.title}</span>`
      listHtml += !(content.key) ? `` : 
        `<span class="badge bg-success ms-1">${content.key}</span>`;
      listHtml += !(content.subtitle) ? `` : 
        `<span class="badge bg-warning text-dark ms-1">${content.subtitle}</span>`;
      listHtml += `  <span class="px-2 badge rounded bg-secondary text-light">ID: ${content.cid}</span>`;
      listHtml += (content.type == 'md') ? `<span class="badge bg-primary ms-1">MD</span>` : ``;
      listHtml += `  </span>`;
      listHtml += `  <span class="text-end text-nowrap ms-3">`;
      listHtml += `    <span class="me-3"><small>Upd: ${content.updated}</small></span>`;
      listHtml += `    <button class="btn btn-sm btn-primary bt-detail p-2" data-cid="${content.cid}"><i class="bi bi-list"></i><i class="bi bi-search"></i></button>`
      listHtml += `    <a class="btn btn-sm btn-warning bt-edit p-2" data-cid="${content.cid}"><i class="bi bi-pencil"></i></a>`
      listHtml += `    <button class="btn btn-sm btn-danger bt-delete p-2 text-light" data-cid="${content.cid}"><i class="bi bi-x-lg"></i></button>`
      listHtml += `  </span>`
      listHtml += `</div>`
    });
    if (listHtml.length == 0) listHtml = '<em class="d-block m-3 user-muted">No content found in current search.</em>';
    $('.content-list').html(listHtml);
  }

  new App();

});