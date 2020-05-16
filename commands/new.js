module.exports = {
	name: 'new',
	aliases: ['neu', 'yeni', '새로운', 'novo', 'nouveau', 'новый', '新', 'nuevo'],
	level: 'User',
	guildOnly: false,
	args: true,
	usage: '[thread title]',
	description: 'Create new thread.',
	note: false,
	async execute(param, message, args) {
		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const newThread = param.newThread;
		const isMember = param.isMember;
		const isBlocked = param.isBlocked;
		const ThreadDB = param.ThreadDB;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.cache.get(threadServerID);
		const botChannelID = config.botChannelID;
		const categoryID = config.categoryID;
		const categoryChannel = await threadServer.channels.cache.get(categoryID);
		const logChannelID = config.logChannelID;
		const author = message.author;

		const isThread = await ThreadDB.findOne({ where: { userID: author.id } });
		const checkIsMember = await isMember.execute(param, author.id);
		const checkIsBlocked = await isBlocked.execute(param, author.id);

		const notMemberEmbed = getEmbed.execute(param, config.error_color, "Not a Member", `You aren't inside [**${mainServer.name}**] guild.`);
		const blockedEmbed = getEmbed.execute(param, config.error_color, "Blocked", `You are blocked from creating new thread.`);
		const isThreadEmbed = getEmbed.execute(param, config.error_color, "Thread Detected", `You still have open thread.`);
		const noCategoryEmbed = getEmbed.execute(param, config.error_color, "Error", "Please contact server admin.\n**Error** : `Couldn't find ModMail category channel.`");
		const maxChannelEmbed = getEmbed.execute(param, config.error_color, "Failed", "Maximum open thread reached.");
		const noServerEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "`mainServerID` and/or `threadServerID` value is empty.");
		const noChannelEmbed = getEmbed.execute(param, config.error_color, "Configuration Needed", "`categoryID` and/or `logChannelID` value is empty.");
		const notDMEmbed = getEmbed.execute(param, config.error_color, "Command Unavailable", "This command can only be used in Direct Message.")

		if (message.guild != null && (message.guild.id == mainServerID || message.guild.id == threadServerID)) {
			// Inside a main server or thread server
			if(botChannelID != "empty" && message.channel.id != botChannelID) {
				// Outside bot channel if it isn't empty
				return;
			} else {
				// Inside bot channel if it isn't empty or any channel if it's empty
				return message.channel.send(notDMEmbed);
			}
		} else if(message.guild != null) {
			// Outside main server or thread server not Direct Message
			return message.channel.send(notDMEmbed);
		} else if(mainServerID == "empty" || threadServerID == "empty") {
			// Direct Message
			// Value of mainServerID or threadServerID is empty
			return message.channel.send(noServerEmbed);
		} else if (categoryID == "empty" || logChannelID == "empty") {
			// Value of categoryID or logChannelID is empty
			return message.channel.send(noChannelEmbed);
		} else if (isThread) {
			// There's still open thread
			return message.channel.send(isThreadEmbed);
		} else if (!checkIsMember) {
			// User isn't a member
			return message.channel.send(notMemberEmbed);
		} else if (checkIsBlocked) {
			// User is blocked
			return message.channel.send(blockedEmbed);
		} else if (!categoryChannel) {
			// Can't find category
			return message.channel.send(noCategoryEmbed);
		} else if (categoryChannel.children.size == 50) {
			// Maximum children for a category reached
			return message.channel.send(maxChannelEmbed);
		} else {
			// none of above, calling newThread function
			return newThread.execute(param, message, args);
		}

	}
};
