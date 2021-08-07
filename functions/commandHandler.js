module.exports = {
	name: "commandHandler",
	async execute(param, message, msgArgs, command, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;
		const locale = param.locale;

		const isOwner = param.isOwner;
		const isAdmin = param.isAdmin;
		const isModerator = param.isModerator;

		const reqConfig = command.reqConfig;
		const data = [];

		if(reqConfig) {
			let owner = false, mainServer = false, threadServer = false, category = false, logChannel = false;
			if(config.botOwnerID !== "empty") {
				owner = await client.users.fetch(config.botOwnerID);
			}
			if(config.mainServerID !== "empty") {
				mainServer = await client.guilds.fetch(config.mainServerID);
			}
			if(config.threadServerID !== "empty") {
				threadServer = await client.guilds.fetch(config.threadServerID);
			}
			if(threadServer) {
				category = threadServer.channels.cache.get(config.categoryID);
				logChannel = threadServer.channels.cache.get(config.logChannelID);
			}
			reqConfig.forEach(configName => {
				switch(configName) {
				case "ownerID":
					if(!owner) data.push(`\`${configName}\``);
					break;
				case "mainServerID":
					if(!mainServer) data.push(`\`${configName}\``);
					break;
				case "threadServerID":
					if(!threadServer) data.push(`\`${configName}\``);
					break;
				case "categoryID":
					if(!category) data.push(`\`${configName}\``);
					break;
				case "logChannelID":
					if(!logChannel) data.push(`\`${configName}\``);
					break;
				default:
					break;
				}
			});
		}

		const reqConf = locale.reqConfig(data.join("\n"));
		const noPerm = locale.noPerm;
		const requiredEmbed = getEmbed.execute(param, "", config.warning_color, reqConf.title, reqConf.description);
		const noPermEmbed = getEmbed.execute(param, "", config.warning_color, noPerm.title, noPerm.description);

		switch(command.level) {
		case "Owner" : {
			if (!isOwner) {
				console.log("> Missing Permission.");
				replyChannel.send(noPermEmbed);
				break;
			}
		}
		// eslint-disable-next-line no-fallthrough
		case "Admin" : {
			if (!isOwner && !isAdmin) {
				console.log("> Missing Permission.");
				replyChannel.send(noPermEmbed);
				break;
			}
		}
		// eslint-disable-next-line no-fallthrough
		case "Moderator" : {
			if (!isOwner && !isAdmin && !isModerator) {
				console.log("> Missing Permission.");
				replyChannel.send(noPermEmbed);
				break;
			}
		}
		// eslint-disable-next-line no-fallthrough
		default : {
			if (data.length !== 0) {
				console.log(`> Required config(s): ${data.join(", ")}.`);
				replyChannel.send(requiredEmbed);
				break;
			}
			else {
				await command.execute(param, message, msgArgs, replyChannel);
				break;
			}
		}
		}
	},
};