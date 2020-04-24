module.exports = {
  name: "newThread",
  async execute(param, message, args){
    const Discord = param.Discord;
    const Attachment = param.Attachment;
    const moment = param.moment;
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
    const categoryChannel = await threadServer.channels.get(categoryID);
    const logChannelID = config.logChannelID;
    const logChannel = await threadServer.channels.get(logChannelID);
    const author = message.author;
    const mentionedRoleID = config.mentionedRoleID;

    let mentionedRole = "";
    if (mentionedRoleID == "everyone" || mentionedRoleID == "here") {
      mentionedRole = "@" + mentionedRoleID;
    } else if (config.mentionedRoleID != null && config.mentionedRoleID != "empty") {
      mentionedRole = "<@&" + mentionedRoleID + ">";
    }

    const isThread = await ThreadDB.findOne({where: {userID: author.id}});
    const checkIsMember = await isMember.execute(param, author.id);
    const checkIsBlocked = await isBlocked.execute(param, author.id);

    const notMemberEmbed = getEmbed.execute(param, config.error_color, "Not a Member", `You aren\'t inside [**${mainServer.name}**] guild.`);
    const blockedEmbed = getEmbed.execute(param, config.error_color, "Blocked", `You are blocked from creating new thread.`);
    const isThreadEmbed = getEmbed.execute(param, config.error_color, "Thread Detected", `You still have open thread.`);

    if (isThread) {
      return message.channel.send(isThreadEmbed);
    } else {
      if (!checkIsMember) {
        return message.channel.send(notMemberEmbed);
      } else if (checkIsBlocked){
        return message.channel.send(blockedEmbed);
      } else {
        const newChannel = await threadServer.createChannel(author.tag.replace("#", "-"), { type: "text" });
        await newChannel.setParent(categoryID); //move the channel under category channel
        await newChannel.lockPermissions(); //inherit category channel permission

        let logEmbed = new Discord.RichEmbed()
          .setColor(config.info_color)
          .setTitle("New Thread")
          .setDescription(`${args.join(' ')}`)
          .setFooter(`${author.tag} | ${author.id}`, author.avatarURL)
          .setTimestamp();
        logChannel.send(logEmbed);

        let dmEmbed = new Discord.RichEmbed()
          .setColor(config.info_color)
          .setTitle("Thread Created!")
          .setDescription(
            `**Title** : ${args.join(' ')}\n\`Please describe your issue. (No command needed.)\``
          )
          .setFooter(mainServer.name, mainServer.iconURL)
          .setTimestamp();
        author.send(dmEmbed);

        const member = await mainServer.members.get(author.id);
        const memberRoles = await member.roles.map(role => `${role.name}`).join(', ');
        let userData = [];
        userData.push(`**User Tag** : \`${author.tag}\``);
        userData.push(`**User ID** : \`${author.id}\``);
        userData.push(`**Created at** : ${moment(author.createdAt).format("D MMM YYYY, HH:mm")}`);
        userData.push(`**Joined at** : ${moment(member.joinedAt).format("D MMM YYYY, HH:mm")}`);
        userData.push(`**Roles** : ${memberRoles}`);
        let newThreadEmbed = new Discord.RichEmbed()
          .setColor(config.info_color)
          .setTitle("New Thread")
          .setDescription(args.join(' '))
          .addField("User Info", userData.join('\n'))
          .setThumbnail(author.avatarURL)
          .setFooter(`${author.tag} | ${author.id}`, author.avatarURL)
          .setTimestamp();
        newChannel.send(newThreadEmbed);

        if (message.attachments.size > 0) {
          await message.attachments.forEach(async atch => {
            let attachment = new Attachment(atch.url);
            await newChannel.send(attachment);
          });
        }

        const newThread = await ThreadDB.create({
        	userID: author.id,
        	channelID: newChannel.id,
        	threadTitle: args.join(' ')
        });
        console.log(`${author.tag} created thread.`);

      }
    };

  }
};
