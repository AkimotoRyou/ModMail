module.exports = {
  name: "newThread",
  async execute(param, message, args){
    const Discord = param.Discord;
    const MessageAttachment = param.MessageAttachment;
    const moment = param.moment;
    const client = param.client;
    const getEmbed = param.getEmbed;
    const config = param.config;
    const ThreadDB = param.ThreadDB;
    const isMember = param.isMember;
    const isBlocked = param.isBlocked;

    const mainServerID = config.mainServerID;
    const mainServer = await client.guilds.cache.get(mainServerID);
    const threadServerID = config.threadServerID;
    const threadServer = await client.guilds.cache.get(threadServerID);
    const categoryID = config.categoryID;
    const categoryChannel = await threadServer.channels.cache.get(categoryID);
    const logChannelID = config.logChannelID;
    const logChannel = await threadServer.channels.cache.get(logChannelID);
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
        const newChannel = await threadServer.channels.create(author.tag.replace("#", "-"), { type: "text" });
        await newChannel.setParent(categoryID).then(chnl => chnl.lockPermissions()) //Set channel parent and then set the permissions

        let logEmbed = new Discord.MessageEmbed()
          .setColor(config.info_color)
          .setTitle("New Thread")
          .setDescription(`${args.join(' ')}`)
          .setFooter(`${author.tag} | ${author.id}`, author.avatarURL())
          .setTimestamp();
        logChannel.send(logEmbed);

        let dmEmbed = new Discord.MessageEmbed()
          .setColor(config.info_color)
          .setTitle("Thread Created!")
          .setDescription(
            `**Title** : ${args.join(' ')}\n\`Please describe your issue. (No command needed.)\``
          )
          .setFooter(mainServer.name, mainServer.iconURL())
          .setTimestamp();
        author.send(dmEmbed);

        const member = await mainServer.members.cache.get(author.id);
        const memberRoles = await member.roles.cache.filter(role => role.name != '@everyone').map(role => `\`${role.name}\``).join(', ');
        let userData = [];
        userData.push(`**User Tag** : \`${author.tag}\``);
        userData.push(`**User ID** : \`${author.id}\``);
        userData.push(`**Created at** : ${moment(author.createdAt).format("D MMM YYYY, HH:mm")}`);
        userData.push(`**Joined at** : ${moment(member.joinedAt).format("D MMM YYYY, HH:mm")}`);
        userData.push(`**Roles** : ${memberRoles}`);
        let newThreadEmbed = new Discord.MessageEmbed()
          .setColor(config.info_color)
          .setTitle("New Thread")
          .setDescription(args.join(' '))
          .addField("User Info", userData.join('\n'))
          .setThumbnail(author.avatarURL)
          .setFooter(`${author.tag} | ${author.id}`, author.avatarURL())
          .setTimestamp();
        newChannel.send(mentionedRole, newThreadEmbed);

        if (message.attachments.size > 0) {
          await message.attachments.forEach(async atch => {
            let attachment = new MessageAttachment(atch.url);
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
