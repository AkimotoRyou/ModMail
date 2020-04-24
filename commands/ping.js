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

		if(config.mainServerID != "empty" && config.threadServerID != "empty"){
			if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID){
				if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
					return;
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
