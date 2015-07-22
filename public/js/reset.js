/* globals $ */

$('#resetForm').submit(function(event) {
  event.preventDefault();
  $.post('/reset', $('#resetForm').serialize())
    .fail(function(xhr) {
      var res = JSON.parse(xhr.responseText);
      $('#resetAlert').empty().append(res.message).removeClass('hidden');
      $('input[name=\'_csrf\']').val(res.csrfToken);
    })
    .done(function() {
      $('#resetAlert').empty().append('Password Changed!').removeClass('hidden');
      location.reload();
    });
});

