import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function bookingsLoader(tenantId, history, callback, callbackError) {
  const url = tenantId
    ? '/bookings?filter[where][tenantId]=' + tenantId
    : '/bookings';
  authenticatedFetch(url, history, {
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

export function bookingLoader(id, history, callback, callbackError) {
  authenticatedFetch(`/bookings/${id}`, history, {
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
