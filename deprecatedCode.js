/* Unless following GDPR, will not log anything, this was only ever used for debugging during testing and only produced publicly available data. */

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

// Write raw data to the log
try
{
	fs.writeFileSync
	(
		`/srv/retriever/log`,

		`On campus:\n
		\nA1\n\n${JSON.stringify(A1, null, 2)}
		\nA2\n\n${JSON.stringify(A2, null, 2)}
		\nShi\n\n${JSON.stringify(Shi, null, 2)}
		\nFu\n\n${JSON.stringify(Fu, null, 2)}
		\nMi\n\n${JSON.stringify(Mi, null, 2)}`
	);
}

// Handle errors
catch (error)
{
	console.error(error);
}

console.log('Successfully retrieved access token');

/* NOW USING NGINX REVERSE PROXY + STATIC SSL OVER DOCKER CLUSTER TO SET UP HTTPS */

// Libraries needed
const https = require('https');

// Setup the https protocol
https.createServer
({
	cert: fs.readFileSync('/srv/certificate.pem'),
	key: fs.readFileSync('/srv/privatekey.pem')
},

// Listen on the redirected port (safety reasons)
app).listen(8443, () =>
{
	console.log(`Server running at ${URI}`);
});
