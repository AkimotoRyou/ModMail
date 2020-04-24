module.exports = {
	name: 'new',
  aliases: ['neu', 'yeni', '새로운', 'novo', 'nouveau', 'новый', '新', 'nuevo'],
  level: 'User',
  guildOnly: false,
	args: true,
  usage: '[thread title]',
	description: 'Create new thread.',
	note: false,
	async execute(param, message, args){
		const config = param.config;
		const getEmbed = param.getEmbed;
    const newThread = param.newThread;

    const mainServerID = config.mainServerID;
    const threadServerID = config.threadServerID;
    const botChannelID = config.botChannelID;
    const categoryID = config.categoryID;
    const logChannelID = config.logChannelID;

    const noServerEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "\`mainServerID\` and/or \`threadServerID\` value is empty.");
    const noChannelEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "\`categoryID\` and/or \`logChannelID\` value is empty.");
    const notDMEmbed = getEmbed.execute(param, config.error_color, "Command Unavailable", "This command can only be used in Direct Message.")

		if (message.guild != null && (message.guild.id == mainServerID || message.guild.id == threadServerID)) {
      if(botChannelID != "empty" && message.channel.id == botChannelID){
        return;
      } else {
				return message.channel.send(notDMEmbed);
			}
    } else if(message.guild != null){
      return message.channel.send(notDMEmbed);
    } else {
      if(mainServerID == "empty" || threadServerID == "empty"){
        return message.channel.send(noServerEmbed);
      } else if (categoryID == "empty" || logChannelID == "empty"){
        return message.channel.send(noChannelEmbed);
      } else {
        return newThread.execute(param, message, args);
      }
    }

  }
};
