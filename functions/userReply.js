module.exports = {
  name: "userReply",
  async execute(param, message, thread){
    const Discord = param.Discord;
    const Attachment = param.Attachment;
    const client = param.client;
    const getEmbed = param.getEmbed;
    const config = param.config;
    const isMember = param.isMember;
    const isBlocked = param.isBlocked;

    const mainServerID = config.mainServerID;
    const mainServer = await client.guilds.get(mainServerID);
    const threadServerID = config.threadServerID;
    const threadServer = await client.guilds.get(threadServerID);
    const author = message.author;

    const checkIsBlocked = await isBlocked.execute(param, author.id);

    const blockedEmbed = getEmbed.execute(param, config.error_color, "Blocked", `You are blocked from replying to a thread.`);
    const noServerEmbed = getEmbed.execute(param, config.error_color, "Contact Admin", "\`mainServerID\` and/or \`threadServerID\` value is empty.");
    const noChannelEmbed = getEmbed.execute(param, config.error_color, "Channel Not Found", `Couldn\'t find your thread channel, ask admin to use \`${config.prefix}bind\` command.`);

    if(checkIsBlocked){
      return message.channel.send(blockedEmbed);
    } else if (!mainServer || !threadServer) {
      //Can't find main server or thread server
      return message.channel.send(noServerEmbed);
    } else {
      const checkIsMember = await isMember.execute(param, author.id);
      const notMemberEmbed = getEmbed.execute(param, config.error_color, "Not a Member", `User aren\'t inside [**${mainServer.name}**] guild.`);
      const threadChannel = await threadServer.channels.get(thread.channelID);

      if(!checkIsMember){
        return message.channel.send(notMemberEmbed);
      } else {
        if(!threadChannel){
          return message.channel.send(noChannelEmbed);
        } else {
          const sendPromise = new Promise(async resolve => {
            let userReplyEmbed = new Discord.RichEmbed()
              .setColor(config.received_color)
              .setTitle("Message Received")
              .setDescription(message.content)
              .setFooter(`${author.tag} | ${author.id}`, author.avatarURL)
              .setTimestamp();
            await threadChannel.send(userReplyEmbed);

            if (message.attachments.size > 0) {
              await message.attachments.forEach(async atch => {
                let attachment = new Attachment(atch.url);
                await threadChannel.send(attachment);
              });
            }
            resolve();
          });
          sendPromise.then(message.react("✅"));

        }
      }
    };

  }
};
