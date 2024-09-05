require('dotenv').config(); // Variables are needed to run the server, which I shouldn't share

// Set the API url as a variable
const URL = 'https://api.intra.42.fr/v2';

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
				redirect_uri: 'https://retriever.moyai.one/'
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
function getData(token, url)
{
	// Send request using token
	return (fetch
	(
		url,
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

function getCampus(data)
{
	const campus = data.campus[0]?.id;
	if (!campus)
		throw (new Error(`Error: Couldn't resolve your campus`));

	return (campus);
}

function getOnCampus(token, campus, page)
{
	return (fetch
	(
		`${URL}/campus/${campus}/users?page[size]=100&page[number]=${page}`,
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
	}));
}

function getAllOnCampus(token, campus)
{
	console.log('Working on obtaining data... (this may take a while)');

	let A1 = [];
	let A2 = [];

	let Shi = [];
	let Fu = [];
	let Mi = [];

	let page = 1;
	const getNextPage = () =>
	{
		return (getOnCampus(token, campus, page)

		.then(usersPage =>
		{
			A1 = A1.concat(usersPage.filter(user => user.location && user.location.substring(0, 2) === 'a1'));
			A2 = A2.concat(usersPage.filter(user => user.location && user.location.substring(0, 2) === 'a2'));

			Shi = Shi.concat(usersPage.filter(user => user.location && user.location[0] === 's'));
			Fu = Fu.concat(usersPage.filter(user => user.location && user.location[0] === 'f'));
			Mi = Mi.concat(usersPage.filter(user => user.location && user.location[0] === 'm'));

			if (usersPage.length < 100)
				return ({A1, A2, Shi, Fu, Mi});

			page++;
			return (getNextPage());
		}));
	};

	return (getNextPage());
}

// Print user's data
function printAllData(data)
{
	console.log('\n      USER DATA');

	console.log(data);
}

// Print certain data of given userdata packet
function printUserData(data)
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
function handleRequest(request, response)
{
	// Fetch access token
	let token;
	getToken(request.query.code)

	// Fetch own user data
	.then(gotToken =>
	{
		console.log('Successfully retrieved access token');
		//console.log(`Successfully retrieved access token: ${gotToken}`);

		token = gotToken;

		return (getData(token, `${URL}/me`));
		//return (getData(token, `${URL}/users/lpeeters`));
	})

	.then(data =>
	{
		return (getCampus(data));
	})

	.then(campus =>
	{
		return (getAllOnCampus(token, campus));
	})

	// Print certain user data
	.then(({A1, A2, Shi, Fu, Mi}) =>
	{
		const FORMATTER = user => `<div style="display: flex; align-items: center;"><a href="https://profile.intra.42.fr/users/${user.login}" style="text-decoration: none; color: inherit;"><img src="${user.image.versions.micro}" alt="Profile picture" style="margin-right: 5px;" /></a><p style="font-family: 'Roboto', sans-serif; font-size: 12px;">${user.displayname} (${user.login}@${user.location})</p></div>`;

		const A1Formatted = A1.map(FORMATTER).join('');
		const A2Formatted = A2.map(FORMATTER).join('');
		const ShiFormatted = Shi.map(FORMATTER).join('');
		const FuFormatted = Fu.map(FORMATTER).join('');
		const MiFormatted = Mi.map(FORMATTER).join('');

		response.send(`<h2>Successfully Retrieved Data</h2>
					   <h3>You may now close this window.</h3><br>
					   <h5>On campus:</h5>
					   <h4>A1 (<span>${A1.length}</span>)</h4>
					   <pre>${A1Formatted}</pre><br>
					   <h4>A2 (<span>${A2.length}</span>)</h4>
					   <pre>${A2Formatted}</pre><br>
					   <h4>Shi (<span>${Shi.length}</span>)</h4>
					   <pre>${ShiFormatted}</pre><br>
					   <h4>Fu (<span>${Fu.length}</span>)</h4>
					   <pre>${FuFormatted}</pre><br>
					   <h4>Mi (<span>${Mi.length}</span>)</h4>
					   <pre>${MiFormatted}</pre>`);

		console.log(`\nOn campus\n
					 \nA1\n${A1Formatted}
					 \nA2\n${A2Formatted}
					 \nShi\n${ShiFormatted}
					 \nFu\n${FuFormatted}
					 \nMi\n${MiFormatted}`);
	})

	// Handle errors
	.catch (error =>
	{
		response.status(500).send(`Internal Server ${error}`);
		console.error(error);
	});
}

const express = require('express');
const app = express();

app.get('', handleRequest);

const server = app.listen(3000, () =>
{
	console.log('Server running at https://retriever.moyai.one/');
});
