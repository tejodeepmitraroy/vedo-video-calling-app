'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from './ui/button';

export const SignOutButton = () => {
	const { signOut } = useClerk();

	return (
		<Button
			variant={'destructive'}
			onClick={() => signOut({ redirectUrl: '/sign-in' })}
		>
			Sign out
		</Button>
	);
};
