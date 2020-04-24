module.exports = {
	name: 'configuration',
  aliases: ['config', 'settings'],
  level: 'Admin',
  guildOnly: true,
	args: false,
  usage: false,
	description: 'Bot configuration.',
	note: 'If [mainServerID] and/or [threadServerID] config isn\'t empty, only administrator in that server can use this command.',
	async execute(param, message, args){
		const config = param.config;
		const getEmbed = param.getEmbed;
    const configuration = param.configuration;

		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "\`mainServerID\` and/or \`threadServerID\` value is empty.");
    const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "\`adminRoleID\` value is empty.");
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don\'t have permission to run this command.");
		const configEmbed = await configuration.execute(param);

    if (message.author.id === config.botOwnerID) {
			//bot owner
			return message.channel.send(configEmbed);
		} else if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			//mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			message.channel.send(noServerEmbed);
			return message.channel.send(configEmbed);
		} else {
			if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID){
				//inside main server or thread server
				if (config.adminRoleID == "empty"){
					//adminRoleID empty
					message.channel.send(noAdminEmbed);
				}
				if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)){
					//user has ADMINISTRATOR permission or has admin role
					return message.channel.send(configEmbed);
				} else {
					//user didn't have ADMINISTRATOR permission nor has admin role
					if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
						return;
					} else {
						return message.channel.send(noPermEmbed);
					};
				}
			} else {
				//outside main server and thread server
				return message.channel.send(noPermEmbed);
			}
		};
  }
};
