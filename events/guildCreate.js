module.exports = {
	name: "guildCreate",
	once: false,
	disabled: false, // Change to 'true' to disable this event.
	async execute(param, ...args) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const guild = args[0];
		const config = param.config;
		const owner = param.client.users.fetch(config.botOwnerID);

		if(owner) {
			const newServerEmbed = param.getEmbed.execute(param, guild, config.info_color, "Joined a Guild", `[**${guild.name}**] (\`${guild.id}\`)`);
			owner.send(newServerEmbed);
		}
		console.log(`> Joined [${guild.name}] guild.`);
	},
};