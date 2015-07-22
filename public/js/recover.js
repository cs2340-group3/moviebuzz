/* globals $ */

$('#recoverForm').submit(function(event) {
  event.preventDefault();
  $.post(location.pathname, $('#recoverForm').serialize())
    .fail(function(xhr) {
      var res = JSON.parse(xhr.responseText);
      $('#recoverAlert').empty().append(res.message).removeClass('hidden');
      $('input[name=\'_csrf\']').val(res.csrfToken);
    })
    .done(function() {
      $('#resetAlert').empty().append('Password Changed!').removeClass('hidden');
      location.href = '/';
    });
});
