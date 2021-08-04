module.exports = {
	name: "bind",
	aliases: false,
	level: "Admin",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID", "threadServerID", "categoryID", "logChannelID"], // Configs needed to run this command.
	usage: ["<userID> <channelID> [thread title]"],
	description: "Bind user thread to a channel.",
	note: "\nOnly use under these circumtances : \n> There is an open thread from other bot.\n> The channel was accidentally deleted.\n> Category channel was accidentally deleted and changed.",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const updateActivity = param.updateActivity;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.fetch(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.fetch(threadServerID);
		const categoryID = config.categoryID;
		const logChannelID = config.logChannelID;

		const userID = args.shift();
		const channelID = args.shift();
		const dbKey = threadPrefix + userID;
		let isThread = await db.get(dbKey);
		const getChannel = await threadServer.channels.cache.get(channelID);
		const chUserID = getChannel.name.split("-").pop();
		const chIsThread = await db.get(threadPrefix + chUserID);
		const member = await mainServer.members.fetch(userID);
		const channelName = member ? member.user.tag.replace(/[^0-9a-z]/gi, "") + `-${userID}` : userID;

		const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `Binded <@${userID}> (\`${userID}\`) thread to <#${channelID}>.`);
		const noChannelEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", "Couldn't find that channel.");
		const activeChannelEmbed = getEmbed.execute(param, "", config.error_color, "Error", "That's other user's thread channel.");
		const notChannelEmbed = getEmbed.execute(param, "", config.error_color, "Invalid Channel", "That channel can't be a thread channel.");

		if(!getChannel) {
			console.log("> Channel not found.");
			return replyChannel.send(noChannelEmbed);
		}
		else if(chIsThread) {
			console.log("> Other user thread channel.");
			return replyChannel.send(activeChannelEmbed);
		}
		else if(getChannel.parentID != categoryID || channelID == categoryID || channelID == logChannelID) {
			console.log("> Invalid channel.");
			return replyChannel.send(notChannelEmbed);
		}
		else if(!isThread) {
			await db.set(dbKey, `${channelID}-${args.join(" ") || "empty"}`);
			await getChannel.setName(channelName);
			await updateActivity.execute(param);
			console.log("> Thread created.");
			return replyChannel.send(successEmbed);
		}
		else {
			isThread.split("-").shift();
			isThread = isThread.join("-");
			await db.set(dbKey, `${channelID}-${isThread}`);
			await getChannel.setName(channelName);
			await updateActivity.execute(param);
			console.log("> Channel binded to a thread.");
			return replyChannel.send(successEmbed);
		}
	},
};
