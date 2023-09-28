class api {
    static delete = async (url, body) => {
        const response = await fetch(url, {
            method: 'DELETE',
            body: body
        });

        return await response.json();
    }

    static get = async (url, body) => {
        const response = await fetch(url);

        return await response.json();
    }

    static patch = async (url, body) => {
        const response = await fetch(url, {
            method: 'PATCH',
            body: body
        })

        return await response.json();
    }

    static post = async (url, body) => {
        const response = await fetch(url, {
            method: 'POST',
            body: body
        })

        return await response.json();
    }
}

export default api;