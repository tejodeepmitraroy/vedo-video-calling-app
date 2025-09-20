import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
	'/',
	'/conference',
	'/rm',
	'/rm/',
]);

export default clerkMiddleware(
	async (auth, req) => {
		if (isProtectedRoute(req)) await auth.protect();
	},
	{
		signInUrl: '/sign-in',
		signUpUrl: '/sign-up',
	}
);

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
