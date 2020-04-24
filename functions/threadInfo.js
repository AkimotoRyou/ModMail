module.exports = {
  name: "threadInfo",
  async execute(param, message, args){
    const Discord = param.Discord;
    const moment = param.moment;
    const client = param.client;
    const getEmbed = param.getEmbed;
    const config = param.config;
    const ThreadDB = param.ThreadDB;

    const mainServerID = config.mainServerID;
    const mainServer = await client.guilds.get(mainServerID);
    const threadServerID = config.threadServerID;
    const threadServer = await client.guilds.get(threadServerID);

    const input = args.shift();
    const isThreadUser = await ThreadDB.findOne({where: {userID: input}});
    const isThreadChannel = await ThreadDB.findOne({where: {channelID: input}});
    let isThread = false;

    var noThreadEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn\'t find any thread asociated with that user id or channel id.`);

    if (isThreadUser) {
      isThread = isThreadUser;
    } else if(isThreadChannel){
      isThread = isThreadChannel;
    }

    if (!isThread) {
      return message.channel.send(noThreadEmbed);
    } else {
      let threadData = [];
      const member = mainServer.members.get(isThread.userID);

      threadData.push(`${isThread.threadTitle}`);
      if (member) {
        threadData.push(`**User Tag** : \`${member.user.tag}\``);
      } else {
        threadData.push(`**User Tag** : \`Couldn\'t find user at main server.\``);
      }
      threadData.push(`**User ID** : \`${isThread.userID}\``);
      threadData.push(`**Thread Channel** : <#${isThread.channelID}>`);
      threadData.push(`**Created at** : ${moment(isThread.createdAt).format("D MMMM YYYY, **HH:mm:ss** UTC")}`);
      threadData.push(`**Updated at** : ${moment(isThread.updatedAt).format("D MMMM YYYY, **HH:mm:ss** UTC")}`);

      const threadInfoEmbed = getEmbed.execute(param, config.info_color, "Thread Information", threadData.join('\n'));
      return message.channel.send(threadInfoEmbed);

    };

  }
};
