import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import {
	Bell,
	CalendarDays,
	Home,
	MessagesSquare,
	Phone,
	Video,
} from 'lucide-react';
import { Badge } from './ui/badge';

const Navbar = () => {
	return (
		<div className="hidden border-r bg-muted/40 md:block">
			<div className="flex h-full max-h-screen flex-col gap-2">
				<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
					<Link href="/" className="flex items-center gap-2 font-semibold">
						<Video className="h-6 w-6" />
						{/* <Package2 className="h-6 w-6" /> */}
						<span className="font-bold">V.E.D.O</span>
					</Link>
					<Button variant="outline" size="icon" className="ml-auto h-8 w-8">
						<Bell className="h-4 w-4" />
						<span className="sr-only">Toggle notifications</span>
					</Button>
				</div>
				<div className="flex-1">
					<nav className="grid items-start px-2 font-medium lg:px-4">
						<Link
							href="/"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
						>
							<Home className="h-4 w-4" />
							Dashboard
						</Link>
						<Link
							href="/room"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
						>
							<Phone className="h-4 w-4" />
							Room
						</Link>
						{/* <Link
							href="#"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
						>
							<CalendarDays className="h-4 w-4" />
							Schedule
							<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
								6
							</Badge>
						</Link> */}
						{/* <Link
							href="#"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
						>
							<MessagesSquare className="h-4 w-4" />
							Message
						</Link> */}
					</nav>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
