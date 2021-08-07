module.exports = {
	name: "turnoff",
	aliases: ["shutdown", "stop"],
	level: "Owner",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const process = param.process;

		console.log(">>> Turning Off <<<");
		replyChannel.send(param.locale.turnoff).then(() => {
			process.exit(1);
		});
	},
};
