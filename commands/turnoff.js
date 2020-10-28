module.exports = {
	name: 'turnoff',
	aliases: ['shutdown', 'stop'],
	level: 'Owner',
	guildOnly: true,
	args: false,
	usage: false,
	description: 'Turn off the bot.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const getEmbed = param.getEmbed;

		const successEmbed = getEmbed.execute(param, config.info_color, "Turning Off", `**Turning off in** : **${Math.round(param.client.ws.ping)}** ms`);
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don't have permission to run this command.");

		if (message.author.id === config.botOwnerID) {
			// bot owner
			console.log("Turning Off...");
			message.channel.send(successEmbed).then(() => {
				process.exit(1);
			});
		} else {
			// Not bot owner
			return message.channel.send(noPermEmbed);
		}
	}
};
