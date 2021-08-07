module.exports = {
	name: "ready",
	once: false,
	disabled: false, // Change to 'true' to disable this event.
	async execute(param) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);
		console.log(`> Logged in as ${param.client.user.tag}.`);

		await param.configSync.execute(param);
	},
};