/**
 * JavaScript functions for testing OpenID Connect
 * 
 * Copyright (C) 2024 F5, Inc.
 */

// Constants for common error message.
var isSignedIn           = false;
var TITLE_SIGNIN         = 'Sign in';
var TITLE_SIGNOUT        = 'Sign out';
var MSG_SIGNINIG_IN      = 'Signinig in';
var MSG_SIGNED_IN        = 'Signed in';
var MSG_SIGNED_OUT       = 'Signed out';
var MSG_EMPTY_JSON       = '{"message": "N/A"}';
var btnSignin            = document.getElementById('signin');
var btnProxiedAPI        = document.getElementById('proxied-api');
var btnIdTokenClaims     = document.getElementById('id-token-claims');
var btnAccessTokenClaims = document.getElementById('access-token-claims');
var jsonViewer           = new JSONViewer();
var viewerJSON           = document.querySelector("#json").appendChild(jsonViewer.getContainer());
var accessToken          = '';
var userName             = '';


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 *                        0. Initialize Main Page                              *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var initButtons = function () {
  if (isSignedIn) {
    initButtonsAfterSignIn()
  } else {
    initButtonsBeforeSignIn()
  }
}


var initButtonsBeforeSignIn = function () {
  btnProxiedAPI.disabled        = true
  btnIdTokenClaims.disabled     = true
  btnAccessTokenClaims.disabled = true
  isSignedIn                    = false;
  showLoginBtnTitle(TITLE_SIGNIN);
}

var initButtonsAfterSignIn = function () {
  btnProxiedAPI.disabled        = false
  btnIdTokenClaims.disabled     = false
  btnAccessTokenClaims.disabled = false
  isSignedIn                    = true;
  showLoginBtnTitle(TITLE_SIGNOUT);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 *                1. Event Handler for testing OIDC                            *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Event Handler: for when clicking a either 'Sign in' or `Sign out` button.
var eventHandlerSignIn = function (evt) {
  if (!isSignedIn) {
    doSignIn(evt)
  } else {
    doSignOut(evt)
  }
};

// Event Handler: for when clicking a 'Call a proxied API' button.
// /v1/api/example: cookie is used. The bearer access token is also passed to the
//                  backend API via `proxy_set_header Authorization` directive.
var eventHandlerProxiedAPI = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    getSampleURI(), 
    'calling a sample proxied API...',
    'called a sample proxied API',
    headers
  )
};

// Event Handler: for when clicking a 'Get ID token claims' button.
var eventHandlerIdTokenClaims = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/v1/api/idtoken',
    'getting ID token claims...',
    'called an API to get ID token claims',
    headers
  )
};

// Event Handler: for when clicking a 'Get access token claims' button.
var eventHandlerAccessTokenClaims = function (evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/v1/api/accesstoken',
    'getting access token claims...',
    'called an API to get access token claims',
    headers
  )
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                             *
 *         2. Common Functions for testing OIDC Workflows via Sample UI        *
 *                                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Request NGINX endpoint which is a location block.
var doNginxEndpointRequest = function(evt, uri) {
  if (evt && evt.type === 'keypress' && evt.keyCode !== 13) {
    return;
  }
  location.href = window.location.origin + uri;
};

var eraseAllCookies = function() {
  eraseCookie('session_id')
  eraseCookie('auth_redir')
  eraseCookie('auth_nonce')
  sessionStorage.clear()
  localStorage.clear()
}

var eraseCookie = function(name) {
  document.cookie = name+'=; Path=/; SameSite=lax; username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; HttpOnly; Secure;';
}

var setCookie = function(name, value) {
  document.cookie = name+'='+value+'; Path=/; SameSite=lax;';
}

// Sign in by clicking 'Sign In' button of the UI.
var doSignIn = function(evt) {
  doNginxEndpointRequest(evt, '/login');
};

// Sign in by clicking 'Sign In' button of the UI.
var doSignOut = function(evt) {
  doNginxEndpointRequest(evt, '/logout');
};

