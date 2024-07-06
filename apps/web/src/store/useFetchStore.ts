import create from 'zustand';
import axiosInstance from '../utils/axiosInstance';


// Define the state interface
interface State {
	data: any[];
	loading: boolean;
	error: string | null;
	fetchData: (path: string) => Promise<void>;
}


// Create the Zustand store
const useFetchStore = create<State>((set) => ({
	data: [],
	loading: false,
	error: null,
	fetchData: async (path) => {
		set({ loading: true, error: null });
		try {
			const response = await axiosInstance.get(path); // Replace with your API endpoint 
			set({ data: response.data, loading: false });
		} catch (error:any) {
			set({ error: error.message, loading: false });
		}
	},
}));

export default useFetchStore;
