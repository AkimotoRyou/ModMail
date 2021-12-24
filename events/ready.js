module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "ready",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	disabled: false,
	once: true,
	async execute(param, client) {
		console.log(`[Ready] Logged in as ${client.user.tag}.`);

		// Delete database data ~["For Debugging Purpose"]~.
		// await param.DB.empty();

		// Syncing config with database.
		await param.dbSync.execute(param);
	},
};
