module.exports = {
	name: "close",
	aliases: ["c"],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID", "threadServerID", "logChannelID"], // Configs needed to run this command.
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
		const logChannelID = config.logChannelID;
		const logChannel = await threadServer.channels.cache.get(logChannelID);
		const author = message.author;
		const channel = message.channel;

		const userID = channel.name.split("-").pop();
		const isThread = await db.get(threadPrefix + userID);

		const noThread = locale.noThread;
		const noThreadEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, noThread.channel);

		if (!isThread) {
			console.log("> Thread not found.");
			return replyChannel.send(noThreadEmbed);
		}
		else {
			const temp = isThread.split("-");
			temp.shift();
			const threadTitle = temp.join("-");
			const user = await client.users.fetch(userID);

			const addSpace = args.join(" ");
			const deleteSeparator = addSpace.split(/-+/);
			const reason = deleteSeparator.shift();
			const note = deleteSeparator.shift() || locale.empty;
			const logDescription = `${threadTitle}\n**${locale.reason}** : ${reason}\n**${locale.note}** : ${note}`;
			const userDescription = `${threadTitle}\n**${locale.reason}** : ${reason}`;
			const close = locale.close(userID);

			let logEmbed;
			const userDMEmbed = getEmbed.execute(param, author, config.warning_color, close.title, userDescription, "", mainServer);

			if (user) {
				logEmbed = getEmbed.execute(param, author, config.warning_color, close.title, logDescription, "", user);
				await user.send(userDMEmbed).catch(e => console.log(e.message));
				await logChannel.send(logEmbed);
			}
			else {
				logEmbed = getEmbed.execute(param, author, config.warning_color, close.title, logDescription, "", close.noUserFooter);
				await logChannel.send(logEmbed);
			}

			db.delete(threadPrefix + userID).then(() => console.log("> Thread closed."));
			await updateActivity.execute(param);
			return channel.delete().then(() => console.log("> Channel deleted."));
		}
	},
};
