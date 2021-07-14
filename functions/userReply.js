module.exports = {
	name: "userReply",
	async execute(param, message, thread) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const MessageAttachment = param.MessageAttachment;
		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const isMember = param.isMember;
		const isBlocked = param.isBlocked;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.cache.get(threadServerID);
		const author = message.author;

		const checkIsBlocked = await isBlocked.execute(param, author.id);

		const blockedEmbed = getEmbed.execute(param, "", config.error_color, "Blocked", "You are blocked from replying to a thread.");
		const noServerEmbed = getEmbed.execute(param, "", config.error_color, "Contact Admin", "`mainServerID` and/or `threadServerID` value is invalid.");
		const noChannelEmbed = getEmbed.execute(param, "", config.error_color, "Channel Not Found", `Couldn't find your thread channel, ask admin to use \`${config.prefix}bind\` command.`);
		const userReplyEmbed = getEmbed.execute(param, "", config.received_color, "Message Received", message.content, "", author);

		const threadChannel = threadServer ? await threadServer.channels.cache.get(thread.channelID) : false;
		async function send() {
			await threadChannel.send(userReplyEmbed);

			if (message.attachments.size > 0) {
				for(const atch in message.attachments) {
					const attachment = new MessageAttachment(atch.url);
					await threadChannel.send(attachment);
				}
			}
		}

		if(checkIsBlocked) {
			// User is blocked
			console.log("> User are blocked.");
			return message.channel.send(blockedEmbed);
		}
		else if (!mainServer || !threadServer) {
			// Can't find main server or thread server
			console.log("> Can't find main or thread server.");
			return message.channel.send(noServerEmbed);
		}
		else {
			const checkIsMember = await isMember.execute(param, author.id);
			const notMemberEmbed = getEmbed.execute(param, "", config.error_color, "Not a Member", `User aren't inside [**${mainServer.name}**] guild.`);

			if(!checkIsMember) {
				console.log("> User aren't a member of main server.");
				return message.channel.send(notMemberEmbed);
			}
			else if(!threadChannel) {
				console.log("> Can't find this user's thread channel.");
				return message.channel.send(noChannelEmbed);
			}
			else {
				send().then(message.react("✅"));
			}
		}

	},
};
