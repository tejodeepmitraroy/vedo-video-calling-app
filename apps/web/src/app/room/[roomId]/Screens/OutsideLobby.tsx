
import NavBar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import React from 'react'

const OutsideLobby = () => {
  return (
    <div className="grid h-screen w-full pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar />
				{/* <BottomNavigation/> */}
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					<div className="flex flex-1 items-start justify-start rounded-lg shadow-sm">
						<div className="flex w-full flex-col gap-5 rounded-lg border border-dashed p-5 shadow-sm md:w-auto">
							<div className="flex items-center">
								<h2 className="text-xl font-semibold tracking-tight">
									Quick Settings
								</h2>
							</div>
							<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
								{/* <form
									onSubmit={(event) => handleEnterRoom(event)}
									className="flex items-center justify-center gap-3 rounded-lg border border-dashed p-2 text-center shadow-sm"
								>
									<Input
										onChange={(event) => setRoomId(event.target.value)}
										value={roomId}
										className="h-14"
										placeholder="Enter Room Code "
									/>
									<Button type="submit" className="h-14">
										Join
									</Button>
								</form> */}
								<Button
									variant={'outline'}
									// onClick={() => handleInstantCreateCall()}
									className="flex items-center justify-center gap-3 border border-dashed p-10 text-center shadow-sm"
								>
							
									Create a 1:1 Instant Room
								</Button>

								{/* <ScheduleCallForm /> */}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
  
}

export default OutsideLobby
