import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const UserProfile = () => {
	return (
		<>
			<SignedOut>
				<SignInButton />
			</SignedOut>
			<SignedIn>
				<UserButton afterSignOutUrl="/sign-in" />
			</SignedIn>
		</>
	);
};

export default UserProfile;
