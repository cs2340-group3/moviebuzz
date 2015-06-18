$(function() {
  $.fn.editable.defaults.ajaxOptions = {
    type: "PUT"
  };
  $.fn.editable.defaults.mode = 'inline'; // inline editing, no pop up
  $.fn.editable.defaults.send = 'always'; // we don't have pk field
  $.fn.editable.defaults.params = function (params) {
    params._csrf = $("#_token").data("token");
    return params;
  };
  $.fn.editable.defaults.error = function (xhr, status, error) {
    var err = JSON.parse(xhr.responseText);
    return err.msg;
  }
  $('#firstname').editable();
  $('#lastname').editable();
  $('#major').editable();
  $('#bio').editable();
});

