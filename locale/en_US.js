module.exports = {
	name: "en_US",
	commands: {
		block: {
			name: "block",
			description: "Show or modify blocked user list.",
			listTitle: "Blocked Users",
			infoTitle: "Block Info",
			addSuccess(userID) {
				return `\`Succesfully add "${userID}" to block list.\``;
			},
			removeSuccess(userID) {
				return `\`Succesfully remove "${userID}" from block list.\``;
			}
		},
		close: {
			name: "close",
			description: "Close an active thread.",
			closeTitle: "Thread Closed",
		},
		config: {
			name: "config",
			description: "Show or modify bot configuration.",
			setSuccess(configName, value) {
				return `\`Succesfully set "${configName}" config value to "${value}".\``;
			},
			resetSuccess(configName) {
				return `\`Succesfully reset "${configName}" config value.\``;
			},
			getInfo(configName) {
				const configData = [];
				switch (configName) {
				case "ownerID":
					configData.push("An owner of this bot, can use all commands.");
					configData.push("**Requirements** : \n🔹 Only bot owner can change this value.\n🔹 Input can't be empty.");
					break;
				case "cooldown":
					configData.push("Cooldown for each commands (in seconds).");
					configData.push("**Requirements** : \n🔹 Any number that's greater or equal to zero.\n🔹 Input can't be empty.");
					break;
				case "maintenance":
					configData.push("Maintenance mode toggle.");
					break;
				case "language":
					configData.push("Default language used by the bot.");
					configData.push("**Requirements** : \n🔹 Any language name inside [locale] folders.\n🔹 Input can't be empty.");
					configData.push("**Notes** : \n`- Only affect non command triggered actions.`");
					break;
				case "mainServerID":
					configData.push("Server that are moderated by moderator.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [server id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any server that have this bot.");
					configData.push("🔹 Value can be same as [Thread Server].");
					configData.push("**Note** : Right click server icon or server name => `Copy ID`");
					break;
				case "threadServerID":
					configData.push("Server where thread channels will be created.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [server id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any server that have this bot.");
					configData.push("🔹 Value can be same as [Main Server].");
					configData.push("**Note** : Right click server icon or server name => `Copy ID`");
					break;
				case "categoryID":
					configData.push("Category channel that will hold thread channels.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [channel id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any category channel that are inside thread server.");
					configData.push("🔹 [Thread Server] value can't be empty.");
					configData.push("**Note** : Right click the category => `Copy ID`.");
					configData.push("To fully understand what category channel is, check this [link](https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101).");
					configData.push("`ps. Discord.js treat it as channel that's why i use this term too.`");
					break;
				case "logChannelID":
					configData.push("Channel where thread logs will be sent.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [channel id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any channel inside thread server.");
					configData.push("🔹 [Thread Server] value can't be empty.");
					configData.push("**Note** : Right click the channel => `Copy ID`");
					break;
				case "adminRoleID":
					configData.push("Role that will have administrator permission level.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [role id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any role inside thread server.");
					configData.push("🔹 [Thread Server] value can't be empty.");
					configData.push("**Note** : Go to `Server Settings` => `Roles` => `More` => `Copy ID`");
					break;
				case "modRoleID":
					configData.push("Role that will have moderator permission level.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [role id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any role inside thread server.");
					configData.push("🔹 [Thread Server] value can't be empty.");
					configData.push("**Note** : Go to `Server Settings` => `Roles` => `More` => `Copy ID`");
					break;
				case "mentionedRoleID":
					configData.push("The role that will be mentioned on new thread.");
					configData.push("**Requirements** :");
					configData.push("🔹 Value must be a valid [role id](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).");
					configData.push("🔹 Any role at thread server including `@here` and `@everyone`.");
					configData.push("🔹 Value can be a hyphen '-' character (no one mentioned).");
					configData.push("**Note** : Go to `Server Settings` => `Roles` => `More` => `Copy ID`");
					break;
				case "infoColor":
					configData.push("Color used for any information related embeds.");
					configData.push("**Requirements** : \n🔹 [Hex color code](https://html-color.codes/) or [color string](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable).");
					break;
				case "sentColor":
					configData.push("Color used for any message sent on threads related embeds.");
					configData.push("**Requirements** : \n🔹 [Hex color code](https://html-color.codes/) or [color string](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable).");
					break;
				case "receivedColor":
					configData.push("Color used for any message received on threads related embeds.");
					configData.push("**Requirements** : \n🔹 [Hex color code](https://html-color.codes/) or [color string](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable).");
					break;
				case "closeColor":
					configData.push("Color used for any message on thread closing related embeds.");
					configData.push("**Requirements** : \n🔹 [Hex color code](https://html-color.codes/) or [color string](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable).");
					break;
				default:
					configData.push("`Information still not available.`");
					break;
				}
				return configData.join("\n");
			},
		},
		create: {
			name: "create",
			description: "Create new thread.",
			maxThread: "`Maximum active thread reached, please wait until some thread are closed.`",
			duplicate: "`You already have an active thread.`",
			dmDisabled(title) {
				return `\`Successfully create "${title}" thread.\nPlease enable Direct Message to continue.\``;
			},
			newSuccess(title) {
				return `\`Successfully create "${title}" thread.\``;
			},
			newThread(locale, threadTitle) {
				return {
					title: "Thread Created",
					userDM: `${threadTitle}\n\`Please describe your issue using /${locale.commands.reply.name} command.\``,
				};
			},
		},
		help: {
			name: "help",
			description: "Show command's information.",
			title: "Command Info",
			cmdName: "Name",
			cmdID: "Command ID",
			cmdLang: "Language",
			cmdLevel: "Required Level",
			cmdDescription: "Description",
			cmdUsage: "Usage",
		},
		ping: {
			name: "ping",
			description: "Calculate bot latency.",
			reply(latency, responseTime) {
				return `API Latency: ${latency}ms\nResponse Time: ${responseTime}ms`;
			},
		},
		reply: {
			name: "reply",
			description: "Reply an active thread.",
			contentDescription: "Reply with message.",
			tagDescription: "Reply with saved response.",
			dmDisabled: "`User disabled their Direct Message.`",
		},
		tag: {
			name: "tag",
			description: "Show or modify saved response.",
			listTitle: "Available Tags",
			addSuccess(tagName) {
				return `\`Successfully add "${tagName}" to tag list.\``;
			},
			setSuccess(tagName) {
				return `\`Successfully change "${tagName}" content.\``;
			},
			removeSuccess(tagName) {
				return `\`Successfully remove "${tagName}" from tag list.\``;
			}
		},
		thread: {
			name: "thread",
			description: "Show or modify active threads.",
			infoTitle: "Thread Info",
			listTitle: "Active Threads",
			activeThread: "`That's an active thread channel.`",
			dmDisabled(userID, channelID) {
				return `\`Successfully bind "${userID}" thread to "${channelID}" channel.\nCannot send messages to this user.\``;
			},
			bindSuccess(userID, channelID) {
				return `\`Successfully bind "${userID}" thread to "${channelID}" channel.\``;
			},
		}
	},
	activity: {
		ready: "Ready",
		maintenance: "~ Under Maintenance ~",
		thread(threadCount, maxThreads) {
			return `${threadCount}/${maxThreads} Active threads`;
		},
	},
	anon: {
		name: "anon",
		description: "Hide command operator.",
	},
	cooldown(time) {
		return `Command in cooldown for next ${time}s.`;
	},
	content: {
		name: "content",
		description: "Target content.",
		invalid: "`Target content can't be empty.`",
	},
	errorMsg(error, ownerID) {
		const output = [
			`An error occurred, please contact bot owner <@${ownerID}>.`,
			`🔸 Name: \`${error.name}\``,
			`🔸 Message: \`${error.message}\``,
		];
		return output.join("\n");
	},
	misc: {
		true: "True",
		default: "Default",
		Owner: "Owner",
		Admin: "Admin",
		Moderator: "Moderator",
		User: "User",
		reason: "Reason",
		channel: "Channel",
		createdAt: "Created At",
		joinedAt: "Joined At",
		roles: "Roles",
		bindTitle: "Thread Bind",
		msgSent: "Message Sent",
		msgReceived: "Message Received",
		deploySuccess: "`Successfully registered application commands.`",
		maintenance: "`Maintenance mode enabled, command disabled.`",
		noPerm: "`You don't have permission to execute this command.`",
		unknownError: "`An error has occured.`",
		_SeparatorBot: "Bot Config",
		_SeparatorServer: "Server Config",
		_SeparatorColor: "Color Config",
	},
	note: {
		name: "note",
		description: "Operation note.",
	},
	operation: {
		name: "operation",
		description: "Command operation.",
		add: "add",
		bind: "bind",
		guild: "guild",
		info: "info",
		list: "list",
		reset: "reset",
		remove: "remove",
		sent: "sent",
		set: "set",
		view: "view",
	},
	page: {
		name: "page",
		description: "Output page.",
		emptyList: "`List empty.`",
	},
	reason: {
		name: "reason",
		description: "Operation reason.",
		invalid: "`Operation reason can't be empty.`",
	},
	show: {
		name: "show",
		description: "Show operation output in public.",
	},
	target: {
		name: "target",
		description: "Operation target.",
		notFound: "`Can't find that target.`",
		invalid: "`That's an invalid target for this operation.`",
		duplicate: "`That target is already in the database.`",
		all: "all",
		ownerID: "Owner",
		cooldown: "Cooldown",
		maintenance: "Maintenance",
		language: "Language",
		mainServerID: "Main Server",
		threadServerID: "Thread Server",
		categoryID: "Category",
		logChannelID: "Log Channel",
		adminRoleID: "Admin Role",
		modRoleID: "Moderator Role",
		mentionedRoleID: "Mentioned Role",
		infoColor: "Info Color",
		sentColor: "Sent Color",
		receivedColor: "Received Color",
		closeColor: "Close Color",
	},
	title: {
		name: "title",
		description: "Thread title.",
	},
	value: {
		name: "value",
		description: "Target value.",
		invalid: "`That's an invalid value for this target.`",
	},
};
