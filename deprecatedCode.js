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

/* NOW USING CLOUDFLARE TUNNELING TO SET UP HTTPS */

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
