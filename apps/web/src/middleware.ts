import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher(['/', '/conference', '/rm(.*)']);

const isPublicRoute = createRouteMatcher([
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api(.*)',
	'/_next(.*)',
	'/favicon.ico',
	'/site.webmanifest',
]);

export default clerkMiddleware(
	async (auth, req) => {
		// Allow access to public routes
		if (isPublicRoute(req)) {
			return;
		}

		// Protect all other routes
		await auth.protect();
	}
	// {
	// 	signInUrl: '/sign-in',
	// 	signUpUrl: '/sign-up',
	// }
);

// export const config = {
// 	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
