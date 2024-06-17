import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
	return (
		<div className="relative min-h-screen w-full lg:grid lg:grid-cols-2">
			<div className="flex items-center justify-center py-12">
				<div className="relative mx-auto grid w-[350px] gap-6">
					<SignIn path="/sign-in" signUpUrl="/sign-up" />
				</div>
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
}
