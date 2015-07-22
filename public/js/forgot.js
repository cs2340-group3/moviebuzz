/* globals $ */

$('#forgotForm').submit(function(event) {
  event.preventDefault();
  $.post('/reset', $('#forgotForm').serialize())
    .fail(function(xhr) {
      var res = JSON.parse(xhr.responseText);
      $('#forgotAlert').empty().append(res.message).removeClass('hidden');
      $('input[name=\'_csrf\']').val(res.csrfToken);
    })
    .done(function() {
      $('#forgotAlert').empty().append('Email sent.').removeClass('hidden');
      location.reload();
    });
});

