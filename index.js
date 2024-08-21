require('dotenv').config();

// Fetch access token needed for further data requests
function getToken()
{
	// Send request with ID and KEY
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

	// Check response
	.then(response =>
	{
		if (!response.ok)
			throw (new Error(`HTTP error: Status: ${response.status}`));

		return (response.json());
	})

	// Extract access token
	.then(data =>
		data.access_token)

	// Check if nothing went wrong
	.catch(error =>
	{
		console.error('Error: Access token post request:', error.message);
		return (null);
	}));
}

// Fetch data from a given user
function getData(token, login)
{
	// Send request using token
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

	// Check response
	.then(response =>
	{
		if (!response.ok)
			throw (new Error(`HTTP error: Status: ${response.status}`));

		return (response.json());
	})

	// Check if nothing went wrong
	.catch(error =>
	{
		console.error('Error: Fetching user data:', error.message);
		return (null);
	}));
}

// Print certain data of given userdata packet
function printAllData(data)
{
	console.log('\n      USER DATA');

	// Print using table for a neat layout
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

// Fetch access token
getToken().then(token =>
{
	// Check token
	if (!token)
	{
		console.error('Error: retrieving access token');
		process.exit(1);
	}

	// Success
	console.log('Successfully retrieved access token');
	//console.log('Successfully retrieved access token:', token);

	// Fetch a given user's data
	return (getData(token, 'lpeeters'));
})

// Print user's data
.then(data =>
{
	// Check data
	if (!data)
	{
		console.error('Error: retrieving data')
		process.exit(1);
	}

	// Print certain data of user
	printAllData(data);
});
