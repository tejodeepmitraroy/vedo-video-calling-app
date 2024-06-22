"use client"
import React from 'react'
import {
	Bell,
	LineChart,
	Home,
	Menu,
	Package,
	Package2,
	ShoppingCart,
	Users,
	Video,
	MessagesSquare,
	Phone,
	Settings,
	CalendarDays,
	Plus,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from './ui/button';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { UserProfile } from '@clerk/nextjs';

const TopSection = () => {
  return (
		<header className="flex h-14 items-center justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col">
					<nav className="grid gap-2 text-lg font-medium">
						<Link
							href="#"
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<Package2 className="h-6 w-6" />
							<span className="sr-only">Acme Inc</span>
						</Link>
						<Link
							href="#"
							className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<Home className="h-5 w-5" />
							Dashboard
						</Link>
						<Link
							href="#"
							className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
						>
							<ShoppingCart className="h-5 w-5" />
							Orders
							<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
								6
							</Badge>
						</Link>
						<Link
							href="#"
							className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<Package className="h-5 w-5" />
							Products
						</Link>
						<Link
							href="#"
							className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<Users className="h-5 w-5" />
							Customers
						</Link>
						<Link
							href="#"
							className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<LineChart className="h-5 w-5" />
							Analytics
						</Link>
					</nav>
					
				</SheetContent>
			</Sheet>
			
			<UserProfile />
		</header>
	);
}

export default TopSection
