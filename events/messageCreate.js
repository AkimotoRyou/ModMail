module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "messageCreate",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	disabled: false,
	once: false,
	async execute(param, message) {
		const { client, config, getEmbed, deployCommands } = param;
		const { author, content, channel, member } = message;
		const locale = param.locale[config.language];

		try {
			const mentionRegex = new RegExp(`^(<@!?${client.user.id}>)\\s*`);
			if (!mentionRegex.test(content)) return;

			const isOwner = author.id == config.ownerID;
			const isAdmin = member ? member.permissions.has("ADMINISTRATOR") : isOwner;
			const perm = isOwner || (config.ownerID == "-" && isAdmin);
			if (!perm) return;

			const [, matchedPrefix] = content.match(mentionRegex);
			const msgArgs = content.slice(matchedPrefix.length).trim().split(/ +/);
			const commandName = msgArgs.shift().toLowerCase();
			if (commandName == "deploy") {
				const isDeployed = await deployCommands.execute(param);
				channel.send(isDeployed);
			}
			else if (commandName == "setup") {
				if (param.running) return;
				const cancel = "`Command canceled.`";
				const keys = ["mainServerID", "threadServerID", "categoryID", "logChannelID", "adminRoleID", "modRoleID", "mentionedRoleID"];
				let index = 0;
				let current = keys[index];
				let title = `Set "${locale.target[current]}" value`;
				let info = `**[ ${locale.target[current]} ]**\n${locale.commands.config.getInfo(current)}`;
				const footer = "Reply to answer • Type 'cancel' to quit • Timeout: 1m";
				let embed = await getEmbed.execute(param, "", config.infoColor, title, info, "", footer);
				const botMessage = await message.reply({ embeds: [embed] });
				const filter = response => {
					return response.reference?.messageId == botMessage.id && response.author.id === message.author.id;
				};
				const waitMsg = async function() {
					param.running = true;
					message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
						.then(async collected => {
							const userMsg = collected.first();
							const userReply = userMsg.content.toLowerCase();
							if (userReply == "cancel") {
								param.running = false;
								if (userMsg.deletable) await userMsg.delete();
								return await botMessage.edit({ content: cancel, embeds: [] });
							}
							if (index == keys.length - 1) {
								param.running = false;
								const output = await param.deployCommands.execute(param);
								if (userMsg.deletable) await userMsg.delete();
								return await botMessage.edit({ content: output, embeds: [] });
							}

							const output = await param.set.config(param, locale, author, current, userReply);
							if (output == locale.value.invalid) {
								embed = await getEmbed.execute(param, "", config.infoColor, title, `${info}\n\n⚠️ ${output}`, "", footer);
								await botMessage.edit({ embeds: [embed] });
								await userMsg.delete().catch(() => {return});
								return waitMsg();
							}
							else {
								index++;
								current = keys[index];
								title = `Set "${locale.target[current]}" value.`;
								info = `**[ ${locale.target[current]} ]**\n${locale.commands.config.getInfo(current)}`;
								embed = await getEmbed.execute(param, "", config.infoColor, title, info, "", footer);
								await botMessage.edit({ embeds: [embed] });
								if (userMsg.deletable) await userMsg.delete();
								return waitMsg();
							}
						})
						.catch(async () => {
							param.running = false;
							return await botMessage.edit({ content: "`Timeout.`", embeds: [] });
						});
				};
				await waitMsg();
			}
			else {
				return;
			}
		}
		catch (error) {
			console.log(error);
		}
	},
};
