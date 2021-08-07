module.exports = {
	name: "ping",
	aliases: [],
	level: "User",
	guildOnly: false,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const getEmbed = param.getEmbed;
		const ping = param.locale.ping;

		const pingEmbed = getEmbed.execute(param, "", config.info_color, ping.title, ping.msg);

		replyChannel.send(pingEmbed).then((msg) => {
			const editEmbed = getEmbed.execute(param, "", config.info_color, ping.title, `**${ping.response}** : **${msg.createdTimestamp - message.createdTimestamp}** ms\n**${ping.latency}** : **${Math.round(param.client.ws.ping)}** ms`);
			msg.edit(editEmbed);
		});
	},
};
