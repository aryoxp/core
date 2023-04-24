$(() => {

  $('#setup-select-dbkey').on('change', () => {
    let key = $('#setup-select-dbkey').val();
    let ajax = Core.instance().ajax();
    ajax.get(`m/x/mta/setup/check/${key}`).then(result => {
      $('#setup-config').html(result);
    }, err => console.error(err));
  });

});