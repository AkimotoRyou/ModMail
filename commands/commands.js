module.exports = {
	name: 'commands',
	aliases: ['cmd'],
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: 'List of all available commands according to your permission level.',
	note: false,
	async execute(param, message, args) {
		const Discord = param.Discord;
		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const commands = param.client.commands;

		// collections
		const ownerCollection = commands.filter(command => command.level === 'Owner');
		const ownerLevel = ownerCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const adminCollection = commands.filter(command => command.level === 'Admin');
		const adminLevel = adminCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const moderatorCollection = commands.filter(command => command.level === 'Moderator');
		const moderatorLevel = moderatorCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const userCollection = commands.filter(command => command.level === 'User');
		const userLevel = userCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');

		// embeds
		const ownerEmbed = new Discord.MessageEmbed()
			.setColor(config.info_color)
			.setTitle("Commands")
			.setDescription(`Use \`${config.prefix}help [command name]\` to get information for each command.`)
			.addField("~ Owner Level ~", ownerLevel || "empty")
			.addField("~ Admin Level ~", adminLevel || "empty")
			.addField("~ Moderator Level ~", moderatorLevel || "empty")
			.addField("~ User level ~", userLevel || "empty")
			.setThumbnail(client.user.avatarURL)
			.setFooter(client.user.tag, client.user.avatarURL())
			.setTimestamp();
		const adminEmbed = new Discord.MessageEmbed()
			.setColor(config.info_color)
			.setTitle("Command List")
			.setDescription(`Use \`${config.prefix}help [command name]\` to get information for each command.`)
			.addField("~ Admin Level ~", adminLevel || "empty")
			.addField("~ Moderator Level ~", moderatorLevel || "empty")
			.addField("~ User level ~", userLevel || "empty")
			.setThumbnail(client.user.avatarURL)
			.setFooter(client.user.tag, client.user.avatarURL())
			.setTimestamp();
		const moderatorEmbed = new Discord.MessageEmbed()
			.setColor(config.info_color)
			.setTitle("Command List")
			.setDescription(`Use \`${config.prefix}help [command name]\` to get information for each command.`)
			.addField("~ Moderator Level ~", moderatorLevel || "empty")
			.addField("~ User level ~", userLevel || "empty")
			.setThumbnail(client.user.avatarURL)
			.setFooter(client.user.tag, client.user.avatarURL())
			.setTimestamp();
		const userEmbed = new Discord.MessageEmbed()
			.setColor(config.info_color)
			.setTitle("Command List")
			.setDescription(`Use \`${config.prefix}help [command name]\` to get information for each command.`)
			.addField("~ User level ~", userLevel || "empty")
			.setThumbnail(client.user.avatarURL)
			.setFooter(client.user.tag, client.user.avatarURL())
			.setTimestamp();

		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`mainServerID` and/or `threadServerID` value is empty.");
		const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`adminRoleID` and/or `modRoleID` value is empty.");

		if (message.author.id === config.botOwnerID) {
			// bot owner
			return message.channel.send(ownerEmbed);
		} else if(message.guild == null) {
			// Direct Message not bot owner
			return message.channel.send(userEmbed);
		} else if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			// mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			message.channel.send(noServerEmbed);
			return message.channel.send(adminEmbed)
		} else if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID) {
			// inside main server or thread server
			if (config.adminRoleID == "empty" || config.modRoleID == "empty") {
				// adminRoleID or modRoleID empty
				message.channel.send(noAdminEmbed);
			}
			if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)) {
				// user has ADMINISTRATOR permission or has admin role
				return message.channel.send(adminEmbed);
			} else if (await param.roleCheck.execute(message, config.modRoleID)) {
				// user has moderator role
				return message.channel.send(moderatorEmbed);
			} else if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
				// user didn't have ADMINISTRATOR permission, admin role, nor moderator role
				return;
			} else {
				return message.channel.send(userEmbed);
			}
		} else {
			// outside main server and thread server
			return message.channel.send(userEmbed);
		}
	}
};
