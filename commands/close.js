module.exports = {
	name: 'close',
	aliases: false,
	level: 'Moderator',
	guildOnly: true,
	args: true,
	usage: '[reason]-[note]',
	description: 'Close a user thread.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const getEmbed = param.getEmbed;
		const close = param.close;

		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don't have permission to run this command.");
		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`mainServerID` and/or `threadServerID` value is empty.");
		const noChannelEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "`categoryID` and/or `logChannelID` value is empty.");
		const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`adminRoleID` and/or `modRoleID` value is empty.");
		const notChannelEmbed = getEmbed.execute(param, config.error_color, "Invalid Channel", `This isn't thread channel.`);

		if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			// mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			return message.channel.send(noServerEmbed);
		} else if(message.guild.id == config.threadServerID) {
			// inside thread server
			if (config.adminRoleID == "empty" || config.modRoleID == "empty") {
				// adminRoleID or modRoleID empty
				return message.channel.send(noAdminEmbed);
			} else if(config.categoryID == "empty" || config.logChannelID == "empty") {
				// categoryID or logChannelID empty
				return message.channel.send(noChannelEmbed);
			} else if (message.channel.parentID != config.categoryID || message.channel.id == config.logChannelID || message.channel.id == config.botChannelID) {
				// adminRoleID, modRoleID, categoryID and logChannelID not empty
				// the channel isn't under modmail category or it's a log channel or it's bot channel -_-
				return message.channel.send(notChannelEmbed);
			} else if(message.author.id == config.botOwnerID) {
				// the channel is under modmail category, it's not a log channel, and it's not bot channel
				return close.execute(param, message, args);
			} else if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)) {
				// user has ADMINISTRATOR permission or has admin role
				return close.execute(param, message, args);
			} else if (await param.roleCheck.execute(message, config.modRoleID)) {
				// user has moderator role
				return close.execute(param, message, args);
			} else if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
				// user didn't have ADMINISTRATOR permission nor has admin role
				return;
			} else {
				return message.channel.send(noPermEmbed);
			}

		} else {
			// outside main server and thread server
			return message.channel.send(noPermEmbed);
		}
	}
};
