module.exports = {
	name: "close",
	aliases: ["c"],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID", "threadServerID", "logChannelID"], // Configs needed to run this command.
	usage: ["[reason]-[note]"],
	description: "Close a user thread.",
	note: false,
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
		const logChannelID = config.logChannelID;
		const logChannel = await threadServer.channels.cache.get(logChannelID);
		const author = message.author;
		const channel = message.channel;

		const userID = channel.name.split("-").pop();
		const isThread = await db.get(threadPrefix + userID);
		const addSpace = args.join(" ");
		const deleteSeparator = addSpace.split(/-+/);
		const reason = deleteSeparator.shift();
		const note = deleteSeparator.shift() || "empty";

		const noThreadEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", "Couldn't find any thread asociated with this channel.");

		if (!isThread) {
			console.log("> Thread not found.");
			return replyChannel.send(noThreadEmbed);
		}
		else {
			const temp = isThread.split("-");
			temp.shift();
			const threadTitle = temp.join("-");
			const user = await client.users.cache.get(userID);
			const logDescription = `${threadTitle}\n**Reason** : ${reason}\n**Note** : ${note}`;
			const userDescription = `${threadTitle}\n**Reason** : ${reason}`;

			let logEmbed;
			const userDMEmbed = getEmbed.execute(param, author, config.warning_color, "Thread Closed", userDescription, "", mainServer);

			if (user) {
				logEmbed = getEmbed.execute(param, author, config.warning_color, "Thread Closed", logDescription, "", user);
				await user.send(userDMEmbed);
				await logChannel.send(logEmbed);
			}
			else {
				logEmbed = getEmbed.execute(param, author, config.warning_color, "Thread Closed", logDescription, "", `Can't find user | ${userID}`);
				await logChannel.send(logEmbed);
			}

			db.delete(threadPrefix + userID).then(() => console.log("> Thread closed."));
			await updateActivity.execute(param);
			return channel.delete().then(() => console.log("> Channel deleted."));
		}
	},
};
