module.exports = {
	name: "isMember",
	async execute(param, userID) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const mainServerID = param.config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const isMember = await mainServer.members.fetch(userID);

		if(isMember) {
			return true;
		}
		else {
			return false;
		}
	},
};
