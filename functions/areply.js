module.exports = {
  name: "areply",
  async execute(param, message, args){
    const Discord = param.Discord;
    const Attachment = param.Attachment;
    const client = param.client;
    const getEmbed = param.getEmbed;
    const config = param.config;
    const ThreadDB = param.ThreadDB;
    const isMember = param.isMember;
    const isBlocked = param.isBlocked;

    const mainServerID = config.mainServerID;
    const mainServer = await client.guilds.get(mainServerID);
    const threadServerID = config.threadServerID;
    const threadServer = await client.guilds.get(threadServerID);
    const categoryID = config.categoryID;
    const author = message.author;
    const channel = message.channel;

    const isThread = await ThreadDB.findOne({where: {channelID: channel.id}});
    const checkIsBlocked = await isBlocked.execute(param, author.id);

    const blockedEmbed = getEmbed.execute(param, config.error_color, "Blocked", `User blocked.`);
    const noDMEmbed = getEmbed.execute(param, config.error_color, "Not Sent", `User disabled Direct Message.`);
    const noUserEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn\'t find user in my collection.`);
    const noThreadEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn\'t find any thread asociated with this channel.`);

    if (!isThread) {
      return channel.send(noThreadEmbed);
    } else {
      const checkIsMember = await isMember.execute(param, author.id);
      const notMemberEmbed = getEmbed.execute(param, config.error_color, "Not a Member", `User aren\'t inside [**${mainServer.name}**] guild.`);

      if (!checkIsMember) {
        return channel.send(notMemberEmbed);
      } else if (checkIsBlocked){
        return channel.send(blockedEmbed);
      } else {
        const userID = isThread.userID;
        const member = await mainServer.members.get(userID);

        if (!member) {
          return channel.send(noUserEmbed);
        } else {
          const user = member.user;
          const description = args.join(' ');
          const userDMEmbed = new Discord.RichEmbed()
            .setColor(config.sent_color)
            .setAuthor("[Anonymous]")
            .setTitle("Message Received")
            .setDescription(description)
            .setFooter(mainServer.name, mainServer.avatarURL)
            .setTimestamp();
          const threadChannelEmbed = new Discord.RichEmbed()
            .setColor(config.sent_color)
            .setAuthor(`[Anonymous] | ${author.tag}`, author.avatarURL)
            .setTitle("Message Sent")
            .setDescription(description)
            .setFooter(`${user.tag} | ${user.id}`, user.avatarURL)
            .setTimestamp();

          try{
            await user.send(userDMEmbed);
          } catch (error){
            if(error.message == "Cannot send messages to this user"){
              return channel.send(noDMEmbed);
            }
          }
          await channel.send(threadChannelEmbed);
          if (message.attachments.size > 0) {
            await message.attachments.forEach(async atch => {
              let attachment = new Attachment(atch.url);
              await user.send(attachment);
              await channel.send(attachment);
            });
          }
          return message.delete();
        }

      };
    };

  }
};
