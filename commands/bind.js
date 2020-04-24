module.exports = {
  name: 'bind',
  aliases: false,
  level: 'Admin',
  guildOnly: true,
	args: true,
  usage: '<userID> <channelID>',
  description: 'Bind user thread to a channel.',
	note: 'Only use under these circumtances : \n> There is an open thread from other bot.\n> The channel was accidentally deleted.\n> Category channel was accidentally deleted and changed.',
  async execute(param, message, args){
    const config = param.config;
    const getEmbed = param.getEmbed;
    const bind = param.bind;

		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don\'t have permission to run this command.");
    const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "\`mainServerID\` and/or \`threadServerID\` value is empty.");
    const noChannelEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "\`categoryID\` and/or \`logChannelID\` value is empty.");
    const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "\`adminRoleID\` value is empty.");

    if (message.author.id === config.botOwnerID) {
      //bot owner
			return bind.execute(param, message, args);
		} else if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
      //mainServerID and threadServerID empty and user has ADMINISTRATOR permission
      if(config.mainServerID == "empty" || config.threadServerID == "empty"){
        return message.channel.send(noServerEmbed);
      } else if(config.categoryID == "empty" || config.logChannelID == "empty"){
        return message.channel.send(noChannelEmbed);
      } else {
        return bind.execute(param, message, args);
      }
		} else {
			if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID){
        //inside main server or thread server
				if (config.adminRoleID == "empty"){
          //adminRoleID empty
					message.channel.send(noAdminEmbed);
				}
				if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)){
          //user has ADMINISTRATOR permission or has admin role
          if(config.categoryID == "empty" || config.logChannelID == "empty"){
            return message.channel.send(noChannelEmbed);
          } else {
            return bind.execute(param, message, args);
          }
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
