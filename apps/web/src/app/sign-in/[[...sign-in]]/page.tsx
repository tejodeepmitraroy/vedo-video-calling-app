import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
	return (
		<div className="relative h-screen w-full lg:grid lg:grid-cols-2">
			<div className="w-full h-full flex items-center justify-center p-4">
				<SignIn path="/sign-in" signUpUrl="/sign-up" />
			</div>
			<div className="hidden bg-muted lg:block">
				<Image
					src="/login-bg.jpg"
					alt="Image"
					width="1920"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
};

export default SignInPage;
