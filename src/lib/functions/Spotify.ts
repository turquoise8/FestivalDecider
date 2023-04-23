export const getSpotifyToken = async (code: string, state: string): Promise<string> => {
	const res = await fetch('/api/access', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			code,
			state
		})
	});
	const data = await res.json();
	localStorage.setItem('refreshToken', data.data.refresh_token);
	return data.data.access_token;
};

export const getSpotifyAccessTokenFromRefreshToken = async (): Promise<string> => {
	const res = await fetch('/api/refresh', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			refreshToken: localStorage.getItem('refreshToken')
		})
	});
	const data = await res.json();
	return data.data.access_token;
};
