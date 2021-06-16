module.exports = {
	name: "tag",
	async execute(param, message, args) {
		const Discord = param.Discord;
		const client = param.client;
		const config = param.config;
		const db = param.db;
		const tagPrefix = param.dbPrefix.tag;
		const threadPrefix = param.dbPrefix.thread;
		const getEmbed = param.getEmbed;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const author = message.author;
		const channel = message.channel;
		const tagName = args.join(' ').toLowerCase();
		const dbKey = tagPrefix + tagName;

		const isTag = await db.get(dbKey);
		const userID = channel.name.split("-").pop();
		const isThread = await db.get(threadPrefix + userID);
		const tagCollection = await db.list(tagPrefix);
		const tagList = tagCollection.map(tag => `\`${tag.slice(tagPrefix.length)}\``).join(', ') || "No available tag";

		const noTagEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
		const cancelEmbed = getEmbed.execute(param, config.error_color, "Canceled", `Command are canceled.`);
		const timeoutEmbed = getEmbed.execute(param, config.error_color, "Timeout", `Timeout, command are canceled.`);
		const noDMEmbed = getEmbed.execute(param, config.error_color, "Not Sent", `User disabled Direct Message.`);

		if(!isTag) {
			// can't find tag
			console.log(`Tag not found.`);
			return message.channel.send(noTagEmbed);
		} else if(!isThread) {
			// no user thread
			console.log(`Not a thread channel.`);
			const noThreadEmbed = getEmbed.execute(param, config.info_color, "", isTag);
			return message.channel.send(noThreadEmbed).then(message.delete());
		} else {
			// There's user thread and tag
			console.log(`Thread channel.`);
			const checkIsBlocked = await param.isBlocked.execute(param, userID);
			const checkIsMember = await param.isMember.execute(param, author.id);
			const blockedEmbed = getEmbed.execute(param, config.error_color, "Blocked", `User blocked.`);
			const notMemberEmbed = getEmbed.execute(param, config.error_color, "Not a Member", `User aren't inside [**${mainServer.name}**] guild.`);

			const filter = (reaction, user) => {
				return user.id === message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌');
			}

			const waitingEmbed = new param.Discord.MessageEmbed()
				.setColor(config.info_color)
				.setDescription(isTag + `\n\nReact with ✅ to send, ❌ to cancel.\n\`Timeout: 30 seconds.\``)
				.setFooter(param.client.user.tag, param.client.user.avatarURL())
				.setTimestamp();

			const botMsg = await message.channel.send(waitingEmbed);
			await botMsg.react('✅');
			await botMsg.react('❌');

			botMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
				.then(async collected => {
					if (collected.first().emoji.name == '❌') {
						// user react with ❌
						await botMsg.reactions.removeAll();
						return message.channel.send(cancelEmbed);
					} else if (!checkIsMember) {
						// user react with ✅
						// the user that has thread not in main server
						await botMsg.reactions.removeAll();
						return message.channel.send(notMemberEmbed);
					} else if(checkIsBlocked) {
						// the user that has thread are blocked
						await botMsg.reactions.removeAll();
						return message.channel.send(blockedEmbed);
					} else {
						// user are member and not blocked
						const getUser = await mainServer.members.cache.get(userID).user;
						const userDMEmbed = new Discord.MessageEmbed()
							.setColor(config.sent_color)
							.setTitle("Message Received")
							.setDescription(isTag)
							.setFooter(mainServer.name, mainServer.iconURL())
							.setTimestamp();
						const threadChannelEmbed = new Discord.MessageEmbed()
							.setColor(config.sent_color)
							.setAuthor(`[Anonymous] | ${author.tag}`, author.avatarURL())
							.setTitle("Message Sent")
							.setDescription(isTag)
							.setFooter(`${getUser.tag} | ${getUser.id}`, getUser.avatarURL())
							.setTimestamp();

						try{
							await getUser.send(userDMEmbed);
						} catch (error) {
							if(error.message == "Cannot send messages to this user") {
								await botMsg.reactions.removeAll();
								return channel.send(noDMEmbed);
							}
						}
						await channel.send(threadChannelEmbed);
						return message.delete().then(botMsg.delete());
					}
				})
				.catch(collected => {
					return message.channel.send(timeoutEmbed);
				});
		}
	}
};
