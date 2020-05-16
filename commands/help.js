module.exports = {
	name: 'help',
	aliases: false,
	level: 'User',
	guildOnly: false,
	args: false,
	usage: '[command name]',
	description: 'Short instruction on how to create a new thread or info on a specific command.',
	note: 'Command name case is insensitive (upper case and lower case are same).',
	async execute(param, message, args) {
		const data = [];
		const commands = param.client.commands;
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "Instruction", `In Direct Message, use \`${prefix}new Your thread title here\` to create a new thread (**Thread Created!** will be displayed). You don't need to use any command after your thread created. Describe your issue afterward.`);
		const notCmdEmbed = getEmbed.execute(param, config.warning_color, "Not a Command", `That's not a valid command name or alias.\nUse \`${prefix}commands\` to show available commands.`);

		if(!args.length) {
			return message.channel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

		if(!command) {
			return message.channel.send(notCmdEmbed);
		}

		data.push(`**Name** : ${command.name}`);
		if (command.aliases) data.push(`**Aliases** : ${command.aliases.join(', ')}`);
		if (command.level) data.push(`**Required Level** : ${command.level}`);
		if(command.guildOnly) {
			data.push(`**Direct Message** : false`);
		} else {
			data.push(`**Direct Message** : true`);
		}
		if (command.usage) data.push(`**Usage** : \`${prefix}${command.name} ${command.usage}\``);
		if (command.description) data.push(`**Description** : ${command.description}`);
		if (command.note) data.push(`**Note** : \`${command.note}\``);

		const dataEmbed = getEmbed.execute(param, config.info_color, "Command Info", data.join('\n'));
		return message.channel.send(dataEmbed);
	}
};
