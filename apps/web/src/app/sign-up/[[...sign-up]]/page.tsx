import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
	return (
		<>
			<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:h-screen">
				<div className="flex items-center justify-center py-12">
					<div className="mx-auto grid w-[350px] gap-6">
						<SignUp path="/sign-up" signInUrl="/sign-in" />
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
		</>
	);
}
