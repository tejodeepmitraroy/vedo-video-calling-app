import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Create axios instance with default config
// export const useCustomAxios = () => {
//   const { getToken } = useAuth();

//   const axiosInstance = useMemo(() => {
//     return axios.create({
//       baseURL: baseURL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }, []);

//   // Add request interceptor to include the token in each request
//   axiosInstance.interceptors.request.use(async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   return axiosInstance;
// };
export const customAxios = (token: string | null) => {
	const axiosInstance = axios.create({
		baseURL: baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	// Add request interceptor to include the token in each request
	axiosInstance.interceptors.request.use(async (config) => {
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	return axiosInstance;
};
