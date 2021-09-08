module.exports = {
	name: "userReply",
	async execute(param, message, thread) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const MessageAttachment = param.MessageAttachment;
		const client = param.client;
		const getEmbed = param.getEmbed;
		const locale = param.locale;
		const config = param.config;
		const isBlocked = param.isBlocked;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.fetch(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.fetch(threadServerID);
		const author = message.author;

		// Checking whether user are blocked or not.
		const checkIsBlocked = await isBlocked.execute(param, author.id);
		if(checkIsBlocked) {
			const blocked = locale.blocked;
			const blockedEmbed = getEmbed.execute(param, "", config.error_color, blocked.title, blocked.user);
			console.log("> User are blocked.");
			return message.channel.send(blockedEmbed);
		}

		// Validating main server and thread server.
		const configNames = [];
		if(!mainServer) configNames.push("mainServerID");
		if(!threadServer) configNames.push("threadServerID");
		if (configNames.length !== 0) {
			const reqConfig = locale.reqConfig(configNames.join("\n"));
			const reqConfigEmbed = getEmbed.execute(param, "", config.error_color, reqConfig.title, reqConfig.description);
			console.log(`> Required config(s): ${configNames.join(", ")}`);
			return message.channel.send(reqConfigEmbed);
		}

		// Checking whether user are main server member.
		const checkIsMember = await mainServer.members.fetch(author.id);
		if(!checkIsMember) {
			const notMember = locale.notMember(mainServer.name);
			const notMemberEmbed = getEmbed.execute(param, "", config.error_color, notMember.title, notMember.description);
			console.log("> User aren't a member of main server.");
			return message.channel.send(notMemberEmbed);
		}

		// Checking user thread channel existence.
		const threadChannel = threadServer ? await threadServer.channels.cache.get(thread.channelID) : false;
		if(!threadChannel) {
			const noChannel = locale.noThreadChannel(config.prefix);
			const noChannelEmbed = getEmbed.execute(param, "", config.error_color, noChannel.title, noChannel.description);
			console.log("> Can't find this user's thread channel.");
			return message.channel.send(noChannelEmbed);
		}

		// Send user reply to thread server.
		const userReplyEmbed = getEmbed.execute(param, "", config.received_color, locale.msgReceived, message.content, "", author);
		async function send() {
			await threadChannel.send(userReplyEmbed);

			if (message.attachments.size > 0) {
				await message.attachments.forEach(async atch => {
					const attachment = new MessageAttachment(atch.url);
					await threadChannel.send(attachment);
				});
			}
		}
		send().then(message.react("✅"));

	},
};
