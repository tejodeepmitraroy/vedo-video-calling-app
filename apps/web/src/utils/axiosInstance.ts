import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Replace with your API base URL
	headers: {
		'Content-Type': 'application/json',
	},
});

// axiosInstance.interceptors.request.use(
// 	async (config) => {
// 		const { getToken } = useAuth();
// 		const token = await getToken();
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );

export default axiosInstance;
