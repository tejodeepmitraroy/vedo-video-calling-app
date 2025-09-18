'use client';

import Dashboard from './@dashboard/page';

const Home = () => {
	return (
		<>
			{/* <div
				className={
					` ${currentScreen === 'Meeting Room' ? 'hidden' : ''} mx-auto flex h-screen w-full flex-1 flex-col bg-gray-100 dark:bg-neutral-800 md:flex-row` // for your use case, use `h-screen` instead of `h-[60vh]`
				}
			>
				<Sidebar open={open} setOpen={setOpen}>
					<SidebarBody className="justify-between gap-10">
						<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
							<>
								<Logo />
							</>
							<div className="mt-8 flex flex-col gap-2">
								{screens.map((screen, idx) => (
									<SidebarButton key={idx} screen={screen} />
								))}
							</div>
						</div>
						<div>
							<SidebarLink
								className="pl-2"
								link={{
									label: user?.fullName ? user.fullName : '',
									href: '#',
									icon: <UserProfile />,
								}}
							/>
						</div>
					</SidebarBody>
				</Sidebar>

				<div className="h-full w-full bg-background md:pb-[50px]">
					<NavBar />
					<div className="flex h-full w-full flex-col justify-between">
						<div className="flex h-full w-full">
							{currentScreen === 'Dashboard' && <Dashboard />}
							{currentScreen === 'Conference' && <Conference />}
							{currentScreen === 'Waiting Lobby' && (
								<WaitingLobby roomId={roomId!} />
							)}
							{currentScreen === 'OutSide Lobby' && <OutsideLobby />}
						</div>
						<BottomNavigation />
					</div>
				</div>
			</div> */}

			<div className="flex h-full w-full">
				<Dashboard />
			</div>
		</>
	);
};

export default Home;
