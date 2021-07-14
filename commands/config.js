module.exports = {
	name: "config",
	aliases: ["configuration", "settings", "cfg"],
	level: "Admin",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<info|i|?> <config name>"],
	description: "Show current bot config or info about each config.",
	note: "If [mainServerID] and/or [threadServerID] config isn't empty, only administrator in that server can use this command.",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const configKeys = Object.keys(config);// getting the name of each config (prefix, botOwnerID, etc)

		const firstArg = args.shift();

		if(!firstArg || (firstArg.toLowerCase() !== "info" && firstArg.toLowerCase() !== "i" && firstArg !== "?")) {
			const botConfig = [];
			const serverConfig = [];
			const embedColorConfig = [];
			// As separator for server related config and bot config.
			const maintenanceIndex = configKeys.indexOf("maintenance");
			// As separator for server related config and embed color config.
			const info_colorIndex = configKeys.indexOf("info_color");

			for (let i = 0; i < configKeys.length; i++) {
				const confName = configKeys[i];
				const confValue = config[confName];
				if(i <= maintenanceIndex) {
					botConfig.push(`${confName} : \`${confValue}\``);
				}
				else if(i > maintenanceIndex && i < info_colorIndex) {
					if (confName.match(/role/i)) {
						serverConfig.push(`${confName} : \`${confValue}\` ~ <@&${confValue}>`);
					}
					else if (confName.match(/channel/i)) {
						serverConfig.push(`${confName} : \`${confValue}\` ~ <#${confValue}>`);
					}
					else {
						serverConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
					}
				}
				else if(i >= info_colorIndex && i < configKeys.length) {
					embedColorConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
				}
			}

			// fields
			const botField = `~ Bot ~;${botConfig.join("\n")}`;
			const serverField = `~ Server ~;${serverConfig.join("\n")}`;
			const colorField = `~ Embed Color ~;${embedColorConfig.join("\n")}`;

			const configEmbed = param.getEmbed.execute(param, client.user, config.info_color, "Configuration", "", [botField, serverField, colorField], "", client.user.displayAvatarURL());
			return replyChannel.send(configEmbed);
		}
		else {
			const configName = args.shift();
			if (!configName) {
				const noArgsEmbed = param.getEmbed.execute(param, "", config.warning_color, "Missing Arguments", `**Usage** : \`${config.prefix}${this.name} ${this.usage[0]}\``);
				console.log("> Missing Arguments.");
				return replyChannel.send(noArgsEmbed);
			}

			const isConfig = await configKeys.includes(configName);
			if (!isConfig) {
				const configList = configKeys.map(conf => `\`${conf}\``).join(", ");
				const noConfigEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `Couldn't find config named \`${configName}\`.\nAvailable names : ${configList}`);
				console.log("> Invalid config name.");
				return replyChannel.send(noConfigEmbed);
			}

			const configData = [];
			switch (configName) {
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
				configData.push("`Information is still not available.`");
			}

			const dataEmbed = await getEmbed.execute(param, "", config.info_color, "Configuration Information", configData.join("\n"));
			return replyChannel.send(dataEmbed);
		}
	},
};
