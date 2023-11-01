import React, { useState, useEffect } from 'react';

const CSRFToken = () => {
    const [csrftoken, setcsrftoken] = useState('');

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/users/csrf_cookie', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    setcsrftoken(getCookie('csrftoken'));
                }
            } catch (error) {
                console.error('Error fetching CSRF token ', error);
            }
        };
        fetchData();
        console.log(csrftoken, 'TOKEN');
    }, []);

    return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
};

export default CSRFToken;