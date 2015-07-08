$(function() {
  $("#loginButton").click(function() {
    $.getScript("/js/login.js");
  });
  $("#registerButton").click(function() {
    $.getScript("/js/register.js");
  });
  $("#goLogin").click(function() {
    $("#loginModal").modal('show');
  });
  $("#goRegister").click(function() {
    $("#registerModal").modal('show');
  });
  $("#searchButton").click(function() {
    event.preventDefault();
    window.location.href = '/search/' + $("#keyword").val();
  })
})

