module.exports = {
	name: "tag",
	aliases: ["t"],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID"], // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const db = param.db;
		const tagPrefix = param.dbPrefix.tag;
		const threadPrefix = param.dbPrefix.thread;
		const getEmbed = param.getEmbed;
		const locale = param.locale;

		const author = message.author;
		const channel = message.channel;
		const tagCollection = await db.list(tagPrefix);
		const tagList = tagCollection.map(tag => `\`${tag.slice(tagPrefix.length)}\``).join(", ") || locale.emptyList;

		const firstArg = args.shift().toLowerCase();
		const shiftedTagName = args.join(" ").toLowerCase();
		const tagName = `${firstArg} ${shiftedTagName}`;
		const tagCmd = locale.tagCmd(shiftedTagName);
		const cancelMsg = tagCmd.cancelMsg;
		const timeoutMsg = tagCmd.timeoutMsg;
		const tagResponse = tagCmd.tagResponse;

		const noTagEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, tagCmd.noTag);
		const responseEmbed = getEmbed.execute(param, "", config.info_color, tagResponse.title, tagResponse.description, "", tagResponse.footer);

		if(locale.list.includes(firstArg)) {
			const tagListEmbed = getEmbed.execute(param, "", config.info_color, tagCmd.tagList, tagList);
			return replyChannel.send(tagListEmbed);
		}
		else if(locale.add.includes(firstArg)) {
			const duplicatedEmbed = getEmbed.execute(param, "", config.error_color, tagCmd.duplicate.title, tagCmd.duplicate.description);
			const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, tagCmd.added);

			const dbKey = tagPrefix + shiftedTagName;
			const isDuplicated = await db.get(dbKey);
			if(isDuplicated) {
				console.log("> Duplicated tag name.");
				return replyChannel.send(duplicatedEmbed);
			}
			else {
				const filter = msg => msg.author.id == message.author.id;

				replyChannel.send(responseEmbed).then(() => {
					message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
						.then(async collected => {
							if (collected.first().content.toLowerCase() == tagCmd.cancelCmd) {
								console.log("> Command canceled.");
								return replyChannel.send(cancelMsg);
							}
							else {
								const content = collected.first().content;
								db.set(dbKey, content).then(() => {
									console.log(`> Added [${shiftedTagName}] tag.`);
									return replyChannel.send(successEmbed);
								});
							}
						})
						.catch(async () => {
							console.log("> Timeout.");
							return replyChannel.send(timeoutMsg);
						});
				});
			}
		}
		else if(locale.del.includes(firstArg)) {
			const dbKey = tagPrefix + shiftedTagName;
			const isTag = await db.get(dbKey);

			const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, tagCmd.deleteTag);

			if(!isTag) {
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else {
				db.delete(dbKey).then(() => {
					console.log(`> Deleted ${shiftedTagName}.`);
					return replyChannel.send(successEmbed);
				});
			}
		}
		else if(locale.edit.includes(firstArg)) {
			const dbKey = tagPrefix + shiftedTagName;
			const isTag = await db.get(dbKey);

			const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, tagCmd.editTag);

			if(!isTag) {
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else {
				const filter = msg => msg.author.id == message.author.id;

				replyChannel.send(responseEmbed).then(() => {
					message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
						.then(async collected => {
							if (collected.first().content.toLowerCase() == tagCmd.cancelCmd) {
								return replyChannel.send(cancelMsg);
							}
							else {
								const content = collected.first().content;
								db.set(dbKey, content).then(() => {
									console.log(`> Edited [${shiftedTagName}] tag.`);
									return replyChannel.send(successEmbed);
								});
							}
						})
						.catch(async () => {
							console.log("> Timeout.");
							return replyChannel.send(timeoutMsg);
						});
				});
			}
		}
		else if(locale.info.includes(firstArg)) {
			const dbKey = tagPrefix + shiftedTagName;
			const isTag = await db.get(dbKey);

			if(!isTag) {
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else {
				const data = [];
				data.push(`**${tagCmd.tagInfo.name}** : ${shiftedTagName}`);
				data.push(`**${tagCmd.tagInfo.response}** : \`\`\`${isTag}\`\`\``);

				const tagInfoEmbed = getEmbed.execute(param, "", config.info_color, tagCmd.tagInfo.title, data.join("\n"));
				return replyChannel.send(tagInfoEmbed);
			}
		}
		else {
			const mainServerID = config.mainServerID;
			const mainServer = await client.guilds.fetch(mainServerID);
			const dbKey = tagPrefix + tagName;

			const isTag = await db.get(dbKey);
			const userID = channel.name.split("-").pop();
			const isThread = await db.get(threadPrefix + userID);

			const noDMEmbed = getEmbed.execute(param, "", config.error_color, locale.noDM.title, locale.noDM.description);

			if(!isTag) {
			// can't find tag
				return console.log("> Tag not found.");
			}
			else if(!isThread) {
			// no user thread
				console.log("> Not a thread channel.");
				const noThreadEmbed = getEmbed.execute(param, author, config.info_color, "", isTag);
				return message.channel.send(noThreadEmbed).then(message.delete());
			}
			else {
			// There's user thread and tag
				console.log("> Thread channel.");
				const checkIsBlocked = await param.isBlocked.execute(param, userID);
				const checkIsMember = await mainServer.members.fetch(author.id);
				const notMember = locale.notMember(mainServer.name);
				const blockedEmbed = getEmbed.execute(param, "", config.error_color, locale.blocked.title, locale.blocked.admin);
				const notMemberEmbed = getEmbed.execute(param, "", config.error_color, notMember.title, notMember.admin);

				const filter = (reaction, user) => {
					return user.id === message.author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌");
				};

				const waitingEmbed = getEmbed.execute(param, author, config.info_color, "", isTag + tagCmd.react, "", tagResponse.footer);

				const botMsg = await replyChannel.send(waitingEmbed);
				await botMsg.react("✅");
				await botMsg.react("❌");

				botMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] })
					.then(async collected => {
						if (collected.first().emoji.name == "❌") {
						// user react with ❌
							await botMsg.reactions.removeAll();
							console.log("> Command canceled.");
							return replyChannel.send(cancelMsg);
						}
						else if (!checkIsMember) {
						// user react with ✅
						// the user that has thread not in main server
							await botMsg.reactions.removeAll();
							console.log("> User isn't a member.");
							return replyChannel.send(notMemberEmbed);
						}
						else if(checkIsBlocked) {
						// the user that has thread are blocked
							await botMsg.reactions.removeAll();
							console.log("> User are blocked.");
							return replyChannel.send(blockedEmbed);
						}
						else {
						// user are member and not blocked
							const getMember = await mainServer.members.fetch(userID);
							const getUser = getMember.user;
							const userDMEmbed = getEmbed.execute(param, "", config.sent_color, locale.msgReceived, isTag, "", mainServer);
							const threadChannelEmbed = getEmbed.execute(param, author, config.sent_color, tagCmd.tagSent, isTag, "", getUser);

							try{
								await getUser.send(userDMEmbed);
							}
							catch (error) {
								if(error.message == "Cannot send messages to this user") {
									await botMsg.reactions.removeAll();
									console.log("> Recipient's DM are disabled.");
									return channel.send(noDMEmbed);
								}
							}
							await channel.send(threadChannelEmbed);
							return message.delete().then(botMsg.delete());
						}
					})
					.catch(async () => {
						await botMsg.reactions.removeAll();
						console.log("> Timeout.");
						return replyChannel.send(timeoutMsg);
					});
			}
		}
	},
};
