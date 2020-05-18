module.exports = {
	name: "configFn",
	async execute(param) {
		const Discord = param.Discord;
		const client = param.client;
		const config = param.config;
		// getting the name of each config (prefix, botOwnerID, etc)
		const configKeys = Object.keys(config);
		const botConfig = [];
		const serverConfig = [];
		const embedColorConfig = [];
		// As separator for server related config and bot config.
		const maintenanceIndex = configKeys.indexOf("maintenance");
		// As separator for server related config and embed color config.
		const info_colorIndex = configKeys.indexOf("info_color");

		for (let i = 0; i < configKeys.length; i++) {
			if(i <= maintenanceIndex) {
				botConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
			} else if(i > maintenanceIndex && i < info_colorIndex) {
				serverConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
			} else if(i >= info_colorIndex && i < configKeys.length) {
				embedColorConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
			}
		}

		const configEmbed = new Discord.MessageEmbed()
			.setColor(config.info_color)
			.setTitle("Configuration")
			.addField("~ Bot ~", botConfig)
			.addField("~ Server ~", serverConfig)
			.addField("~ Embed Color ~", embedColorConfig)
			.setThumbnail(client.user.avatarURL())
			.setFooter(client.user.tag, client.user.avatarURL())
			.setTimestamp();
		return configEmbed;
	}
};
