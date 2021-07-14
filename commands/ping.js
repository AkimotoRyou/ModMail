module.exports = {
	name: "ping",
	aliases: false,
	level: "User",
	guildOnly: false,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: false,
	description: "Calculate bot latency.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const getEmbed = param.getEmbed;

		const pingEmbed = getEmbed.execute(param, "", config.info_color, "Pong", "Ping?");

		replyChannel.send(pingEmbed).then((msg) => {
			const editEmbed = getEmbed.execute(param, "", config.info_color, "Pong", `**Response time** : **${msg.createdTimestamp - message.createdTimestamp}** ms\n**API latency** : **${Math.round(param.client.ws.ping)}** ms`);
			msg.edit(editEmbed);
		});
	},
};