// Request an API with application/json type response.
var doAPIRequest = function(evt, uri, msgBefore, msgAfter, headers) {
  if (evt && evt.type === 'keypress' && evt.keyCode !== 13) {
    return false;
  }
  showMessage(msgBefore)
  const url = window.location.origin + uri;
  fetch(url, {
      method : 'GET',
      mode   : 'cors',
      headers: headers
  })
  .then((response) => {
    showResponseStatus(response.status, response.statusText, url)
    showMessageDetail(MSG_EMPTY_JSON)
    if (response.ok || response.status == 400) {
      return response.json();
    }
    throw new Error(response.error)
  })
  .then((data) => {
    showMessage(msgAfter)
    showMessageDetail(JSON.stringify(data))
    if (uri == '/userinfo') {
      initButtonsAfterSignIn()
    }
    if (data.username) {
      userName = data.username;
      showMessage(userName)
    } else if (data.name) {
      userName = data.name;
      showMessage(userName)
    } else if (data.email) {
      userName = data.email;
      showMessage(userName)
    }
  })
  .catch(function(error) {
    if (uri == '/userinfo') {
      initButtonsBeforeSignIn()
      showMessage('Sign in to retrieve user information!');
      showMessageDetail(MSG_EMPTY_JSON)
    } else {
      showMessage(error);
      showMessageDetail(MSG_EMPTY_JSON)
    }
  });
  return true;
}

// Show user information in the UI via the endpoint of /userinfo
var showUserInfo = function(evt) {
  var headers = {};
  doAPIRequest(
    evt,
    '/userinfo', 
    'getting user info from IdP...',
    'user info: received from IdP',
    headers
  );
}

// Display summarized message for each testing.
var showMessage = function (msg) {
  document.getElementById('message').value = msg;
};

// Display response status & message for each testing.
var showResponseStatus = function (status, msg, uri) {
  document.querySelector('pre').textContent = uri + ', ' + status + ', ' + msg;
};

// Clear message window
var clearMessage = function() {
  document.querySelector('pre').textContent = '';
  showMessageDetail(MSG_EMPTY_JSON);
};

// Display detail message for each testing.
var showMessageDetail = function (msg) {
  var setJSON = function() {
    try {
      jsonObj = JSON.parse(msg);
    }
    catch (err) {
      alert(err);
    }
  };
  setJSON();
  jsonViewer.showJSON(jsonObj);
  var res = jsonObj;
  return res
}

// Display a button title for toggling between 'Sign in' and 'Sign out'.
var showLoginBtnTitle = function (msg) {
  btnSignin.innerText = msg
};

// Display 'Sign In' button when signed-out or occurs error during signing-in.
var showSignInBtn = function () {
  isSignedIn = false;
  showLoginBtnTitle(TITLE_SIGNIN);
  showMessage(MSG_SIGNED_OUT);
};

// Display 'Sign Out' button when signed-in.
var showSignOutBtn = function () {
  isSignedIn = true;
  showLoginBtnTitle(TITLE_SIGNOUT);
  showMessage(MSG_SIGNED_IN);
};

var getSampleURI = function () {
  return document.getElementById('sample-uri').value;
};

// Return cookie value using key
var getCookieValue = function(key) {
  var cookies = document.cookie;
  var parts = cookies.split(key + "=");
  var cookieValue = '';
  if (parts.length == 2) {
      cookieValue = parts.pop().split(";").shift();
  }
  return cookieValue;
}

// Add event lister of each button for testing OIDC integration.
btnSignin           .addEventListener('click', eventHandlerSignIn);
btnProxiedAPI       .addEventListener('click', eventHandlerProxiedAPI);
btnIdTokenClaims    .addEventListener('click', eventHandlerIdTokenClaims);
btnAccessTokenClaims.addEventListener('click', eventHandlerAccessTokenClaims);

showUserInfo(null)
