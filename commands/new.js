module.exports = {
	name: "new",
	aliases: ["neu", "yeni", "새로운", "novo", "nouveau", "новый", "新", "nuevo"],
	level: "User",
	guildOnly: false,
	args: true,
	reqConfig: ["mainServerID", "threadServerID", "categoryID", "logChannelID"], // Configs needed to run this command.
	usage: ["[thread title]"],
	description: "Create new thread.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const newThread = param.newThread;
		const isMember = param.isMember;
		const isBlocked = param.isBlocked;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.cache.get(threadServerID);
		const categoryID = config.categoryID;
		const categoryChannel = await threadServer.channels.cache.get(categoryID);
		const author = message.author;

		const isThread = await db.get(threadPrefix + author.id);
		const checkIsMember = await isMember.execute(param, author.id);
		const checkIsBlocked = await isBlocked.execute(param, author.id);

		const notMemberEmbed = getEmbed.execute(param, "", config.error_color, "Not a Member", `You aren't inside [**${mainServer.name}**] guild.`);
		const blockedEmbed = getEmbed.execute(param, "", config.error_color, "Blocked", "You are blocked from creating new thread.");
		const isThreadEmbed = getEmbed.execute(param, "", config.error_color, "Thread Detected", "You still have open thread.");
		const notDMEmbed = getEmbed.execute(param, "", config.error_color, "Command Unavailable", "This command can only be used in Direct Message.");
		const maxEmbed = getEmbed.execute(param, "", config.error_color, "Maximum Thread Reached", "Maximum threads for this server is reached, please wait until some of the threads closed.");

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
