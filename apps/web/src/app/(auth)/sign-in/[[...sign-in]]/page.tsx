import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
	return (
		<div className="relative flex h-screen w-full">
			<div className="bg-primary flex h-full w-full items-center justify-center p-4 lg:w-1/2">
				<SignIn
				//  path="/sign-in" signUpUrl="/sign-up"
				/>
			</div>
			<div className="bg-muted hidden w-1/2 lg:block">
				<Image
					src="/login-bg.jpg"
					alt="Image"
					width="960"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
};

export default SignInPage;
