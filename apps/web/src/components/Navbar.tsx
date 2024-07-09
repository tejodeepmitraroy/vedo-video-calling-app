import React from 'react';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Button } from './ui/button';
// import {
// 	Badge,
// 	Bird,
// 	Home,
// 	LineChart,
// 	Menu,
// 	Package,
// 	Package2,
// 	PanelLeft,
// 	Phone,
// 	Rabbit,
// 	Search,
// 	Settings,
// 	Share,
// 	ShoppingCart,
// 	Turtle,
// 	Users,
// 	Users2,
// } from 'lucide-react';
// import Link from 'next/link';
// import UserProfile from './UserProfile';
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
// import { Input } from './ui/input';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
// import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Textarea } from './ui/textarea';

const NavBar = ({ heading }: { heading?:string }) => {
	return (
		<header className="sticky top-0 z-10 flex h-[60px] items-center gap-1 border-b bg-background px-4">
			<h1 className="text-lg font-semibold md:text-2xl">{heading}</h1>
			{/* <Drawer>
				<DrawerTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Settings className="size-4" />
						<span className="sr-only">Settings</span>
					</Button>
				</DrawerTrigger>
				<DrawerContent className="max-h-[80vh]">
					<DrawerHeader>
						<DrawerTitle>Configuration</DrawerTitle>
						<DrawerDescription>
							Configure the settings for the model and messages.
						</DrawerDescription>
					</DrawerHeader>
					<form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
						<fieldset className="grid gap-6 rounded-lg border p-4">
							<legend className="-ml-1 px-1 text-sm font-medium">
								Settings
							</legend>
							<div className="grid gap-3">
								<Label htmlFor="model">Model</Label>
								<Select>
									<SelectTrigger
										id="model"
										className="items-start [&_[data-description]]:hidden"
									>
										<SelectValue placeholder="Select a model" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="genesis">
											<div className="flex items-start gap-3 text-muted-foreground">
												<Rabbit className="size-5" />
												<div className="grid gap-0.5">
													<p>
														Neural{' '}
														<span className="font-medium text-foreground">
															Genesis
														</span>
													</p>
													<p className="text-xs" data-description>
														Our fastest model for general use cases.
													</p>
												</div>
											</div>
										</SelectItem>
										<SelectItem value="explorer">
											<div className="flex items-start gap-3 text-muted-foreground">
												<Bird className="size-5" />
												<div className="grid gap-0.5">
													<p>
														Neural{' '}
														<span className="font-medium text-foreground">
															Explorer
														</span>
													</p>
													<p className="text-xs" data-description>
														Performance and speed for efficiency.
													</p>
												</div>
											</div>
										</SelectItem>
										<SelectItem value="quantum">
											<div className="flex items-start gap-3 text-muted-foreground">
												<Turtle className="size-5" />
												<div className="grid gap-0.5">
													<p>
														Neural{' '}
														<span className="font-medium text-foreground">
															Quantum
														</span>
													</p>
													<p className="text-xs" data-description>
														The most powerful model for complex computations.
													</p>
												</div>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="temperature">Temperature</Label>
								<Input id="temperature" type="number" placeholder="0.4" />
							</div>
							<div className="grid gap-3">
								<Label htmlFor="top-p">Top P</Label>
								<Input id="top-p" type="number" placeholder="0.7" />
							</div>
							<div className="grid gap-3">
								<Label htmlFor="top-k">Top K</Label>
								<Input id="top-k" type="number" placeholder="0.0" />
							</div>
						</fieldset>
						<fieldset className="grid gap-6 rounded-lg border p-4">
							<legend className="-ml-1 px-1 text-sm font-medium">
								Messages
							</legend>
							<div className="grid gap-3">
								<Label htmlFor="role">Role</Label>
								<Select defaultValue="system">
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="system">System</SelectItem>
										<SelectItem value="user">User</SelectItem>
										<SelectItem value="assistant">Assistant</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="content">Content</Label>
								<Textarea id="content" placeholder="You are a..." />
							</div>
						</fieldset>
					</form>
				</DrawerContent>
			</Drawer> */}
			{/* <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm">
				<Share className="size-3.5" />
				Share
			</Button> */}
		</header>
	);
};

export default NavBar;
