$(() => {
  $('.btn-setup').on('click', e => {
    (new CoreConfirm("Begin setup process?", {
      positive: () => {
        (new CoreInfo('Setup completed.')).show();
      }
    })).show()
  });
});