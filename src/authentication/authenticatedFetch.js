import {AUTH_TOKEN} from '../Constants';

export function authenticatedFetch(urlSuffix, history, options) {
  options.headers['Authorization'] = `Bearer ${sessionStorage.getItem(
    AUTH_TOKEN,
  )}`;
  return fetch(
    `${process.env.REACT_APP_BACKEND_URL_PREFIX}${urlSuffix}`,
    options,
  ).then((response) => {
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        sessionStorage.removeItem(AUTH_TOKEN);
        history.push('/signin');
      }
      return Promise.reject(response);
    } else {
      return response;
    }
  });
}

export function handleAuthenticationError(error) {
  if ([401, 403].indexOf(error.status) !== -1) {
    return 'unauthenticatedError';
  } else {
    return 'connectionError';
  }
}

export function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
