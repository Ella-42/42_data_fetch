require('dotenv').config();

function getToken()
{
	return (fetch
	(
		'https://api.intra.42.fr/oauth/token',
		{
			method:
				'POST',

			headers:
			{
				'Content-Type': 'application/json',
			},

			body: JSON.stringify
			({
				grant_type: 'client_credentials',
				client_id: process.env.id,
				client_secret: process.env.secret,
			}),
		}
	))

	.then(response =>
	{
		if (!response.ok)
			throw (new Error(`HTTP error: Status: ${response.status}`));

		return (response.json());
	})

	.then(data =>
		data.access_token)

	.catch(error =>
		console.error('Error: Access token post request:', error.message) || null);
}

getToken().then(token =>
{
	if (!token)
	{
		console.error('Error: retrieving access token');
		process.exit(1);
	}

	console.log('Successfully retrieved access token:', token);
});
