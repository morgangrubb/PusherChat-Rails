
function drawLoginButton() {
  $('#messages').append('<a class="btn btn-large btn-primary" href="#" style="margin: 25px">Login with Facebook</a>');
  $('#messages a').click(function(event) {
    loginWithFacebook();
    event.preventDefault();
  });
}

function startSession(authResponse) {
  FB.api('/me', function(userResponse) {
    $.ajax({
      url: "/sessions",
      type: "POST",
      dataType: 'json',
      data: {
        auth: authResponse,
        user: userResponse
      },
      success: function(data) {
        startChat(data['user_id']);
      }
    });
  });
}

function doLogin() {
  FB.login(function(response) {
    if (response.authResponse) {
      startSession(response);
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  });
}

function loginWithFacebook() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      startSession(response);
    }
    // else if (response.status === 'not_authorized') {
    //   // the user is logged in to Facebook,
    //   // but has not authenticated your app
    //   console.log("ask for permissions")
    // }
    else {
      // the user isn't logged in to Facebook.
      doLogin();
    }
  });
}
