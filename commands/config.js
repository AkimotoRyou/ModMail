module.exports = {
	name: "config",
	aliases: ["configuration", "settings", "cfg"],
	level: "Admin",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const locale = param.locale;
		const config = param.config;
		const configKeys = Object.keys(config);// getting the name of each config (prefix, botOwnerID, etc)

		const firstArg = args.shift();

		if(!firstArg || (firstArg.toLowerCase() !== "info" && firstArg.toLowerCase() !== "i" && firstArg !== "?")) {
			const botConfig = [];
			const serverConfig = [];
			const colorConfig = [];
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
					colorConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
				}
			}

			// fields
			const configList = locale.configList(config.prefix, botConfig, serverConfig, colorConfig);
			const fields = [configList.botField, configList.serverField, configList.colorField];

			const configEmbed = param.getEmbed.execute(param, client.user, config.info_color, configList.title, configList.description, fields, "", client.user.displayAvatarURL());
			return replyChannel.send(configEmbed);
		}
		else {
			const configName = args.shift();
			if (!configName) {
				const noArg = locale.noArg(param, this.name);
				const noArgEmbed = param.getEmbed.execute(param, "", config.warning_color, noArg.title, noArg.description, "", noArg.footer);
				console.log("> Missing Arguments.");
				return replyChannel.send(noArgEmbed);
			}

			const isConfig = await configKeys.includes(configName);
			if (!isConfig) {
				const noConfig = locale.noConfig(param, configName);
				const noConfigEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, noConfig);
				console.log("> Invalid config name.");
				return replyChannel.send(noConfigEmbed);
			}

			const configInfo = locale.configInfo(configName);
			const configInfoEmbed = await getEmbed.execute(param, "", config.info_color, configInfo.title, configInfo.description);
			return replyChannel.send(configInfoEmbed);
		}
	},
};
