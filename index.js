require('dotenv').config(); // Variables are needed to run the server, which I shouldn't share

// Fetch access token needed for further data requests
function getToken(code)
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
				grant_type: 'authorization_code',
				client_id: process.env.id,
				client_secret: process.env.secret,
				code: code,
				redirect_uri: 'http://localhost:3000/callback'
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

	// Handle errors
	.catch (error =>
	{
		console.error('Error: Access token post request:', error.message);
		throw (error);
	}));
}

// Fetch data from a given user
function getOwnData(token, login)
{
	// Send request using token
	return (fetch
	(
		'https://api.intra.42.fr/v2/me',
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

	// Handle errors
	.catch (error =>
	{
		console.error('Error: Fetching own user data:', error.message);
		throw (error);
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

	// Handle errors
	.catch (error =>
	{
		console.error('Error: Fetching user data:', error.message);
		throw (error);
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

// Handle user requests through browser
function handleCallback(request, response)
{
	// Fetch access token
	getToken(request.query.code)

	// Fetch own user data
	.then(token =>
	{
		console.log('Successfully retrieved access token');

		return (getOwnData(token));
	})

	// Print certain user data
	.then(data =>
	{
		response.send('<h1>Successfully Retrieved User Data</h1><br><p>You may now close this window.</p>');
		printAllData(data);
	})

	// Handle errors
	.catch (error =>
	{
		response.status(500).send('Internal Server Error');
		process.exitCode = 1;
	});

	// Close the server
	server.close();
}

const express = require('express');
const app = express();

app.get('/callback', handleCallback);

const server = app.listen(3000, () =>
{
	console.log('Server running locally');
});
