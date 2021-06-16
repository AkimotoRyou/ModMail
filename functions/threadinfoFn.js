module.exports = {
	name: "threadinfo",
	async execute(param, message, args) {
		const moment = param.moment;
		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);

		const userID = args.shift();
		const dbKey = threadPrefix + userID;
		const isThread = await db.get(dbKey);

		const noThreadEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn't find any thread asociated with that user id.`);

		if (!isThread) {
			return message.channel.send(noThreadEmbed);
		} else {
			const threadData = [];
			const member = mainServer.members.cache.get(userID);

			const temp = isThread.split("-");
			const channelID = temp.shift();
			threadData.push(`${temp.join("-")}`);
			if (member) {
				threadData.push(`**User Tag** : \`${member.user.tag}\``);
			} else {
				threadData.push(`**User Tag** : \`Couldn't find user at main server.\``);
			}
			threadData.push(`**User ID** : \`${userID}\``);
			threadData.push(`**Thread Channel** : <#${channelID}>`);

			const threadInfoEmbed = getEmbed.execute(param, config.info_color, "Thread Information", threadData.join('\n'));
			return message.channel.send(threadInfoEmbed);
		}

	}
};
