module.exports = {
	name: "help",
	aliases: ["h", "?"],
	level: "User",
	guildOnly: false,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const commands = param.client.commands;
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;
		const locale = param.locale;
		replyChannel = message.channel;

		const notCmd = locale.notCmd(prefix);
		const notCmdEmbed = getEmbed.execute(param, "", config.warning_color, notCmd.title, notCmd.description);

		if(!args.length) {
			const instruction = locale.instruction(prefix);
			const helpEmbed = getEmbed.execute(param, "", config.info_color, instruction.title, instruction.description);
			return replyChannel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

		if(!command) {
			console.log("> Not a command name or alias.");
			return replyChannel.send(notCmdEmbed);
		}

		const cmdInfo = locale.cmdInfo(prefix, command);
		const cmdInfoEmbed = getEmbed.execute(param, "", config.info_color, cmdInfo.title, cmdInfo.description);
		return replyChannel.send(cmdInfoEmbed);
	},
};
