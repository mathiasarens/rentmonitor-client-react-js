import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function tenantsLoader(navigate, callback, callbackError) {
  const abortController = new AbortController();
  authenticatedFetch('/tenants?filter[order]=name%20ASC', navigate, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: abortController.signal,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      callbackError(error);
    });
  return abortController;
}

export function tenantLoader(id, navigate, callback, callbackError) {
  authenticatedFetch(`/tenants/${id}`, navigate, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      callbackError(error);
    });
}
