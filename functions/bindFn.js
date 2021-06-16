module.exports = {
	name: "bind",
	async execute(param, message, args) {
		// Due to database limitation, i didn't check whether the channel tried to be binded already tied to other thread or not.
		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const updateActivity = param.updateActivity;

		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.cache.get(threadServerID);
		const categoryID = config.categoryID;
		const logChannelID = config.logChannelID;

		const userID = args.shift();
		const channelID = args.shift();
		const dbKey = threadPrefix + userID;
		const isThread = await db.get(dbKey);
		const getChannel = await threadServer.channels.cache.get(channelID);

		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Binded <@${userID}> (\`${userID}\`) thread to <#${channelID}>.`);
		const noChannelEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn't find that channel.`);
		const notChannelEmbed = getEmbed.execute(param, config.error_color, "Invalid Channel", `That isn't thread channel.`);

		if(!getChannel) {
			return message.channel.send(noChannelEmbed);
		} else if(getChannel.parentID != categoryID || channelID == categoryID || channelID == logChannelID) {
			return message.channel.send(notChannelEmbed);
		} else if(!isThread) {
			await db.set(dbKey, `${channelID}-empty`);
			await updateActivity.execute(param);
			return message.channel.send(successEmbed);
		} else {
			isThread.split("-").shift();
			isThread = isThread.join("-");
			await db.set(dbKey, `${channelID}-${isThread}`);
			await updateActivity.execute(param);
			return message.channel.send(successEmbed);
		}

	}
};
