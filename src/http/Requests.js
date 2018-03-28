import apiOrigin from 'apiOrigin';

class Requests {

    static loginRequest(credentials) {
        return fetch(Requests._linkTo('/api/login'), {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${encodeURI(credentials.username)}&password=${encodeURI(credentials.password)}`,
            method: 'POST'
        })
    }

    static logoutRequest() {
        return fetch(Requests._linkTo('/api/logout'), {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: "{}",
            method: 'POST'
        })
    }

    static async jsonGet(path) {
        const response = await fetch(Requests._linkTo(path), {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });

        Requests._checkRequestIsAuthorized(response);
        return response.json();
    }

    static async jsonPost(path, data) {
        const response = await fetch(Requests._linkTo(path), {
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        Requests._checkRequestIsAuthorized(response);
        return response;
    }

    static async jsonPut(path, data) {
        const response = await fetch(Requests._linkTo(path), {
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        Requests._checkRequestIsAuthorized(response);
        return response;
    }

    static async jsonDelete(path) {
        const response = await fetch(Requests._linkTo(path), {
            credentials: 'include',
            method: 'DELETE'
        });

        Requests._checkRequestIsAuthorized(response);
        return response;
    }

    static async postFile(path, data) {
        const response = await fetch(Requests._linkTo(path), {
            method: 'POST',
            credentials: 'include',
            body: data
        });
        Requests._checkRequestIsAuthorized(response);
        return response;
    }


    static _linkTo(path) {
        return apiOrigin + path;
    }

    static _checkRequestIsAuthorized(response) {
        if (response.status === 401)
            location.href = "/";
    }
}
export default Requests;

