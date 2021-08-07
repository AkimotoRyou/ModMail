module.exports = {
	name: "leave",
	aliases: [],
	level: "Owner",
	guildOnly: false,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const locale = param.locale;

		const serverID = args.shift();
		const getServer = await client.guilds.fetch(serverID);
		const noGuild = locale.noGuild(serverID);
		const leaveCmd = locale.leaveCmd(getServer);

		const notFoundEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, noGuild);

		if(getServer) {
			const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, leaveCmd);
			console.log(`> Leaving [${getServer.name}] guild.`);
			return getServer.leave().then(replyChannel.send(successEmbed));
		}
		else {
			console.log(`> Can't fetch ${serverID} guild.`);
			return replyChannel.send(notFoundEmbed);
		}
	},
};
