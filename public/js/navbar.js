/* globals $ */

$(function() {
  $('#loginButton').click(function() {
    $.getScript('/js/login.js');
  });
  $('#registerButton').click(function() {
    $.getScript('/js/register.js');
  });
  $('#resetButton').click(function() {
    $.getScript('/js/reset.js');
  });
  $('#searchButton').click(function() {
    event.preventDefault();
    window.location.href = '/search/' + $('#keyword').val();
  });
});

