module.exports = {
	name: "guilds",
	aliases: ["servers", "serverlist"],
	level: "Admin",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const locale = param.locale;

		const guildList = client.guilds.cache.map(guild => `[**${guild.name}**] (\`${guild.id}\`)`).join("\n") || locale.emptyList;
		const listEmbed = getEmbed.execute(param, "", config.info_color, locale.guildList, guildList);

		return replyChannel.send(listEmbed);
	},
};
