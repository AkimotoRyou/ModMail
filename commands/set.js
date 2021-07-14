module.exports = {
	name: "set",
	aliases: false,
	level: "Admin",
	guildOnly: true,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<config name> <value>"],
	description: "Set specific configuration value.",
	note: "Config name case is sensitive (upper case and lower case are different).",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const configSync = param.configSync;
		const db = param.db;
		const configPrefix = param.dbPrefix.config;
		const configName = args.shift();
		const dbKey = configPrefix + configName;
		let inputValue = args.shift() || "empty";

		// manual toggle since database can only stor String, can't store boolean for maintenance config.
		if(configName == "maintenance") {
			if(config.maintenance == "0") {
				inputValue = "1";
			}
			else {
				inputValue = "0";
			}
		}
		console.log(`> Input name: ${configName}, value: ${inputValue}.`);

		const notOwnerEmbed = getEmbed.execute(param, "", config.warning_color, "Missing Permission", `Only bot owner [<@${config.botOwnerID}>] can change this value.`);
		const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `The value of \`${configName}\` changed to \`${inputValue}\``);
		const notSetEmbed = getEmbed.execute(param, "", config.warning_color, "Configuration Needed", "Please set `mainServerID` and `threadServerID` to change this config.");
		const emptyValueEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Value", "This config value can't be empty.");
		const invalidUserEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid User", "Can't find that user.");
		const notNumberEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Argument", "That isn't a number.");
		const negativeNumberEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Argument", "The value can't be negative.");
		const invalidServerEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Server", "Can't find that server.\n`Make sure the bot joined the server already`");
		const invalidChannelMainEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Channel", "Can't find that channel.\n`Make sure the channel is inside Main Server.`");
		const invalidChannelThreadEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Channel", "Can't find that channel.\n`Make sure the channel is inside Thread Server.`");
		const invalidCategoryEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Category", "That isn't a category channel.");
		const invalidTextChannelEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Channel", "That isn't a text channel.");
		const invalidRoleEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Role", "Can't find that role.\n`Make sure the role is inside Thread Server.`");
		const invalidColorEmbed = getEmbed.execute(param, "", config.warning_color, "Invalid Color", "Use hex code for input.\nCheck : <https://html-color.codes/>");

		// elimination for invalid input
		if(configName == "botOwnerID") {

			if(!param.isOwner) {
				console.log("> Not bot owner.");
				return replyChannel.send(notOwnerEmbed);
			}
			else if(inputValue == "empty") {
				console.log("> Value can't be empty.");
				return replyChannel.send(emptyValueEmbed);
			}
			else if(!client.users.cache.get(inputValue)) {
				console.log("> User not found.");
				return replyChannel.send(invalidUserEmbed);
			}

		}
		else if(configName == "cooldown") {

			if (isNaN(inputValue)) {
				console.log("> Input value isn't a number");
				return replyChannel.send(notNumberEmbed);
			}
			else if(inputValue < 0) {
				console.log("> Negative input value.");
				return replyChannel.send(negativeNumberEmbed);
			}

		}
		else if(configName == "mainServerID" && inputValue != "empty") {

			if(!client.guilds.cache.get(inputValue)) {
				console.log("> Server not found.");
				return replyChannel.send(invalidServerEmbed);
			}

		}
		else if(configName == "threadServerID" && inputValue != "empty") {

			if(!client.guilds.cache.get(inputValue)) {
				console.log("> Server not found.");
				return replyChannel.send(invalidServerEmbed);
			}

		}
		else if(configName == "categoryID" && inputValue != "empty") {

			const threadServer = await client.guilds.fetch(config.threadServerID);
			if(!threadServer) {
				console.log("> Invalid threadServerID.");
				return replyChannel.send(notSetEmbed);
			}

			const getChannel = client.guilds.cache.get(config.threadServerID).channels.cache.get(inputValue);
			if(!getChannel) {
				console.log("> Channel not found.");
				return replyChannel.send(invalidChannelThreadEmbed);
			}
			else if(getChannel.type != "category") {
				console.log("> Not a category channel.");
				return replyChannel.send(invalidCategoryEmbed);
			}

		}
		else if(configName == "logChannelID" && inputValue != "empty") {

			const threadServer = await client.guilds.fetch(config.threadServerID);
			if(!threadServer) {
				console.log("> Invalid threadServerID.");
				return replyChannel.send(notSetEmbed);
			}

			const getChannel = client.guilds.cache.get(config.threadServerID).channels.cache.get(inputValue);
			if(!getChannel) {
				console.log("> Channel not found.");
				return replyChannel.send(invalidChannelThreadEmbed);
			}
			else if(getChannel.type != "text") {
				console.log("> Not a text channel.");
				return replyChannel.send(invalidTextChannelEmbed);
			}

		}
		else if(configName == "botChannelID" && inputValue != "empty") {

			const mainServer = await client.guilds.fetch(config.mainServerID);
			if(!mainServer) {
				console.log("> Invalid mainServerID");
				return replyChannel.send(notSetEmbed);
			}

			const getChannel = client.guilds.cache.get(config.mainServerID).channels.cache.get(inputValue);
			if(!getChannel) {
				console.log("> Channel not found.");
				return replyChannel.send(invalidChannelMainEmbed);
			}
			else if(getChannel.type != "text") {
				console.log("> Not a text channel.");
				return replyChannel.send(invalidTextChannelEmbed);
			}

		}
		else if((configName == "adminRoleID" || configName == "modRoleID") && inputValue != "empty") {

			const threadServer = await client.guilds.fetch(config.threadServerID);
			if(!threadServer) {
				console.log("> Invalid threadServerID.");
				return replyChannel.send(notSetEmbed);
			}
			else if(!client.guilds.cache.get(config.threadServerID).roles.cache.get(inputValue)) {
				console.log("> Role not found.");
				return replyChannel.send(invalidRoleEmbed);
			}

		}
		else if(configName == "mentionedRoleID" && inputValue != "empty" && inputValue != "everyone" && inputValue != "here") {

			const threadServer = await client.guilds.fetch(config.threadServerID);
			if(!threadServer) {
				console.log("> Invalid threadServerID.");
				return replyChannel.send(notSetEmbed);
			}
			else if(!client.guilds.cache.get(config.threadServerID).roles.cache.get(inputValue)) {
				console.log("> Role not found.");
				return replyChannel.send(invalidRoleEmbed);
			}

		}
		else if(configName == "info_color" || configName == "warning_color" || configName == "error_color" || configName == "sent_color" || configName == "received_color") {

			const colorTest = /^#[0-9A-F]{6}$/i;
			if(inputValue == "empty") {
				console.log("> Empty value.");
				return replyChannel.send(emptyValueEmbed);
			}
			else if(colorTest.test(inputValue) == false) {
				console.log("> Invalid input.");
				return replyChannel.send(invalidColorEmbed);
			}

		}

		// getting all the config name from Database
		const configCollection = await db.list(configPrefix);
		const configList = configCollection.map(conf => `\`${conf.slice(configPrefix.length)}\``).join(", ");

		if(configCollection.includes(dbKey)) {
			await db.set(dbKey, inputValue);
			console.log(`> [${dbKey}] value changed to [${inputValue}]`);
			await replyChannel.send(successEmbed).then(async () => {
				await configSync.execute(param);
				if(configName == "maintenance" || configName == "prefix") {
					setTimeout(async ()=> {
						await param.updateActivity.execute(param);
					}, 5000);
				}
			});
		}
		else {
			const notFoundEmbed = getEmbed.execute(param, "", config.error_color, "Invalid Arguments", `Can't find config named \`${configName}\`.\nAvailable names : ${configList}`);
			console.log("> Invalid config name.");
			return replyChannel.send(notFoundEmbed);
		}

	},
};
