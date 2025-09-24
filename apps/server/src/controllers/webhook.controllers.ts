import { verifyWebhook } from '@clerk/express/webhooks';
import { Request, Response } from 'express';
import prisma from '../lib/prismaClient';

export const handleClerkWebhook = async (
	request: Request,
	response: Response
) => {
	try {
		const evt = await verifyWebhook(request);

		// Do something with payload
		// For this guide, log payload to console
		const { id } = evt.data;
		const eventType = evt.type;
		console.log(
			`Received webhook with ID ${id} and event type of ${eventType}`
		);
		console.log('Webhook payload:', evt.data);

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

				const email = email_addresses[0]
					? email_addresses[0].email_address
					: '';

				console.log('Initiate creation');

				const userData = await prisma.user.create({
					data: {
						id,
						firstName: first_name ?? '',
						lastName: last_name ?? '',
						email,
						imageUrl: image_url,
					},
				});

				console.log('User inserted successfully:', userData);

				return response.status(200).json({
					success: true,
					message: 'Webhook received',
				});
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
				const email = email_addresses[0]
					? email_addresses[0].email_address
					: '';
				const updatedUser = await prisma.user.update({
					where: { id },
					data: {
						email,
						firstName: first_name ?? '',
						lastName: last_name ?? '',
						imageUrl: image_url,
					},
				});

				console.log('User updated successfully:', updatedUser);
				return response.status(200).json({
					success: true,
					message: 'Webhook received',
				});
			}

			if (eventType === 'user.deleted') {
				const { id } = evt.data;
				console.log('Initated Delete', eventType);

				const deletedUser = await prisma.user.delete({
					where: { id },
				});

				console.log('User Deleted:', deletedUser);

				return response.status(200).json({
					success: true,
					message: 'Webhook received',
				});
			}
		} catch (error) {
			console.log('Unexpected error:', error);

			return response.status(400).json({
				success: false,
				message: (error as Error)?.message ?? 'Unknown error',
			});
		}

		return response.send('Webhook received');
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return response.status(400).send('Error verifying webhook');
	}
};
