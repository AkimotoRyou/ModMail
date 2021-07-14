module.exports = {
	name: "guilds",
	aliases: ["servers", "serverlist"],
	level: "Admin",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: false,
	description: "List of guilds (servers) that have this bot.",
	note: "If [mainServerID] and/or [threadServerID] config isn't empty, only administrator in that server can use this command.",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;

		const guildList = client.guilds.cache.map(guild => `[**${guild.name}**] (\`${guild.id}\`)`).join("\n") || "This bot hasn't joined any guild yet.";
		const listEmbed = getEmbed.execute(param, "", config.info_color, "Guilds", guildList);

		return replyChannel.send(listEmbed);
	},
};
