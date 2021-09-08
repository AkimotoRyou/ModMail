module.exports = {
	name: "bind",
	aliases: [],
	level: "Admin",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID", "threadServerID", "categoryID", "logChannelID"], // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const updateActivity = param.updateActivity;
		const locale = param.locale;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.fetch(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.fetch(threadServerID);
		const categoryID = config.categoryID;
		const logChannelID = config.logChannelID;

		const userID = args.shift();
		const channelID = args.shift();
		const dbKey = threadPrefix + userID;
		const isThread = await db.get(dbKey);
		const getChannel = await threadServer.channels.cache.get(channelID);
		const chUserID = getChannel.name.split("-").pop();
		const chIsThread = await db.get(threadPrefix + chUserID);
		const member = await mainServer.members.fetch(userID);
		const channelName = member ? member.user.tag.replace(/[^0-9a-z]/gi, "") + `-${userID}` : userID;

		const bindCmd = locale.bindCmd(userID, channelID);
		const noChannelEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, locale.noChannel);
		const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, bindCmd.binded);
		const activeChannelEmbed = getEmbed.execute(param, "", config.error_color, bindCmd.active.title, bindCmd.active.description);
		const invalidChannelEmbed = getEmbed.execute(param, "", config.error_color, bindCmd.invalid.title, bindCmd.invalid.description);

		if(!getChannel) {
			console.log("> Channel not found.");
			return replyChannel.send(noChannelEmbed);
		}
		else if(chIsThread) {
			console.log("> Other user thread channel.");
			return replyChannel.send(activeChannelEmbed);
		}
		else if(getChannel.parentID !== categoryID || getChannel.type !== "text" || channelID === logChannelID || channelID == config.botChannelID) {
			console.log("> Invalid channel.");
			return replyChannel.send(invalidChannelEmbed);
		}
		else if(!isThread) {
			await db.set(dbKey, `${channelID}-${args.join(" ") || locale.empty}`);
			await getChannel.setName(channelName);
			await updateActivity.execute(param);
			console.log("> Thread created.");
			return replyChannel.send(successEmbed);
		}
		else {
			const threadTitle = isThread.split("-");
			threadTitle.shift(); // removing old channel id
			if (threadTitle.length > 1) threadTitle.join("-");
			await db.set(dbKey, `${channelID}-${threadTitle}`);
			await getChannel.setName(channelName);
			await updateActivity.execute(param);
			console.log("> Channel binded to a thread.");
			return replyChannel.send(successEmbed);
		}
	},
};
