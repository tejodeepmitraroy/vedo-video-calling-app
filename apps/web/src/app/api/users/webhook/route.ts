import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
	const payload = await request.json();
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

	console.log('Supabase Url-->', supabaseUrl);

	const supabase = createClient(supabaseUrl, supabaseKey);

	const { data, type } = payload;
	const { id, email_addresses, first_name, last_name, image_url, username } =
		data;

	console.log('Type of Call-------------->', type);
	console.log('This is DAta---------->', {
		id,
		email_addresses,
		first_name,
		last_name,
		image_url,
		username,
	});

	try {
		// if (type === 'user.created') {
		// 	const email = email_addresses[0] ? email_addresses[0].email_address : '';
		// 	console.log('Initiate creation');

		// 	const { data, error } = await supabase
		// 		.from('User')
		// 		.insert({
		// 			id,
		// 			email,
		// 			// username: username ? username : '',
		// 			first_name: first_name ? first_name : '',
		// 			last_name: last_name ? last_name : '',
		// 			image_url,
		// 			// updated_at,
		// 		})
		// 		.select();

		// 	console.log('User created Data--->', data);
		// 	if (error) {
		// 		console.log('User created Data Error--->', error);
		// 		return NextResponse.json({ error: error.message }, { status: 500 });
		// 	}

		// 	console.log('User inserted successfully:', data);

		// 	return NextResponse.json(
		// 		{
		// 			success: true,
		// 			message: 'Webhook received',
		// 		},
		// 		{ status: 200 }
		// 	);
		// } else if (type === 'user.updated') {
		// 	console.log('Initiate Updating');
		// 	const email = email_addresses[0] ? email_addresses[0].email_address : '';
		// 	const { data, error } = await supabase
		// 		.from('User')
		// 		.update({
		// 			email,
		// 			// username,
		// 			first_name,
		// 			last_name,
		// 			image_url,
		// 		})
		// 		.eq('id', id)
		// 		.select();

		// 	console.log('User updated successfully:', data);
		// 	if (error) {
		// 		console.log('User Updated Data Error--->', error);
		// 		return NextResponse.json({ error: error.message }, { status: 500 });
		// 	}
		// 	return NextResponse.json(
		// 		{
		// 			success: true,
		// 			message: 'Webhook received',
		// 		},
		// 		{ status: 200 }
		// 	);
		// } else if (type === 'user.deleted') {
		// 	console.log('Initated Delete', type);

		// 	const response = await supabase.from('User').delete().eq('id', id);

		// 	console.log('User Deleted status:', response);

		// 	return NextResponse.json(
		// 		{
		// 			success: true,
		// 			message: 'Webhook received',
		// 		},
		// 		{ status: 200 }
		// 	);
		// }

		switch (type) {
			case 'user.created': {
				const email = email_addresses[0]
					? email_addresses[0].email_address
					: '';

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

			case 'user.updated': {
				console.log('Initiate Updating');
				const email = email_addresses[0]
					? email_addresses[0].email_address
					: '';
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

			case 'user.deleted': {
				console.log('Initated Delete', type);

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

			default: {
				console.log('no parameter hitted');
			}
		}
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
}
