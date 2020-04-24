module.exports = {
	name: 'restart',
	aliases: ['reboot'],
  level: 'Admin',
  guildOnly: true,
	args: false,
  usage: false,
	description: 'Restart the bot.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const getEmbed = param.getEmbed;

		const successEmbed = getEmbed.execute(param, config.info_color, "Restarting", `**Restarting in** : **${Math.round(param.client.ping)}** ms`);
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don\'t have permission to run this command.");
		const noServerEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "\`mainServerID\` and/or \`threadServerID\` value is empty.");
		const noAdminEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", "\`adminRoleID\` value is empty.");

		if (message.author.id === config.botOwnerID) {
			//bot owner
      console.log("Restarting bot...");
			message.channel.send(successEmbed).then(() => {
				process.exit(1);
			});
		} else if (config.mainServerID == "empty" && config.threadServerID == "empty" && message.member.hasPermission("ADMINISTRATOR")) {
			//mainServerID and threadServerID empty and user has ADMINISTRATOR permission
			message.channel.send(noServerEmbed);
      console.log("Restarting bot...");
			message.channel.send(successEmbed).then(() => {
				process.exit(1);
			});
		} else {
			if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID){
				//inside main server or thread server
				if (config.adminRoleID == "empty"){
					//adminRoleID empty
					message.channel.send(noAdminEmbed);
				}
				if (message.member.hasPermission("ADMINISTRATOR") || await param.roleCheck.execute(message, config.adminRoleID)){
					//user has ADMINISTRATOR permission or has admin role
		      console.log("Restarting bot...");
					message.channel.send(successEmbed).then(() => {
						process.exit(1);
					});
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
