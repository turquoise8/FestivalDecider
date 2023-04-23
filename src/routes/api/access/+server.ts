import type { RequestHandler } from '../$types';
import { CLIENT_SECRET, CLIENT_ID } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	const { code, state } = await request.json();

	if (state === null) {
		return new Response(
			JSON.stringify({
				message: 'No state provided',
				error: true
			})
		);
	} else {
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: PUBLIC_BASE_URL + '/lineup',
				grant_type: 'authorization_code'
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
