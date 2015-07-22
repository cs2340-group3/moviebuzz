/* globals $ */

$('#loginForm').submit(function(event) {
  event.preventDefault();
  $.post('/login', $('#loginForm').serialize())
    .fail(function(xhr) {
      var res = JSON.parse(xhr.responseText);
      $('#loginAlert').empty().append(res.message).removeClass('hidden');
      $('input[name=\'_csrf\']').val(res.csrfToken);
    })
    .done(function() {
      if (!$('#loginAlert').hasClass('hidden')) {
        $('#loginAlert').removeClass('hidden');
      }
      location.reload();
    });
});

