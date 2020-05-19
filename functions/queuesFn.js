module.exports = {
	name: "queues",
	async execute(param, message, args) {
		const client = param.client;
		const config = param.config;
		const QueueDB = param.QueueDB;
		const getEmbed = param.getEmbed;
		const newThread = param.new;

		const threadServerID = config.threadServerID;
		const threadServer = client.guilds.cache.get(threadServerID);
		const categoryID = config.categoryID;
		const categoryChannel = threadServer.channels.cache.get(categoryID);
		const childrenSize = categoryChannel.children.size;
		const queueList = await QueueDB.findAll({ attributes: ['userID', 'messageID'] });
		let addThread = 50 - childrenSize;
		let remain = queueList.length - addThread;
		if(remain < 0) remain = 0;
		if (queueList.length == 0) {
			addThread = 0;
		} else if(queueList.length < addThread) {
			addThread += remain;
		}

		const data = [];
		data.push(`**Queued Threads** : ${queueList.length} threads`);
		data.push(`**Channels in Category** : ${childrenSize} channels`);
		data.push(`**Created Threads** : ${addThread} threads`);
		data.push(`**Queue Remaining** : ${remain} threads`);
		data.push(`**Logs** : `)

		const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);

		if (childrenSize < 50 && queueList.length > 0) {
			for (let i = 0; i < addThread && i < queueList.length; i++) {
				const thisQue = queueList[i];
				const getUser = client.users.cache.get(thisQue.userID);

				if(!getUser) {
					data.push(`\`Couldn't find user (${thisQue.userID})\``);
					await QueueDB.destroy({ where: { userID: thisQue.userID } });
				} else {
					const getChannel = getUser.dmChannel;
					if(!getChannel) {
						data.push(`\`Couldn't find dmChannel for (${thisQue.userID})\``);
						await QueueDB.destroy({ where: { userID: thisQue.userID } });
					} else {
						const thisMsg = getChannel.messages.cache.get(thisQue.messageID);
						if (thisMsg) {
							// getting rid the prefix and command
							const [, matchedPrefix] = thisMsg.content.match(prefixRegex);
							const thisArgs = thisMsg.content.slice(matchedPrefix.length).trim().split(/ +/);
							thisArgs.shift().toLowerCase();

							// create new thread
							await newThread.execute(param, thisMsg, thisArgs);
							// delete it from queue database
							await QueueDB.destroy({ where: { userID: thisQue.userID } });
						} else {
							data.push(`\`User (${thisQue.userID}) deleted the message\``);
							await QueueDB.destroy({ where: { userID: thisQue.userID } });
						}
					}
				}
			}
		}
		const embed = getEmbed.execute(param, config.info_color, "Queue Information", data.join('\n'))
		message.channel.send(embed);
	}
}