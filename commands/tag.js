module.exports = {
	name: "tag",
	aliases: ["t"],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: ["mainServerID"], // Configs needed to run this command.
	usage: ["<tag name>", "<list|l>", "<add|+> <tag name>", "<del|-> <tag name>", "<edit|=> <tag name>", "<info|?> <tag name>"],
	description: "Send, add, delete, edit, show an info or show list of saved response(s).",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const db = param.db;
		const tagPrefix = param.dbPrefix.tag;
		const threadPrefix = param.dbPrefix.thread;
		const getEmbed = param.getEmbed;
		const author = message.author;
		const channel = message.channel;

		const tagCollection = await db.list(tagPrefix);
		const tagList = tagCollection.map(tag => `\`${tag.slice(tagPrefix.length)}\``).join(", ") || "No available tag";

		const cancelEmbed = getEmbed.execute(param, "", config.error_color, "Canceled", "Command are canceled.");
		const timeoutEmbed = getEmbed.execute(param, "", config.error_color, "Timeout", "Timeout, command are canceled.");

		const firstArg = args.shift();
		switch(firstArg.toLowerCase()) {
		case "l": // fallthrough
		case "list": {
			const tagListEmbed = getEmbed.execute(param, "", config.info_color, "Tags", tagList);
			replyChannel.send(tagListEmbed);
			break;
		}
		case "+": // fallthrough
		case "add": {
			const tagName = args.join(" ").toLowerCase();

			const duplicatedEmbed = getEmbed.execute(param, "", config.error_color, "Duplicated", `There's a tag named (\`${tagName}\`) already.`);
			const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `Succesfully add (\`${tagName}\`) tag.`);
			const waitingEmbed = getEmbed.execute(param, "", config.info_color, "Response", "Please write the response for this tag.\nType `cancel` to cancel the command.\n\n`Timeout: 30 seconds.`");

			const dbKey = tagPrefix + tagName;
			const isDuplicated = await db.get(dbKey);
			if(isDuplicated) {
				console.log("> Duplicated tag name.");
				return replyChannel.send(duplicatedEmbed);
			}
			else {
				const filter = msg => msg.author.id == message.author.id;

				replyChannel.send(waitingEmbed).then(() => {
					message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
						.then(async collected => {
							if (collected.first().content.toLowerCase() == "cancel") {
								console.log("> Command canceled.");
								return replyChannel.send(cancelEmbed);
							}
							else {
								const content = collected.first().content;
								db.set(dbKey, content).then(() => {
									console.log(`> Added [${tagName}] tag.`);
									return replyChannel.send(successEmbed);
								});
							}
						})
						.catch(async () => {
							console.log("> Timeout.");
							return replyChannel.send(timeoutEmbed);
						});
				});
			}
			break;
		}
		case "-": // fallthrough
		case "del": {
			const tagName = args.join(" ").toLowerCase();
			const dbKey = tagPrefix + tagName;
			const isTag = await db.get(dbKey);

			const noTagEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `Couldn't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
			const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `Deleted (\`${tagName}\`) tag.`);

			if(!isTag) {
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else {
				db.delete(dbKey).then(() => {
					console.log(`> Deleted ${tagName}.`);
					return replyChannel.send(successEmbed);
				});
			}
			break;
		}
		case "=": // fallthrough
		case "edit": {
			const tagName = args.join(" ").toLowerCase();
			const dbKey = tagPrefix + tagName;
			const isTag = await db.get(dbKey);

			const noTagEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `Couldn't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
			const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `Succesfully edit (\`${tagName}\`) tag response.`);
			const waitingEmbed = getEmbed.execute(param, "", config.info_color, "Response", "Please write new response for this tag.\nType `cancel` to cancel the command.\n\n`Timeout: 30 seconds.`");

			if(!isTag) {
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else {
				const filter = msg => msg.author.id == message.author.id;

				replyChannel.send(waitingEmbed).then(() => {
					message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
						.then(async collected => {
							if (collected.first().content.toLowerCase() == "cancel") {
								return replyChannel.send(cancelEmbed);
							}
							else {
								const content = collected.first().content;
								db.set(dbKey, content).then(() => {
									console.log(`> Edited [${tagName}] tag.`);
									return replyChannel.send(successEmbed);
								});
							}
						})
						.catch(async () => {
							console.log("> Timeout.");
							return replyChannel.send(timeoutEmbed);
						});
				});
			}
			break;
		}
		case "?": // fallthrough
		case "info": {
			const tagName = args.join(" ").toLowerCase();
			const dbKey = tagPrefix + tagName;
			const isTag = await db.get(dbKey);

			const noTagEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `CouldnS't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);

			if(!isTag) {
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else {
				const data = [];
				data.push(`**Name** : ${tagName}`);
				data.push(`**Response** : \`\`\`${isTag}\`\`\``);

				const tagInfoEmbed = getEmbed.execute(param, "", config.info_color, "Tag Information", data.join("\n"));
				replyChannel.send(tagInfoEmbed);
			}
			break;
		}
		default: {
			args.unshift(firstArg);
			const tagName = args.join(" ").toLowerCase();

			const mainServerID = config.mainServerID;
			const mainServer = await client.guilds.cache.get(mainServerID);
			const dbKey = tagPrefix + tagName;

			const isTag = await db.get(dbKey);
			const userID = channel.name.split("-").pop();
			const isThread = await db.get(threadPrefix + userID);

			const noTagEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `Couldn't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
			const noDMEmbed = getEmbed.execute(param, "", config.error_color, "Not Sent", "User disabled Direct Message.");

			if(!isTag) {
			// can't find tag
				console.log("> Tag not found.");
				return replyChannel.send(noTagEmbed);
			}
			else if(!isThread) {
			// no user thread
				console.log("> Not a thread channel.");
				const noThreadEmbed = getEmbed.execute(param, "", config.info_color, "", isTag);
				return message.channel.send(noThreadEmbed).then(message.delete());
			}
			else {
			// There's user thread and tag
				console.log("> Thread channel.");
				const checkIsBlocked = await param.isBlocked.execute(param, userID);
				const checkIsMember = await param.isMember.execute(param, author.id);
				const blockedEmbed = getEmbed.execute(param, "", config.error_color, "Blocked", "User blocked.");
				const notMemberEmbed = getEmbed.execute(param, "", config.error_color, "Not a Member", `User aren't inside [**${mainServer.name}**] guild.`);

				const filter = (reaction, user) => {
					return user.id === message.author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌");
				};

				const waitingEmbed = getEmbed.execute(param, "", config.info_color, isTag + "\n\nReact with ✅ to send, ❌ to cancel.\n`Timeout: 30 seconds.`");

				const botMsg = await replyChannel.send(waitingEmbed);
				await botMsg.react("✅");
				await botMsg.react("❌");

				botMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] })
					.then(async collected => {
						if (collected.first().emoji.name == "❌") {
						// user react with ❌
							await botMsg.reactions.removeAll();
							console.log("> Command canceled.");
							return replyChannel.send(cancelEmbed);
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
							const getUser = await mainServer.members.cache.get(userID).user;
							const userDMEmbed = getEmbed.execute(param, "", config.sent_color, "Message Received", isTag, "", mainServer);
							const threadChannelEmbed = getEmbed.execute(param, author, config.sent_color, "Tag Message Sent", isTag, "", getUser);

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
						return replyChannel.send(timeoutEmbed);
					});
			}
			break;
		}
		}
	},
};
