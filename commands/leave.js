module.exports = {
	name: "leave",
	aliases: false,
	level: "Owner",
	guildOnly: false,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<guildID>"],
	description: "Leave a guild (server).",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;

		const serverID = args.shift();
		const getServer = await client.guilds.fetch(serverID);

		const notFoundEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `Can't find guild with ID (\`${serverID}\`) in my collection.`);

		if(getServer) {
			const successEmbed = getEmbed.execute(param, "", config.info_color, "Leaving", `Leaving [**${getServer.name}**] (\`${getServer.id}\`) guild.`);
			console.log(`> Leaving [${getServer.name}] guild.`);
			return getServer.leave().then(replyChannel.send(successEmbed));
		}
		else {
			console.log(`> Can't fetch ${serverID} guild.`);
			return replyChannel.send(notFoundEmbed);
		}
	},
};
