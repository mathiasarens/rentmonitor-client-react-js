import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function tenantsLoader(navigate, callback, callbackError) {
  authenticatedFetch('/tenants?filter[order]=name%20ASC', navigate, {
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
