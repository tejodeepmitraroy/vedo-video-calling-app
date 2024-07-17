'use client';
import Dashboard from '@/components/screens/Dashboard';
import Meet from '@/components/screens/Meet';
import Room from '@/components/screens/Rooms';
import useScreenStateStore from '@/store/useScreenStateStore';
import React from 'react';

const Home = () => {
	const currentState = useScreenStateStore((state) => state.currentScreen);
	// const setCurrentState = useScreenStateStore(state=>state.setCurrentScreen)
	return (
		<>
			{currentState === 'dashboard' && <Dashboard />}
			{currentState === 'room' && <Room />}
			{currentState === 'meet' && <Meet />}
		</>
	);
};

export default Home;
