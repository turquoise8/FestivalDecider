import type { RequestHandler } from './$types';
import { CLIENT_SECRET, CLIENT_ID } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { refreshToken } = await request.json();

	if (refreshToken === null) {
		return new Response(
			JSON.stringify({
				message: 'No refresh token provided',
				error: true
			})
		);
	} else {
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				refresh_token: refreshToken,
				grant_type: 'refresh_token'
			},
			headers: {
				Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
			},
			json: true
		};

		try {
			const response = await fetch(authOptions.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: authOptions.headers.Authorization
				},
				body: new URLSearchParams(authOptions.form)
			});

			const data = await response.json();

			return new Response(
				JSON.stringify({
					data
				})
			);
		} catch (error) {
			return new Response(
				JSON.stringify({
					message: 'Error',
					error: true
				})
			);
		}
	}
};
