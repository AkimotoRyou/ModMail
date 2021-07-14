module.exports = {
	name: "commandHandler",
	async execute(param, message, msgArgs, command, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const getEmbed = param.getEmbed;
		const config = param.config;

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
				mainServer = client.guilds.cache.get(config.mainServerID);
			}
			if(config.threadServerID !== "empty") {
				threadServer = client.guilds.cache.get(config.threadServerID);
			}
			if(threadServer) {
				category = threadServer.channels.cache.get(config.categoryID);
				logChannel = threadServer.channels.cache.get(config.logChannelID);
			}
			reqConfig.forEach(configName => {
				switch(configName) {
				case "ownerID":
					if(!owner) data.push(`- \`${configName}\``);
					break;
				case "mainServerID":
					if(!mainServer) data.push(`- \`${configName}\``);
					break;
				case "threadServerID":
					if(!threadServer) data.push(`- \`${configName}\``);
					break;
				case "categoryID":
					if(!category) data.push(`- \`${configName}\``);
					break;
				case "logChannelID":
					if(!logChannel) data.push(`- \`${configName}\``);
					break;
				default:
					break;
				}
			});
		}

		const requiredEmbed = getEmbed.execute(param, "", config.warning_color, "Required Configuration", `The following configuration cannot be empty or invalid : \n${data.join("\n")}`);
		const noPermEmbed = getEmbed.execute(param, "", config.warning_color, "Missing Permission", "You don't have permission to run this command.");

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
				console.log(`> Configuration needed: ${data.join(", ")}.`);
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