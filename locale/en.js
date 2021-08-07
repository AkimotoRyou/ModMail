const add = ["add", "+"];
const all = "All";
const del = ["del", "-"];
const edit = ["edit", "="];
const info = ["info", "i", "?"];
const list = ["list", "l"];
const notFound = "Not Found";
const success = "Success";
module.exports = {
	name: "en",
	add, all, del, edit, info, list, notFound, success,
	anonAuthor: "[Anonymous]",
	anonSent: "Message Sent Anonymously",
	blockInfo: "Block Info",
	empty: "empty",
	emptyList: "`List empty.`",
	guildCreate: "Joined a Guild",
	guildList: "Guild List",
	mod: "Moderator",
	msgReceived: "Message Received",
	msgSent: "Message Sent",
	note: "Note",
	noChannel: "Can't find that channel.",
	reason: "Reason",
	turnoff: "Turning off...",
	user: "User",
	commands: {
		aclose: {
			name: "aclose",
			usage: ["<reason>-[note]"],
			description: "Anonymously close a user thread.",
			note: false,
		},
		areply: {
			name: "aclose",
			usage: ["[reply message]"],
			description: "Anonymously reply to a user thread.",
			note: false,
		},
		bind: {
			name: "bind",
			usage: ["<userID> <channelID> [thread title]"],
			description: "Bind user thread to a channel.",
			note: "\nOnly use under these circumtances : \n> There is an open thread from other bot.\n> The channel was accidentally deleted.\n> Category channel was accidentally deleted and changed.",
		},
		block: {
			name: "block",
			usage: ["<userID> [reason]", `<${info.join("|")}> <userID>`, `<${list.join("|")}> [page number]`],
			description: "Block a user, show an info, or show list of blocked user(s).",
			note: "User presence isn't checked to enable blocking users that are outside the server.",
		},
		close: {
			name: "close",
			usage: ["[reason]-[note]"],
			description: "Close a user thread.",
			note: false,
		},
		commands: {
			name: "commands",
			usage: false,
			description: "List of all available commands according to your permission level.",
			note: false,
		},
		config: {
			name: "config",
			usage: [`<${info.join("|")}> <config name>`],
			description: "Show current bot config or info about each config.",
			note: "If [mainServerID] and/or [threadServerID] config isn't empty, only administrator in that server can use this command.",
		},
		guilds: {
			name: "guilds",
			usage: false,
			description: "List of guilds (servers) that have this bot.",
			note: "If [mainServerID] and/or [threadServerID] config isn't empty, only administrator in that server can use this command.",
		},
		help: {
			name: "help",
			usage: ["<command name>"],
			description: "Short instruction on how to create a new thread or info on a specific command.",
			note: "Command name case is insensitive (upper case and lower case are same).",
		},
		leave: {
			name: "leave",
			usage: ["<guildID>"],
			description: "Leave a guild (server).",
			note: false,
		},
		new: {
			name: "new",
			usage: ["<thread title>"],
			description: "Create new thread.",
			note: false,
		},
		ping: {
			name: "ping",
			usage: false,
			description: "Calculate bot latency.",
			note: false,
		},
		reload: {
			name: "reload",
			usage: ["<command name>", "<function name>"],
			description: "Reloading command or function.",
			note: "Used to apply changes made to the bot on commands and functions file without restarting the bot.",
		},
		reply: {
			name: "reply",
			usage: ["[reply message]"],
			description: "Reply to a user thread.",
			note: false,
		},
		reset: {
			name: "reset",
			usage: [all, "<config name>"],
			description: "Reset specific or all configuration values.",
			note: false,
		},
		set: {
			name: "set",
			usage: ["<config name> <value>"],
			description: "Set specific configuration value.",
			note: "Config name case is sensitive (upper case and lower case are different).",
		},
		tag: {
			name: "tag",
			usage: ["<tag name>", `<${list.join("|")}>`, `<${add.join("|")}> <tag name>`, `<${del.join("|")}> <tag name>`, `<${edit.join("|")}> <tag name>`, `<${info.join("|")}> <tag name>`],
			description: "Send, add, delete, edit, show an info or show list of saved response(s).",
			note: false,
		},
		thread: {
			name: "thread",
			usage: [`<${info.join("|")}> <userID>`, `<${list.join("|")}> [page number]`],
			description: "Show a user thread information or list of open thread(s).",
			note: false,
		},
		turnoff: {
			name: "turnoff",
			usage: false,
			description: "Turn off the bot.",
			note: false,
		},
		unblock: {
			name: "unblock",
			usage: ["<userID>"],
			description: "Unblock user from creating new thread.",
			note: false,
		},
	},

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	activity(prefix, threadCount, maxThreads) {
		return {
			default: `${threadCount}/${maxThreads} Active threads | ${prefix}commands`,
			maintenance: "~ Under Maintenance ~",
		};
	},
	bindCmd(userID, channelID) {
		return {
			binded: `Binded <@${userID}> (\`${userID}\`) thread to <#${channelID}>.`,
			active: {
				title: "Action Denied",
				description: "That's active thread channel of another user.",
			},
			invalid: {
				title: "Invalid Channel",
				description: "That channel can't be a thread channel.\nRequirements: ```- Inside ModMail category.\n- A text channel\n- Not active ModMail channel.```",
			},
		};
	},
	blocked: {
		title: "Blocked",
		admin: "User are blocked, thread related functions disabled.",
		user: "You are blocked, thread related functions disabled.",
	},
	blockDuplicate(userID) {
		return {
			title: "Duplicated",
			description: `<@${userID}> (\`${userID}\`) is already blocked.`,
		};
	},
	blockSuccess(userID) {return `Succesfully block <@${userID}> (\`${userID}\`).`;},
	close(userID) {
		return {
			title: "Thread Closed",
			anonTitle: "Thread Closed Anonymously",
			noUserFooter: `Can't find user | ${userID}`,
		};
	},
	cmdInfo(prefix, command) {
		const data = [];
		const localeCmd = this.commands[command.name];

		data.push(`**Name** : ${command.name}`);
		if (command.aliases && command.aliases.length !== 0) data.push(`**Aliases** : ${command.aliases.join(", ")}`);
		if (command.level) data.push(`**Required Level** : ${command.level}`);
		data.push(`**Guild Only** : ${command.guildOnly}`);
		if (command.reqConfig) data.push(`**Required Config** : ${command.reqConfig.map(key => `\`${key}\``).join(", ")}`);

		const usages = [];
		if(!command.args) usages.push(`\`${prefix}${localeCmd.name}\``);
		if(localeCmd.usage) {
			localeCmd.usage.forEach(key => {
				usages.push(`\`${prefix}${localeCmd.name} ${key}\``);
			});
		}
		data.push(`**Usage** : ${usages.join(", ")}`);

		if (localeCmd.description) data.push(`**Description** : ${localeCmd.description}`);
		if (localeCmd.note) data.push(`**Note** : \`${localeCmd.note}\``);

		return {
			title: "Command Info",
			description: data.join("\n"),
		};
	},
	cmdList(param, ownerCmdName, adminCmdName, modCmdName, userCmdName) {
		const ownerCmd = [], adminCmd = [], modCmd = [], userCmd = [];

		ownerCmdName.forEach(name => {
			const cmd = this.commands[name];
			if(cmd) ownerCmd.push(`**${cmd.name}** : ${cmd.description}`);
		});
		adminCmdName.forEach(name => {
			const cmd = this.commands[name];
			if(cmd) adminCmd.push(`**${cmd.name}** : ${cmd.description}`);
		});
		modCmdName.forEach(name => {
			const cmd = this.commands[name];
			if(cmd) modCmd.push(`**${cmd.name}** : ${cmd.description}`);
		});
		userCmdName.forEach(name => {
			const cmd = this.commands[name];
			if(cmd) userCmd.push(`**${cmd.name}** : ${cmd.description}`);
		});

		return {
			title: "Command List",
			description: `Use \`${param.config.prefix}${this.commands.help.name} ${this.commands.help.usage[0]}\` to get information for each command.`,
			ownerField: `~ Owner Level ~;${ownerCmd.join("\n") || this.empty}`,
			adminField: `~ Admin Level ~;${adminCmd.join("\n") || this.empty}`,
			modField: `~ Moderator Level ~;${modCmd.join("\n") || this.empty}`,
			userField: `~ User Level ~;${userCmd.join("\n") || this.empty}`,
		};
	},
	configInfo(configName) {
		const configData = [];
		switch(configName) {
		case "prefix":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : To differentiate between a command and non command.");
			configData.push("**Requirements** : \n`> Any input that didn't have [space] as it'll be ignored.`");
			break;
		case "botOwnerID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : An owner of this bot can use any commands anywhere.");
			configData.push("**Requirements** : \n`> Only bot owner can change this value.\n> Input can't be empty.`");
			break;
		case "language":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Default language used by the bot.");
			configData.push("**Notes** : \n`- Only affect non command triggered actions.`");
			break;
		case "cooldown":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Cooldown for each commands (in seconds).");
			configData.push("**Requirements** : \n`> Any number that's greater or equal to zero.\n> Input can't be empty.`");
			break;
		case "maintenance":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Maintenance mode toggle. Config changed according previous value.");
			break;
		case "mainServerID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : The server that is used by users who will use this bot to ask moderators.");
			configData.push("**Requirements** : \n`> Any server that have this bot.\n> Value can be same as [threadServerID].`");
			break;
		case "threadServerID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : The server where thread channels will be on.");
			configData.push("**Requirements** : \n`> Any server that have this bot.\n> Value can be same as [mainServerID].`");
			break;
		case "categoryID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Category channel where thread channels will be created.");
			configData.push("**Requirements** : \n`> Any category channel that are inside thread server.\n> [threadServerID] value can't be empty.`");
			configData.push("**Note** : To understand what category channel is, check this [link](https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101).");
			configData.push("`ps. Discord.js treat it as channel that's why i use this term too.`");
			break;
		case "logChannelID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Channel where thread logs will be sent.");
			configData.push("**Requirements** : \n`> Any channel inside thread server.\n> [threadServerID] value can't be empty.`");
			break;
		case "adminRoleID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Role that will have administrator permission level.");
			configData.push("**Requirements** : \n`> Any role inside thread server.\n> [threadServerID] value can't be empty.`");
			break;
		case "modRoleID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Role that will have moderator permission level.");
			configData.push("**Requirements** : \n`> Any role inside thread server.\n> [threadServerID] value can't be empty.`");
			break;
		case "mentionedRoleID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : The role that will be mentioned on new thread.");
			configData.push("**Requirements** : \n`> Can be empty (no one mentioned).\n> Any role at thread server including here and everyone [set mentionedRoleID everyone].`");
			break;
		case "botChannelID":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Channel where user can only use to execute commands (any commands in other channels will be ignored except help commands).");
			configData.push("**Requirements** : \n`> Can be empty (everyone can use any commands anywhere).\n> Any channels inside main server.\n> Shouldn't be a category channel (Discord.js treat categories as a channel too).`");
			break;
		case "info_color":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Color used for any information related embeds.");
			configData.push("**Requirements** : \n`> Hex code color input.`");
			break;
		case "warning_color":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Color used for any warning related embeds.");
			configData.push("**Requirements** : \n`> Hex code color input.`");
			break;
		case "error_color":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Color used for any error related embeds.");
			configData.push("**Requirements** : \n`> Hex code color input.`");
			break;
		case "sent_color":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Color used for any message sent on threads related embeds.");
			configData.push("**Requirements** : \n`> Hex code color input.`");
			break;
		case "received_color":
			configData.push(`**Name** : ${configName}`);
			configData.push("**Description** : Color used for any message received on threads related embeds.");
			configData.push("**Requirements** : \n`> Hex code color input.`");
			break;
		default:
			configData.push("`Information still not available.`");
			break;
		}
		return {
			title: "Config Info",
			description: configData.join("\n"),
		};
	},
	configList(prefix, botConfig, serverConfig, colorConfig) {
		return {
			title: "Config List",
			description: `Use \`${prefix}${this.commands.config.name} ${this.commands.config.usage[0]}\` to get information for each config.`,
			botField: `~ Bot ~;${botConfig.join("\n") || this.empty}`,
			serverField: `~ Server ~;${serverConfig.join("\n") || this.empty}`,
			colorField: `~ Embed Color ~;${colorConfig.join("\n") || this.empty}`,
		};
	},
	errorMsg(botOwnerID, error) {
		return {
			title: "An Error Occured",
			description: `**Contact bot Owner** : <@${botOwnerID}>\n**Error Name** : \`${error.name}\`\n**Error Message** : \`${error.message}\``,
		};
	},
	guildOnly: {
		title: "Command Unavailable",
		description: "This command can't be used inside Direct Message.",
	},
	instruction(prefix) {
		return {
			title: "Instruction",
			description: `In Direct Message, use \`${prefix}new Your thread title here\` to create a new thread (**Thread Created!** will be displayed). You don't need to use any command after your thread created. Describe your issue afterward.`,
		};
	},
	leaveCmd(guild) {return `Leaving [**${guild.name}**] (\`${guild.id}\`) guild.`;},
	maintenance: {
		title: "Maintenance",
		description: "All functions are disabled.",
	},
	newCmd: {
		title: "Action Denied",
		active: "You still have an active thread.",
		notDM: "This command can only be used inside Direct Message.",
		maxThread: "This server reach it's maximum threads available, please wait until some of the threads are closed.",
	},
	newThread(moment, threadTitle, member, roles) {
		const userData = [];
		userData.push(`**Created at**: ${moment(member.user.createdAt).format("D MMM YYYY, HH:mm")}`);
		userData.push(`**Joined at**: ${moment(member.joinedAt).format("D MMM YYYY, HH:mm")}`);
		userData.push(`**Roles**: ${roles}`);
		return {
			title: "New Thread",
			info: `User Info;${userData.join("\n")}`,
			created: {
				title: "Thread Created!",
				description: `**Title** : ${threadTitle}\n\`Please describe your issue. (No command needed.)\``,
			},
		};
	},
	noArg(param, cmdName) {
		const localeCmd = this.commands[cmdName];
		const command = param.client.commands.get(cmdName);
		const description = ["You didn't provide required arguments."];
		const usages = [];
		if(!command.args) usages.push(`\`${param.config.prefix}${localeCmd.name}\``);
		if(localeCmd.usage) {
			for (let i = 0;i < localeCmd.usage.length; i++) {
				usages.push(`\`${param.config.prefix}${localeCmd.name} ${localeCmd.usage[i]}\``);
			}
		}
		description.push(`**Usages** : ${usages.join(", ")}`) ;
		if(localeCmd.note) {
			description.push(`**Notes** : \`${localeCmd.note}\``);
		}
		return {
			title: "Missing Arguments",
			description: description.join("\n"),
			footer: "<>: required, []: optional",
		};
	},
	noConfig(param, configName) {
		const configKeys = Object.keys(param.config);
		const configList = configKeys.map(conf => `\`${conf}\``).join(", ");
		return `Can't find config named \`${configName}\`.\nAvailable names : ${configList}`;
	},
	noDM: {
		title: "Message Not Sent",
		description: "Can't send messages to this user",
	},
	noGuild(guildID) {return `Can't find guild with ID of (\`${guildID}\`).`;},
	noPerm: {
		title: "Missing Permission",
		description: "You don't have permission to run this command.",
	},
	notBlocked(userID) {return`<@${userID}> (\`${userID}\`) isn't blocked.`;},
	notCmd(prefix) {
		return {
			title: "Not a Command",
			description: `That's not a valid command name or alias.\nUse \`${prefix}commands\` to show available commands.`,
		};
	},
	noThread: {
		channel: "Can't find any thread associated with this channel.",
		user: "Can't find any thread associated with that user id.",
	},
	noThreadChannel(prefix) {
		return {
			title: "Missing Thread Channel",
			description: `Can't find your thread channel, ask admin to use \`${prefix}bind\` command.`,
		};
	},
	notMember(mainServerName) {
		return {
			title: "Not a Member",
			admin: `User aren't a member of **${mainServerName}** guild.`,
			user: `You aren't a member of **${mainServerName}** guild.`,
		};
	},
	pagedList(pages, pageNumber) {
		return {
			blockList: "Blocked User(s)",
			threadList: "Active Thread(s)",
			footer: `Page ${pageNumber} from ${pages} page(s).`,
		};
	},
	ping: {
		title: "Pong",
		msg: "Ping?",
		response: "Response Time",
		latency: "API Latency",
	},
	reload: {
		action: "Reloaded",
		cmd: "command",
		fn: "function",
		loc: "locale",
		cmdNames: "Command Names",
		fnNames: "Function Names",
		locNames: "Locale Names",
		notCmdFnLoc: "That's not a command, function, or locale name.",
	},
	reqConfig(configNames) {
		return {
			title: "Required Configuration",
			description: `The following configuration cannot be empty or invalid : \n${configNames}`,
		};
	},
	resetCmd(resetName) {return `${resetName} config value is reset to default value.`;},
	setCmd(botOwnerID, configName, inputValue, configList, langList) {
		return {
			notOwner: {
				title: "Missing Permission",
				description: `Only bot owner [<@${botOwnerID}>] can change this value.`,
			},
			changed: `The value of \`${configName}\` changed to \`${inputValue}\`.`,
			reqConfig: {
				title: "Configuration Needed",
				noMainServer: "`mainServerID` can't be empty or invalid to change this config.",
				noThreadServer: "`threadServerID` can't be empty or invalid to change this config.",
			},
			invalidArg: {
				title: "Invalid Arguments",
				category: "That isn't a category channel.",
				channelMain: "Can't find that channel inside main server.",
				channelThread: "Can't find that channel inside thread server.",
				color: "Use hex code for color input.\nCheck : <https://html-color.codes/>",
				empty: "This config value can't be empty.",
				language: `Can't find that language.\n Available languages : ${langList}`,
				negative: "The value can't be negative.",
				nan: "That isn't a number.",
				notFound: `Can't find config named \`${configName}\`.\nAvailable names : ${configList}`,
				role: "Can't find that role inside thread server.",
				server: "Can't find that server.",
				text: "That isn't a text channel.",
				user: "Can't find that user.",
			},
		};
	},
	tagCmd(shiftedTagName) {
		const cancelCmd = "cancel"; // Phrase key to cancel the command.
		return {
			added: `Succesfully add (\`${shiftedTagName}\`) tag.`,
			cancelCmd,
			cancelMsg: "Command canceled.",
			deleteTag: `Deleted ${shiftedTagName} tag.`,
			duplicate: {
				title: "Duplicated",
				description: `There's a tag named (\`${shiftedTagName}\`) already.`,
			},
			editTag: `Edited ${shiftedTagName} tag.`,
			noTag: `Can't find tag named as ${shiftedTagName}.`,
			react: "\n\nReact with ✅ to send, ❌ to cancel.",
			tagInfo: {
				name: "Name",
				response: "Response",
				title: "Tag Info",
			},
			tagList: "Tag List",
			tagResponse: {
				title: "Tag Response",
				description: `Please write the response for this tag.\nType \`${cancelCmd}\` to cancel the command.`,
				footer: "Timeout: 30 seconds.",
			},
			tagSent: "Saved Response Sent",
			timeoutMsg: "Timeout.",
		};
	},
	threadInfo: {
		userTag: "User Tag",
		noUser: "Can't find this user in Main Server.",
		userID: "User ID",
		threadCh: "Thread Channel",
		title: "Thread Info",
	},
	unblockCmd(userID) {
		return {
			notBlocked: `<@${userID}> (\`${userID}\`) isn't blocked.`,
			unblock: `Succesfully unblock <@${userID}> (\`${userID}\`).`,
		};
	},

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
};