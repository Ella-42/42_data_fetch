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
