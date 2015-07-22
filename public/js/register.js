/* globals $ */

$('#registerForm').submit(function(event) {
  event.preventDefault();
  $.post('/register', $('#registerForm').serialize())
    .fail(function(xhr) {
      var res = JSON.parse(xhr.responseText);
      $('#registerAlert').empty().append(res.message).removeClass('hidden');
      $('input[name=\'_csrf\']').val(res.csrfToken);
    })
    .done(function() {
      if (!$('#registerAlert').hasClass('hidden')) {
        $('#registerAlert').removeClass('hidden');
      }
      location.reload();
    });
});

