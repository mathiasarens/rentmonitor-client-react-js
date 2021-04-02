import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function tenantsLoader(history, callback, callbackError) {
  authenticatedFetch('/tenants?filter[order]=name%20ASC', history, {
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

export function tenantLoader(id, history, callback, callbackError) {
  authenticatedFetch(`/tenants/${id}`, history, {
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
