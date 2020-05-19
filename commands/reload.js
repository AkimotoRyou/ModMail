module.exports = {
	name: 'reload',
	aliases: false,
	level: 'Owner',
	guildOnly: false,
	args: true,
	usage: '[command name]',
	description: 'Reload a command.',
	note: false,
	async execute(param, message, args) {
		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;

		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		const fnName = commandName + "Fn";
		const fn = client.functions.get(fnName);

		const notCmdEmbed = getEmbed.execute(param, config.error_color, "Not a Command", `That's not a valid command name or alias.\nUse \`${config.prefix}commands\` to show available commands.`);
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don't have permission to run this command.");

		if (message.author.id === config.botOwnerID) {
			// bot owner
			if(!command) {
				return message.channel.send(notCmdEmbed);
			}
			const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Command \`${command.name}\` was reloaded.`);
			console.log(`Deleting ${command.name} cache.`);
			delete require.cache[require.resolve(`./${command.name}.js`)];

			console.log(`Loading ${command.name}.`)
			const newCommand = require(`./${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);

			if(fn) {
				console.log(`Deleting ${fnName} cache.`);
				delete require.cache[require.resolve(`../functions/${fnName}.js`)];

				console.log(`Loading ${fnName}.`)
				const newFunction = require(`../functions/${fnName}.js`);
				client.functions.set(newFunction.name, newFunction);
			}

			return message.channel.send(successEmbed);
		} else if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
			return;
		} else {
			return message.channel.send(noPermEmbed);
		}
	}
};
