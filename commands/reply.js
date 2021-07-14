module.exports = {
	name: "reply",
	aliases: false,
	level: "Moderator",
	guildOnly: true,
	args: false, // in case there's only attachment with no message
	reqConfig: ["mainServerID"], // Configs needed to run this command.
	usage: ["[reply message]"],
	description: "Reply to a user thread.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const MessageAttachment = param.MessageAttachment;
		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const isMember = param.isMember;
		const isBlocked = param.isBlocked;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.fetch(mainServerID);
		const author = message.author;

		const userID = message.channel.name.split("-").pop();
		const isThread = await db.get(threadPrefix + userID);
		const checkIsBlocked = await isBlocked.execute(param, author.id);

		const blockedEmbed = getEmbed.execute(param, "", config.error_color, "Blocked", "User blocked.");
		const noDMEmbed = getEmbed.execute(param, "", config.error_color, "Not Sent", "User disabled Direct Message.");
		const noUserEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", "Couldn't find user in my collection.");
		const noThreadEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", "Couldn't find any thread asociated with this channel.");

		if (!isThread) {
			console.log("> Thread not found.");
			return replyChannel.send(noThreadEmbed);
		}
		else {
			const checkIsMember = await isMember.execute(param, userID);
			const notMemberEmbed = getEmbed.execute(param, "", config.error_color, "Not a Member", `User aren't inside [**${mainServer.name}**] guild.`);

			if (!checkIsMember) {
				console.log("> The user isn't a main server member.");
				return replyChannel.send(notMemberEmbed);
			}
			else if (checkIsBlocked) {
				console.log("> The user is blocked.");
				return replyChannel.send(blockedEmbed);
			}
			else {
				const member = await mainServer.members.fetch(userID);

				if (!member) {
					console.log("> Can't fetch user data.");
					return replyChannel.send(noUserEmbed);
				}
				else {
					const user = member.user;
					const description = args.join(" ");
					const userDMEmbed = getEmbed.execute(param, author, config.sent_color, "Message Received", description, "", mainServer);
					const threadChannelEmbed = getEmbed.execute(param, author, config.sent_color, "Message Sent", description, "", user);

					try{
						await user.send(userDMEmbed);
					}
					catch (error) {
						if(error.message == "Cannot send messages to this user") {
							console.log("> Recipient's DM are disabled.");
							return replyChannel.send(noDMEmbed);
						}
					}
					await replyChannel.send(threadChannelEmbed);
					if (message.attachments.size > 0) {
						await message.attachments.forEach(async atch => {
							const attachment = new MessageAttachment(atch.url);
							await user.send(attachment);
							await replyChannel.send(attachment);
						});
					}
					return message.delete().then(() => console.log("> Message deleted."));
				}

			}
		}
	},
};
