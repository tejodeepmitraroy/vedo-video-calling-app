import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

const SignUpPage = () => {
	return (
		<>
			<div className="relative h-screen w-full lg:grid lg:grid-cols-2">
				<div className="flex items-center justify-center p-4 lg:min-h-[600px]">
					<SignUp path="/sign-up" signInUrl="/sign-in" />
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
		</>
	);
};

export default SignUpPage;
