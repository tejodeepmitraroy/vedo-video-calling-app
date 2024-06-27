import supabase from '@/lib/supabaseClient';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	const payload = await request.json();

	const { data, type } = payload;
	const { id, email_addresses, first_name, last_name, image_url, username } =
		data;

	console.log(payload);

	console.log('Type of Call-------------->', type);
	console.log('This is DAta---------->', {
		id,
		email_addresses,
		first_name,
		last_name,
		image_url,
		username,
	});
	const email = email_addresses[0] ? email_addresses[0].email_address : '';

	try {
		if (type === 'user.created') {
			const { data, error } = await supabase
				.from('User')
				.insert({
					clerkId: id,
					email,
					username: username ? username : '',
					first_name: first_name ? first_name : '',
					last_name: last_name ? last_name : '',
					image_url,
				})
				.select();
			if (error) {
				return NextResponse.json({ error: error.message }, { status: 500 });
			}

			console.log('User inserted successfully:', data);

			return NextResponse.json(
				{
					success: true,
					message: 'Webhook received',
				},
				{ status: 200 }
			);
		}

		if (type === 'user.updated') {
			const { data, error } = await supabase
				.from('User')
				.update({
					clerkId: id,
					email,
					username,
					first_name,
					last_name,
					image_url,
				})
				.eq('id', id)
				.select();

			console.log('User updated successfully:', data);
			return NextResponse.json(
				{
					success: true,
					message: 'Webhook received',
				},
				{ status: 200 }
			);
		}

		if (type === 'user.deleted') {
			console.log('Initated Delete', type);

			const response = await supabase.from('User').delete().eq('clerkId', id);

			console.log('User Deleted successfully:', response);
			return NextResponse.json(
				{
					success: true,
					message: 'Webhook received',
				},
				{ status: 200 }
			);
		}

		// switch (type) {
		// 	case 'user.created':
		// 		const email = email_addresses[0]
		// 			? email_addresses[0].email_address
		// 			: '';

		// 		const { error } = await supabase.from('User').insert({
		// 			clerkId: id,
		// 			email,
		// 			username: username ? username : '',
		// 			first_name: first_name ? first_name : '',
		// 			last_name: last_name ? last_name : '',
		// 			image_url,
		// 		});
		// 		if (error) {
		// 			return NextResponse.json({ error: error.message }, { status: 500 });
		// 		}

		// 		console.log('User inserted successfully:', user);

		// 		return NextResponse.json(
		// 			{
		// 				success: true,
		// 				message: 'Webhook received',
		// 			},
		// 			{ status: 200 }
		// 		);

		// 	case 'user.updated':
		// 		const { error } = await supabase
		// 			.from('User')
		// 			.update({
		// 				clerkId: id,
		// 				email,
		// 				username,
		// 				first_name,
		// 				last_name,
		// 				image_url,
		// 			})
		// 			.eq('id', id)
		// 			.select();

		// 		console.log('User updated successfully:');
		// 		return NextResponse.json(
		// 			{
		// 				success: true,
		// 				message: 'Webhook received',
		// 			},
		// 			{ status: 200 }
		// 		);
		// 	case 'user.deleted':
		// 		console.log('Initated Delete', type);

		// 		const response = await supabase.from('User').delete().eq('clerkId', id);

		// 		console.log('User Deleted successfully:', response);
		// 		return NextResponse.json(
		// 			{
		// 				success: true,
		// 				message: 'Webhook received',
		// 			},
		// 			{ status: 200 }
		// 		);

		// 	default:
		// 		console.log('no parameter hitted');
		// }
	} catch (error) {
		console.log('Unexpected error:', error);

		return NextResponse.json(
			{
				success: true,
				message: 'Webhook received',
			},
			{ status: 400 }
		);
	}
}
