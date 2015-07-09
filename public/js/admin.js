/* global $ */

function adminError(xhr) {
  var res = JSON.parse(xhr.responseText);
  // TODO: Show this error message to user
  console.log(res);
}

function adminSuccess() {
  location.reload();
}

function deleteUser(username) {
  $.ajax({
    url: '/admin'
    , dataType: 'json'
    , data: {
      'username': username
      , '_csrf': $('#adminToken').val()
    }
    , type: 'DELETE'
  })
    .fail(adminError)
    .done(adminSuccess);
}

function changeUserStatus(username, toStatus) {
  $.ajax({
    url: '/admin'
    , dataType: 'json'
    , data: {
      'action': toStatus
      , 'username': username
      , '_csrf': $('#adminToken').val()
    }
    , type: 'PUT'
  })
    .fail(adminError)
    .done(adminSuccess);
}

