module.exports = {
	name: "turnoff",
	aliases: ["shutdown", "stop"],
	level: "Owner",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: false,
	description: "Turn off the bot.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const process = param.process;
		const config = param.config;
		const getEmbed = param.getEmbed;

		const successEmbed = getEmbed.execute(param, "", config.info_color, "Turning Off", `**Turning off in** : **${Math.round(param.client.ws.ping)}** ms`);

		console.log(">>> Turning Off <<<");
		replyChannel.send(successEmbed).then(() => {
			process.exit(1);
		});
	},
};
