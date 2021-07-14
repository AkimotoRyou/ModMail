module.exports = {
	name: "message",
	once: false,
	disabled: false, // Change to 'true' to disable this event.
	async execute(param, ...args) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const Discord = param.Discord;
		const client = param.client;
		const cooldowns = param.cooldowns;
		const config = param.config;
		const db = param.db;
		const dbPrefix = param.dbPrefix;
		const getEmbed = param.getEmbed;
		const message = args[0];
		const author = message.author;
		const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		if(author.bot) return console.log(`> ${author.tag} is a bot.`);
		let now = Date.now();
		let timestamps, cooldownAmount;

		// Activity Cooldown
		if (!cooldowns.has("botActivity")) {
			cooldowns.set("botActivity", new Discord.Collection());
		}
		timestamps = cooldowns.get("botActivity");
		cooldownAmount = 10000; // 10 seconds
		if (!timestamps.has("botActivity")) {
			await param.updateActivity.execute(param);
		}
		timestamps.set("botActivity", now);
		setTimeout(() => timestamps.delete("botActivity"), cooldownAmount);
		// ----------------------------

		// Permission Check
		const guildID = message.guild ? message.guild.id : null;
		param.isOwner = author.id === config.botOwnerID;
		let adminPerm = false;
		let adminRole = false;
		if(guildID) {
			// If message is inside a guild, check author administrator permission.
			adminPerm = message.member.hasPermission("ADMINISTRATOR");
		}
		if(config.adminRoleID != "empty" && guildID) {
			// If adminRoleID isn't empty and message inside a guild, check whether author have admin role or not.
			adminRole = message.member.roles.cache.get(config.adminRoleID) ? true : false;
		}
		if (config.mainServerID == "empty" && config.threadServerID == "empty") {
			// If main and thread server isn't set yet, check whether author have admin permission or admin role.
			param.isAdmin = adminPerm || adminRole;
		}
		else {
			// Else, check whether the message also come from main or thread server.
			param.isAdmin = (guildID == config.mainServerID || guildID == config.threadServerID) && (adminPerm || adminRole);
		}
		if(config.modRoleID != "empty" && guildID) {
			// If adminRoleID isn't empty and message inside a guild, check whether author have moderator role or not.
			param.isModerator = message.member.roles.cache.get(config.modRoleID) ? true : false;
		}
		// ----------------------------

		// Deciding channel to reply
		const guild = message.guild;
		const channel = message.channel;
		const mainServerID = config.mainServerID;
		const threadServerID = config.threadServerID;
		const botChannelID = config.botChannelID;

		let replyChannel;
		if(guild) {
			// If it's inside a guild
			if ((mainServerID == "empty" || threadServerID == "empty" || guild.id == mainServerID || guild.id == threadServerID) && (botChannelID == "empty" || channel.id == botChannelID || channel.parent == config.categoryID)) {
				// If it's either inside main or thread server or when it's not set yet, and it's inside a bot or thread channel or if bot channel is empty.
				replyChannel = message.channel;
			}
			else {
				// Else, send the reply through DM.
				replyChannel = author;
			}
		}
		else {
			// Else, send the reply through DM.
			replyChannel = author;
		}
		// -------------------------

		try {
			const maintenanceEmbed = getEmbed.execute(param, "", config.error_color, "Maintenance", "All functions are disabled.");

			// checking whether user use prefix or mention the bot
			const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);
			if (!prefixRegex.test(message.content)) {
				// user didn't use prefix or mention the bot
				console.log("> No prefix.");
				if(guild) {
					// message are inside a guild
					return console.log("> Message inside a guild, ignored.");
				}
				else {
					// Direct Message
					const isThread = await db.get(dbPrefix.thread + author.id);
					if(!isThread) {
						// User didn't have any open thread
						return console.log("> User doesn't have an open thread, ignored.");
					}
					else if(config.maintenance == "1" && !param.isOwner && !param.isAdmin) {
						// Maintenance mode enabled
						replyChannel.send(maintenanceEmbed).then(() => {
							return console.log("> Maintenance mode enabled, ignored.");
						});
					}
					else {
						// User have open thread and maintenance mode disabled
						const temp = isThread.split("-");
						const thread = {
							channelID: temp.shift(),
							threadTitle: temp.join("-"),
						};
						return param.userReply.execute(param, message, thread);
					}
				}
			}

			if(config.maintenance == "1" && !param.isOwner && !param.isAdmin) {
				// Maintenance mode enabled
				replyChannel.send(maintenanceEmbed).then(() => {
					return console.log("> Maintenance mode enabled, ignored.");
				});
			}

			const [, matchedPrefix] = message.content.match(prefixRegex);
			const msgArgs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
			const commandName = msgArgs.shift().toLowerCase();
			// finding command that was triggered
			const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			// user using prefix or mention bot, command name is invalid
			if (!command) return console.log(`> ${commandName} isn't a command.`);
			console.log(`> ${author.tag}(${author.id}) called ${commandName} command.`);
			param.cmdName = commandName;

			// cooldown more than 0
			if (config.cooldown > 0) {
				if (!cooldowns.has(command.name)) {
					cooldowns.set(command.name, new Discord.Collection());
				}

				now = Date.now();
				timestamps = cooldowns.get(command.name);
				cooldownAmount = config.cooldown * 1000;

				if (timestamps.has(author.id)) {
					const expirationTime = timestamps.get(author.id) + cooldownAmount;

					if (now < expirationTime) {
						// Uncomment 3 line of codes below so the bot send message when the cooldown isn't over.
						/*
                        const timeLeft = (expirationTime - now) / 1000;
                        const embed = param.getEmbed.execute(param, "", config.info_color, "Cooldown", `${timeLeft.toFixed(1)} second(s).`)
                        replyChannel.send(embed);
                        */
						return console.log("> Command still in cooldown.");
					}
				}

				timestamps.set(author.id, now);
				setTimeout(() => timestamps.delete(author.id), cooldownAmount);
			}

			// command is guildOnly, user trigger it inside Direct Message
			if(command.guildOnly && message.channel.type !== "text" && author.id != config.botOwnerID) {
				const noDMEmbed = param.getEmbed.execute(param, "", config.error_color, "Command Unavailable", "This command can't be used inside Direct Message.");
				console.log("> Guild only command triggered in DM.");
				return replyChannel.send(noDMEmbed);
			}

			// command need arguments to run, user did't gave any
			if(command.args && !msgArgs.length) {
				let description = "You didn't provide any arguments.";

				if(command.usage) {
					const usages = [];
					for (let i = 0;i < command.usage.length; i++) {
						usages.push(`\`${config.prefix}${command.name} ${command.usage[i]}\``);
					}
					description += `\n**Usage** : ${usages.join(", ")}`;
				}
				if(command.note) {
					description += `\n**Note** : \`${command.note}\``;
				}

				const noArgsEmbed = param.getEmbed.execute(param, "", config.warning_color, "Missing Arguments", description);
				console.log("> Missing Arguments.");
				return replyChannel.send(noArgsEmbed);
			}
			await param.commandHandler.execute(param, message, msgArgs, command, replyChannel);
		}
		catch (error) {
			// catching error -> log it in console -> send error message to user
			if(error.message == "Cannot send messages to this user") {
				return console.log(`>> ${error.message} <<`);
			}
			else {
				const errorEmbed = param.getEmbed.execute(param, "", config.error_color, "An Error Occured.", `**Contact bot Owner** : <@${config.botOwnerID}>\n**Error Name** : \`${error.name}\`\n**Error Message** : \`${error.message}\``);
				replyChannel.send(errorEmbed).then(() => {
					return console.log(error);
				});
			}
		}
	},
};