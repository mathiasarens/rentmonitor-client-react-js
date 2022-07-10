import {authenticatedFetch} from '../../authentication/authenticatedFetch';

export function addDueBookingsFromContracts(
  navigate,
  callback,
  callbackConnectionError,
  callbackError,
) {
  const bodyJson = JSON.stringify({}, null, 2);
  authenticatedFetch('/contract-to-booking', navigate, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: bodyJson,
  })
    .then((response) => {
      switch (response.status) {
        case 200:
          response.json().then((json) => {
            callback(json);
          });
          break;
        default:
          callbackConnectionError(response);
      }
    })
    .catch((error) => {
      callbackError(error);
    });
}
