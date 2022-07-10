import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function bookingsLoader(tenantId, navigate, callback, callbackError) {
  const url = tenantId
    ? '/bookings?filter[where][tenantId]=' + tenantId
    : '/bookings';
  authenticatedFetch(url, navigate, {
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

export function bookingLoader(id, navigate, callback, callbackError) {
  authenticatedFetch(`/bookings/${id}`, navigate, {
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
