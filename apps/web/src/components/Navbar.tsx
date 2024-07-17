import React from 'react';

const NavBar = ({ heading }: { heading?: string }) => {
	return (
		// <header className="sticky top-0 z-10 flex h-[60px] items-center gap-1 border-b bg-background bg-slate-300 px-4">
		<header className="sticky top-0 z-10 flex h-[55px] items-center gap-1 px-4">
			<h1 className="text-lg font-semibold text-white md:text-2xl">
				{heading}
			</h1>
		</header>
	);
};

export default NavBar;
