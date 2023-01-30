const addScript = url => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  document.body.appendChild(script);
};

exports.disableCorePrefetching = () => true;

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

exports.onClientEntry = () => {
  window.ga_cookie = getCookie('_ga');
  window.ga_id = window.ga_cookie.substr(6);
};

exports.onRouteUpdate = ({location, prevLocation}) => {
  window.dacast_init = false;
  if (window.analytics) {
    window.analytics.page('', {
      integrations: {
        'Google Analytics': true,
        clientId: window.ga_id,
      },
      path: location.pathname,
    });
  }

  if (window.basicReload) {
    window.basicReload();
  }
};
