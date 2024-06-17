import React from 'react';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	useAuth,
	UserButton,
} from '@clerk/nextjs';

const UserProfile = () => {
	return (
		<>
			<SignedOut>
				<SignInButton />
			</SignedOut>
			<SignedIn>
				<UserButton afterSignOutUrl="/sign-in" showName />
			</SignedIn>
		</>
	);
};

export default UserProfile;
