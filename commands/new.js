module.exports = {
	name: "new",
	aliases: [],
	level: "User",
	guildOnly: false,
	args: true,
	reqConfig: ["mainServerID", "threadServerID", "categoryID", "logChannelID"], // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const newThread = param.newThread;
		const isBlocked = param.isBlocked;
		const locale = param.locale;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.fetch(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.fetch(threadServerID);
		const categoryID = config.categoryID;
		const categoryChannel = await threadServer.channels.cache.get(categoryID);
		const author = message.author;

		const isThread = await db.get(threadPrefix + author.id);
		const checkIsMember = await mainServer.members.fetch(author.id);
		const checkIsBlocked = await isBlocked.execute(param, author.id);

		const blocked = locale.blocked;
		const notMember = locale.notMember(mainServer.name);
		const newCmd = locale.newCmd;
		const notMemberEmbed = getEmbed.execute(param, "", config.error_color, notMember.title, notMember.user);
		const blockedEmbed = getEmbed.execute(param, "", config.error_color, blocked.title, blocked.user);
		const isThreadEmbed = getEmbed.execute(param, "", config.error_color, newCmd.title, newCmd.active);
		const notDMEmbed = getEmbed.execute(param, "", config.error_color, newCmd.title, newCmd.notDM);
		const maxEmbed = getEmbed.execute(param, "", config.error_color, newCmd.title, newCmd.maxThread);

		if(message.guild != null) {
			// Outside main server or thread server not Direct Message
			console.log("> Not a Direct Message channel.");
			return replyChannel.send(notDMEmbed);
		}
		else if (isThread) {
			// There's still open thread
			console.log("> User still have an open thread.");
			return replyChannel.send(isThreadEmbed);
		}
		else if (!checkIsMember) {
			// User isn't a member
			console.log("> User aren't a member of main server.");
			return replyChannel.send(notMemberEmbed);
		}
		else if (checkIsBlocked) {
			// User is blocked
			console.log("> User are blocked.");
			return replyChannel.send(blockedEmbed);
		}
		else if (categoryChannel.children.size == 50) {
			// Maximum children for a category reached
			console.log("> Category reached maximum channels.");
			return replyChannel.send(maxEmbed);
		}
		else {
			// none of above, calling newThread function
			return newThread.execute(param, message, args);
		}

	},
};
