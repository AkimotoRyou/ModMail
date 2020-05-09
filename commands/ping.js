module.exports = {
	name: 'ping',
  aliases: false,
  level: 'User',
  guildOnly: false,
	args: false,
  usage: false,
	description: 'Calculate bot latency.',
	note: false,
	async execute(param, message, args){
		const config = param.config;
		const getEmbed = param.getEmbed;

		if(message.guild != null){
			if(config.mainServerID != "empty" && config.threadServerID != "empty"){
				//mainServerID and threadServerID isn't empty
				if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID){
					//inside main server or thread server
					if (config.adminRoleID != "empty") {
						//adminRoleID isn't empty
						if(config.modRoleID != "empty"){
						//modRoleID isn't empty
							if(!message.member.hasPermission("ADMINISTRATOR") && !await param.roleCheck.execute(message, config.adminRoleID) && !await param.roleCheck.execute(message, config.modRoleID)){
								//user don't have ADMINISTRATOR permission, admin role, nor a mod role
								if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
									//not bot channel
									return;
								}
							}
						} else if(!message.member.hasPermission("ADMINISTRATOR") && !await param.roleCheck.execute(message, config.adminRoleID)){
							//user don't have ADMINISTRATOR permission nor an admin role
							if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
								//not bot channel
								return;
							}
						}
					}
				}
			}
		}

    let pingEmbed = getEmbed.execute(param, config.info_color, "Pong", "Ping?");

		message.channel.send(pingEmbed).then((msg) => {
			let editEmbed = getEmbed.execute(param, config.info_color, "Pong", `**Response time** : **${msg.createdTimestamp - message.createdTimestamp}** ms\n**API latency** : **${Math.round(param.client.ping)}** ms`);
			msg.edit(editEmbed);
    });
  }
};
