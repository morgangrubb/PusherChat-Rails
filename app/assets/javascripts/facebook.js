
$(function() {
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
          console.log(data)
          window.location = data['redirect'];
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
    console.log("Do facebooky things")

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        // var uid = response.authResponse.userID;
        // var accessToken = response.authResponse.accessToken;

        // console.log("send this data to session#create")
        // console.log(uid, accessToken, response);
        startSession(response);
      }
      // else if (response.status === 'not_authorized') {
      //   // the user is logged in to Facebook,
      //   // but has not authenticated your app
      //   console.log("ask for permissions")
      // }
      else {
        // the user isn't logged in to Facebook.
        console.log("ask for login and permissions")
        doLogin();
      }
    });

  }

  $("#login_with_facebook").click(function(event) {
    event.preventDefault();
    loginWithFacebook();
  });

})
