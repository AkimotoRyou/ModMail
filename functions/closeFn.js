module.exports = {
	name: "close",
	async execute(param, message, args) {
		const Discord = param.Discord;
		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const ThreadDB = param.ThreadDB;
		const updateActivity = param.updateActivity;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.cache.get(threadServerID);
		const logChannelID = config.logChannelID;
		const logChannel = await threadServer.channels.cache.get(logChannelID);
		const author = message.author;
		const channel = message.channel;

		const isThread = await ThreadDB.findOne({ where: { channelID: channel.id } });
		const addSpace = args.join(' ');
		const deleteSeparator = addSpace.split(/-+/);
		const reason = deleteSeparator.shift();
		const note = deleteSeparator.shift() || "empty";

		const noThreadEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn't find any thread asociated with this channel.`);

		if (!isThread) {
			return channel.send(noThreadEmbed);
		} else {
			const user = await client.users.cache.get(isThread.userID);
			const logDescription = `${isThread.threadTitle}\n**Reason** : ${reason}\n**Note** : ${note}`;
			const userDescription = `${isThread.threadTitle}\n**Reason** : ${reason}`;

			let logEmbed;
			const userDMEmbed = new Discord.MessageEmbed()
				.setColor(config.warning_color)
				.setAuthor(author.tag, author.avatarURL())
				.setTitle("Thread Closed")
				.setDescription(userDescription)
				.setFooter(mainServer.name, mainServer.iconURL())
				.setTimestamp();

			if (user) {
				logEmbed = new Discord.MessageEmbed()
					.setColor(config.warning_color)
					.setAuthor(author.tag, author.avatarURL())
					.setTitle("Thread Closed")
					.setDescription(logDescription)
					.setFooter(`${user.tag} | ${user.id}`, user.avatarURL())
					.setTimestamp();
				await user.send(userDMEmbed);
				await logChannel.send(logEmbed);
			} else {
				logEmbed = new Discord.MessageEmbed()
					.setColor(config.warning_color)
					.setAuthor(author.tag, author.avatarURL())
					.setTitle("Thread Closed")
					.setDescription(logDescription)
					.setFooter(`Can't find user | ${isThread.userID}`)
					.setTimestamp();
				await logChannel.send(logEmbed);
			}

			const rowCount = await ThreadDB.destroy({ where: { userID: isThread.userID } });
			if (rowCount > 0) {
				console.log(`Closing Thread.`);
			}
			await updateActivity.execute(param);
			return channel.delete();
		}

	}
};
