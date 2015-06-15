$(document).ready(function() {
  // TODO: Error handling. See backend code.
  $.fn.editable.defaults.ajaxOptions = {
    type: "PUT"
  };
  $.fn.editable.defaults.mode = 'inline'; // inline editing, no pop up
  $.fn.editable.defaults.send = 'always'; // we don't have pk field
  $('#firstname').editable();
  $('#lastname').editable();
  $('#major').editable();
  $('#bio').editable();
});
