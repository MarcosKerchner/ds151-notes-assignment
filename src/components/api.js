import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:3000'
});

api.interceptors.request.use(
    async (config) => {
        const access_token = await AsyncStorage.getItem('access_token');
        console.log('token api: ' + access_token);
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        if (config.method === 'get') {
            const userId = await AsyncStorage.getItem('userId');
            console.log('userId: ' + userId);
            if (userId) {
                if (!config.url.includes('?')) {
                    config.url = config.url + '?userId=' + userId;
                }
            }
        }
        if (config.method === 'post') {
            const userId = await AsyncStorage.getItem('userId');
            console.log('userId: ' + userId);
            if (userId) {
                config.data.userId = userId;
            }
        }
        return (config);
    }, 
    (err) => {
        return Promise.reject(err)
    }
)

export default api;
