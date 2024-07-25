import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

	console.log('Supabase Url-->', supabaseUrl);

	const supabase = createClient(supabaseUrl, supabaseKey);

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
		);
	}

	// Get the headers
	const headerPayload = headers();
	const svix_id = headerPayload.get('svix-id');
	const svix_timestamp = headerPayload.get('svix-timestamp');
	const svix_signature = headerPayload.get('svix-signature');

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Error occured -- no svix headers', {
			status: 400,
		});
	}

	// Get the body
	const payload = await request.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error occured', {
			status: 400,
		});
	}

	// Do something with the payload
	// For this guide, you simply log the payload to the console

	// const { id } = evt.data;
	const eventType = evt.type;

	// const { data, type } = payload;
	// const { id, email_addresses, first_name, last_name, image_url, username } =
	// 	data;

	// console.log('Type of Call-------------->', eventType);
	// console.log('This is DAta---------->', {
	// 	id,
	// 	email_addresses,
	// 	first_name,
	// 	last_name,
	// 	image_url,
	// 	username,
	// });

	try {
		if (eventType === 'user.created') {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			console.log('Type of Call-------------->', eventType);
			console.log('This is DAta---------->', {
				id,
				email_addresses,
				first_name,
				last_name,
				image_url,
			});

			const email = email_addresses[0] ? email_addresses[0].email_address : '';

			console.log('Initiate creation');

			const { data, error } = await supabase
				.from('User')
				.insert({
					id,
					email,
					first_name: first_name ? first_name : '',
					last_name: last_name ? last_name : '',
					image_url,
				})
				.select();

			console.log('User created Data--->', data);
			if (error) {
				console.log('User created Data Error--->', error);
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

		if (eventType === 'user.updated') {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			console.log('Type of Call-------------->', eventType);
			console.log('This is DAta---------->', {
				id,
				email_addresses,
				first_name,
				last_name,
				image_url,
			});
			console.log('Initiate Updating');
			const email = email_addresses[0] ? email_addresses[0].email_address : '';
			const { data, error } = await supabase
				.from('User')
				.update({
					email,
					// username,
					first_name,
					last_name,
					image_url,
				})
				.eq('id', id)
				.select();

			console.log('User updated successfully:', data);
			if (error) {
				console.log('User Updated Data Error--->', error);
				return NextResponse.json({ error: error.message }, { status: 500 });
			}
			return NextResponse.json(
				{
					success: true,
					message: 'Webhook received',
				},
				{ status: 200 }
			);
		}

		if (eventType === 'user.deleted') {
			const { id } = evt.data;
			console.log('Initated Delete', eventType);

			const response = await supabase.from('User').delete().eq('id', id);

			console.log('User Deleted status:', response);

			return NextResponse.json(
				{
					success: true,
					message: 'Webhook received',
				},
				{ status: 200 }
			);
		}

		// switch (eventType) {
		// 	case 'user.created': {
		// 		console.log('Type of Call-------------->', eventType);
		// 		console.log('This is DAta---------->', {
		// 			id,
		// 			email_addresses,
		// 			first_name,
		// 			last_name,
		// 			image_url,
		// 		});

		// 		const email = email_addresses[0]
		// 			? email_addresses[0].email_address
		// 			: '';

		// 		console.log('Initiate creation');

		// 		const { data, error } = await supabase
		// 			.from('User')
		// 			.insert({
		// 				id,
		// 				email,
		// 				first_name: first_name ? first_name : '',
		// 				last_name: last_name ? last_name : '',
		// 				image_url,
		// 			})
		// 			.select();

		// 		console.log('User created Data--->', data);
		// 		if (error) {
		// 			console.log('User created Data Error--->', error);
		// 			return NextResponse.json({ error: error.message }, { status: 500 });
		// 		}

		// 		console.log('User inserted successfully:', data);

		// 		return NextResponse.json(
		// 			{
		// 				success: true,
		// 				message: 'Webhook received',
		// 			},
		// 			{ status: 200 }
		// 		);
		// 	}

		// 	case 'user.updated': {
		// 		console.log('Type of Call-------------->', eventType);
		// 		console.log('This is DAta---------->', {
		// 			id,
		// 			email_addresses,
		// 			first_name,
		// 			last_name,
		// 			image_url,
		// 		});
		// 		console.log('Initiate Updating');
		// 		const email = email_addresses[0]
		// 			? email_addresses[0].email_address
		// 			: '';
		// 		const { data, error } = await supabase
		// 			.from('User')
		// 			.update({
		// 				email,
		// 				// username,
		// 				first_name,
		// 				last_name,
		// 				image_url,
		// 			})
		// 			.eq('id', id)
		// 			.select();

		// 		console.log('User updated successfully:', data);
		// 		if (error) {
		// 			console.log('User Updated Data Error--->', error);
		// 			return NextResponse.json({ error: error.message }, { status: 500 });
		// 		}
		// 		return NextResponse.json(
		// 			{
		// 				success: true,
		// 				message: 'Webhook received',
		// 			},
		// 			{ status: 200 }
		// 		);
		// 	}

		// 	case 'user.deleted': {
		// 		console.log('Initated Delete', type);

		// 		const response = await supabase.from('User').delete().eq('id', id);

		// 		console.log('User Deleted status:', response);

		// 		return NextResponse.json(
		// 			{
		// 				success: true,
		// 				message: 'Webhook received',
		// 			},
		// 			{ status: 200 }
		// 		);
		// 	}

		// 	default: {
		// 		console.log('no parameter hitted');
		// 	}
		// }
	} catch (error) {
		console.log('Unexpected error:', error);

		return NextResponse.json(
			{
				success: false,
				message: error,
			},
			{ status: 400 }
		);
	}

	// console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
	// console.log('Webhook body:', body);

	// return new Response('', { status: 200 });

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// const payload = await request.json();

	// try {

	// 	switch (type) {
	// 		case 'user.created': {
	// 			const email = email_addresses[0]
	// 				? email_addresses[0].email_address
	// 				: '';

	// 			console.log('Initiate creation');

	// 			const { data, error } = await supabase
	// 				.from('User')
	// 				.insert({
	// 					id,
	// 					email,
	// 					first_name: first_name ? first_name : '',
	// 					last_name: last_name ? last_name : '',
	// 					image_url,
	// 				})
	// 				.select();

	// 			console.log('User created Data--->', data);
	// 			if (error) {
	// 				console.log('User created Data Error--->', error);
	// 				return NextResponse.json({ error: error.message }, { status: 500 });
	// 			}

	// 			console.log('User inserted successfully:', data);

	// 			return NextResponse.json(
	// 				{
	// 					success: true,
	// 					message: 'Webhook received',
	// 				},
	// 				{ status: 200 }
	// 			);
	// 		}

	// 		case 'user.updated': {
	// 			console.log('Initiate Updating');
	// 			const email = email_addresses[0]
	// 				? email_addresses[0].email_address
	// 				: '';
	// 			const { data, error } = await supabase
	// 				.from('User')
	// 				.update({
	// 					email,
	// 					// username,
	// 					first_name,
	// 					last_name,
	// 					image_url,
	// 				})
	// 				.eq('id', id)
	// 				.select();

	// 			console.log('User updated successfully:', data);
	// 			if (error) {
	// 				console.log('User Updated Data Error--->', error);
	// 				return NextResponse.json({ error: error.message }, { status: 500 });
	// 			}
	// 			return NextResponse.json(
	// 				{
	// 					success: true,
	// 					message: 'Webhook received',
	// 				},
	// 				{ status: 200 }
	// 			);
	// 		}

	// 		case 'user.deleted': {
	// 			console.log('Initated Delete', type);

	// 			const response = await supabase.from('User').delete().eq('id', id);

	// 			console.log('User Deleted status:', response);

	// 			return NextResponse.json(
	// 				{
	// 					success: true,
	// 					message: 'Webhook received',
	// 				},
	// 				{ status: 200 }
	// 			);
	// 		}

	// 		default: {
	// 			console.log('no parameter hitted');
	// 		}
	// 	}
	// } catch (error) {
	// 	console.log('Unexpected error:', error);

	// 	return NextResponse.json(
	// 		{
	// 			success: false,
	// 			message: error,
	// 		},
	// 		{ status: 400 }
	// 	);
	// }
}
