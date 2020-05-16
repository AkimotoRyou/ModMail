module.exports = {
	name: 'taglist',
	aliases: ['tags'],
	level: 'Moderator',
	guildOnly: true,
	args: false,
	usage: false,
	description: 'Show all tag names.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const getEmbed = param.getEmbed;
		const TagDB = param.TagDB;

		const tagCollection = await TagDB.findAll({ attributes: ["name"] });
		const tagList = tagCollection.map(tag => `\`${tag.name}\``).join(', ') || "No available tag";

		const tagListEmbed = getEmbed.execute(param, config.info_color, "Tags", tagList);
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don't have permission to run this command.");
		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`mainServerID` and/or `threadServerID` value is empty.");
		const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "`adminRoleID` and/or `modRoleID` value is empty.");

		if (message.author.id === config.botOwnerID) {
			// bot owner
			return message.channel.send(tagListEmbed);
		} else if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			// mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			message.channel.send(noServerEmbed);
			return message.channel.send(tagListEmbed);
		} else if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID) {
		// inside main server or thread server
			if (config.adminRoleID == "empty" || config.modRoleID == "empty") {
				// adminRoleID empty
				message.channel.send(noAdminEmbed);
			}
			if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)) {
				// user has ADMINISTRATOR permission or has admin role
				return message.channel.send(tagListEmbed);
			} else if (await param.roleCheck.execute(message, config.modRoleID)) {
				// user has moderator role
				return message.channel.send(tagListEmbed);
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
