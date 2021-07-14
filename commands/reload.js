module.exports = {
	name: "reload",
	aliases: false,
	level: "Owner",
	guildOnly: false,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<command name>", "<function name>"],
	description: "Reloading command or function.",
	note: "Used to apply changes made to the bot on commands and functions file without restarting the bot.",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;

		const fnName = args.shift(); // Function name are case sensitive
		const commandName = fnName.toLowerCase(); // Command name case are case insensitive.
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		const fn = client.functions.get(fnName);
		const cmdMap = client.commands.map(cmd => `\`${cmd.name}\``).join(", ");
		const fnMap = client.functions.map(fnc => `\`${fnc.name}\``).join(", ");
		const cmdField = `Command Names:;${cmdMap}`;
		const fnField = `Function Names:;${fnMap}`;

		const notCmdEmbed = getEmbed.execute(param, "", config.error_color, "Invalid Arguments", "That's not a valid command or function name.", [cmdField, fnField]);
		const data = [];

		if(command) {
			console.log(`> Deleting ${command.name} cache.`);
			delete require.cache[require.resolve(`./${command.name}.js`)];

			console.log(`> Loading ${command.name}.`);
			const newCommand = require(`./${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);
			data.push(`Reloaded \`${command.name}\` command.`);
		}
		if(fn) {
			console.log(`> Deleting ${fnName} cache.`);
			delete require.cache[require.resolve(`../functions/${fnName}.js`)];

			console.log(`> Loading ${fnName}.`);
			const newFunction = require(`../functions/${fnName}.js`);
			client.functions.set(newFunction.name, newFunction);
			param[fnName] = client.functions.get(fnName);
			data.push(`Reloaded \`${fnName}\` function.`);
		}
		if(!command && !fn) {
			console.log("> Invalid Name.");
			return replyChannel.send(notCmdEmbed);
		}

		const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", data.join("\n"));
		return replyChannel.send(successEmbed);
	},
};
