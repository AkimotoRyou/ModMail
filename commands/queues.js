module.exports = {
	name: 'queues',
	aliases: ['q'],
	level: 'Moderator',
	guildOnly: true,
	args: false,
	usage: false,
	description: 'Show information about queued threads and create threads if ModMail category have less than 50 channels.',
	note: false,
	async execute(param, message, args) {
		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const queues = param.queues;

		const threadServerID = config.threadServerID;
		const threadServer = client.guilds.cache.get(threadServerID);
		const categoryID = config.categoryID;
		const categoryChannel = threadServer.channels.cache.get(categoryID);
		const logChannelID = config.logChannelID;
		const logChannel = threadServer.channels.cache.get(logChannelID);

		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don't have permission to run this command.");
		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`mainServerID` and/or `threadServerID` value is empty.");
		const emptyEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "`categoryID` and/or `logChannelID` value is empty.");
		const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`adminRoleID` and/or `modRoleID` value is empty.");
		const noChannelEmbed = getEmbed.execute(param, config.error_color, "Not Found", "Couldn't find category and/or log channel.");

		if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			// mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			return message.channel.send(noServerEmbed);
		} else if(message.author.id == config.botOwnerID) {
			return queues.execute(param, message, args);
		} else if(message.guild.id == config.threadServerID) {
			// inside thread server
			if (config.adminRoleID == "empty" || config.modRoleID == "empty") {
				// adminRoleID or modRoleID empty
				message.channel.send(noAdminEmbed);
			} else if(categoryID == "empty" || config.logChannelID == "empty") {
				// categoryID and logChannelID empty
				return message.channel.send(emptyEmbed);
			} else if(!categoryChannel || !logChannel) {
				// Can't find category or log channel
				return message.channel.send(noChannelEmbed);
			} else if(message.author.id == config.botOwnerID) {
				// adminRoleID, modRoleID, and categoryID not empty
				return queues.execute(param, message, args);
			} else if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)) {
				// user has ADMINISTRATOR permission or has admin role
				return queues.execute(param, message, args);
			} else if (await param.roleCheck.execute(message, config.modRoleID)) {
				// user has moderator role
				return queues.execute(param, message, args);
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
