import { Button } from '@/components/ui/button';
import React from 'react';

const OutsideLobby = () => {
	return (
		<div className="flex flex-1 items-start justify-start rounded-lg shadow-sm">
			<div className="flex w-full flex-col gap-5 rounded-lg border border-dashed p-5 shadow-sm md:w-auto">
				<div className="flex items-center">
					<h2 className="text-xl font-semibold tracking-tight">
						This is OutSide
					
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
	);
};

export default OutsideLobby;
