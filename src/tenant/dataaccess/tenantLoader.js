import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function tenantLoader(history, callback, callbackError) {
  authenticatedFetch('/tenants', history, {
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
