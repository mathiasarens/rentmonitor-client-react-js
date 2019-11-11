import { AUTH_TOKEN } from '../Constants';

export function filterResponseCodes(response, history) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                sessionStorage.removeItem(AUTH_TOKEN);
                history.push('/signin');
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}