// hooks/useFetchData.js

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ConfigContext } from '../Provider/Context.js';

const useFetchData = (url) => {
    const config = useContext(ConfigContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export {useFetchData};
