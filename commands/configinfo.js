module.exports = {
	name: 'configinfo',
	aliases: ['chelp'],
	level: 'Admin',
	guildOnly: true,
	args: true,
	usage: '[config name]',
	description: 'Show a configuration information.',
	note: 'Config name case is sensitive (upper case and lower case are different).',
	async execute(param, message, args) {
		const config = param.config;
		const getEmbed = param.getEmbed;
		const configinfo = param.configinfo;

		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`mainServerID` and/or `threadServerID` value is empty.");
		const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`adminRoleID` value is empty.");
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don't have permission to run this command.");

		if (message.author.id === config.botOwnerID) {
			// bot owner
			return await configinfo.execute(param, message, args);
		} else if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			// mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			message.channel.send(noServerEmbed);
			return await configinfo.execute(param, message, args);
		} else if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID) {
			// inside main server or thread server
			if (config.adminRoleID == "empty") {
				// adminRoleID empty
				message.channel.send(noAdminEmbed);
			}
			if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)) {
				// user has ADMINISTRATOR permission or has admin role
				return await configinfo.execute(param, message, args);
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
