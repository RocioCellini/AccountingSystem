import cookie from 'react-cookies';

export function getCookie(key) {
  return cookie.load(key);
}

export function setCookie(key, value, options = {}) {
  cookie.save(key, value, options);
}

export function removeCookie(key, options = {}) {
  cookie.remove(key, options);
}

