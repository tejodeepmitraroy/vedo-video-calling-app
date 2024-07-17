import { Request } from 'express';

interface ClerkUser {
	userId: string;
	firstName: string;
	lastName: string;
	emailAddresses: { id: string; emailAddress: string }[];
	// Add other Clerk user properties if needed
}

interface AuthenticatedRequest extends Request {
	auth?: WithAuthProp<ClerkUser>;
}
