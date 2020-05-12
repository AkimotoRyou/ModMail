module.exports = {
  name: 'leave',
  aliases: false,
  level: 'Owner',
  guildOnly: false,
	args: true,
  usage: '<guildID>',
  description: 'Leave a guild (server).',
	note: false,
  async execute(param, message, args){
    const client = param.client;
    const config = param.config;
    const getEmbed = param.getEmbed;

    const serverID = args.shift();
    const getServer = client.guilds.cache.get(serverID);

    const notFoundEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Can\'t find guild with ID (\`${serverID}\`) in my collection.`);
		const noPermEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", "You don\'t have permission to run this command.");

    if (message.author.id === config.botOwnerID) {
      //bot owner
      if(getServer){
        const successEmbed = getEmbed.execute(param, config.info_color, "Leaving", `Leaving [**${getServer.name}**] (\`${getServer.id}\`) guild.`);
        console.log(`Leaving [${getServer.name}] guild.`);
  			return getServer.leave().then(message.channel.send(successEmbed));
      } else {
        message.channel.send(notFoundEmbed);
      }
		} else {
      if (config.botChannelID != "empty" && message.channel.id != config.botChannelID) {
        return;
      } else {
        return message.channel.send(noPermEmbed);
      };
    };
  }
};
