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
	)

	.then(response =>
	{
		if (!response.ok)
			throw (new Error(`HTTP error: Status: ${response.status}`));

		return (response.json());
	})

	.then(data =>
		data.access_token)

	.catch(error =>
	{
		console.error('Error: Access token post request:', error.message);
		return (null);
	}));
}

function getData(token, login)
{
	return (fetch
	(
		`https://api.intra.42.fr/v2/users/${login}`,
		{
			headers:
			{
				Authorization: `Bearer ${token}`,
			},
		}
	)

	.then(response =>
	{
		if (!response.ok)
			throw (new Error(`HTTP error: Status: ${response.status}`));

		return (response.json());
	})

	.catch(error =>
	{
		console.error('Error: Fetching user data:', error.message);
		return (null);
	}));
}

function printAllData(data)
{
	console.log('\n      USER DATA');

	console.table
	({
		ID: data.id,
		Login: data.login,
		Email: data.email,
		Name: data.displayname,
		Level: data.cursus_users[0].level,
		Points: data.correction_point,
		Money: data.wallet,
		Number: data.phone,
		Campus: data.campus[0].name
	});
}

getToken().then(token =>
{
	if (!token)
	{
		console.error('Error: retrieving access token');
		process.exit(1);
	}

	console.log('Successfully retrieved access token');
	//console.log('Successfully retrieved access token:', token);

	return (getData(token, 'lpeeters'));
})

.then(data =>
{
	if (!data)
	{
		console.error('Error: retrieving data')
		process.exit(1);
	}

	printAllData(data);
});
