module.exports = {
	name: "set",
	aliases: [],
	level: "Admin",
	guildOnly: true,
	args: true,
	reqConfig: false, // Configs needed to run this command.
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


		// getting all the config name from Database
		const configCollection = await db.list(configPrefix);
		const configList = configCollection.map(conf => `\`${conf.slice(configPrefix.length)}\``).join(", ");
		const langList = client.locale.map(lang => `\`${lang.name}\``).join(", ");

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

		const setCmd = param.locale.setCmd(config.botOwnerID, configName, inputValue, configList, langList);
		const notOwner = setCmd.notOwner, reqConf = setCmd.reqConfig, invalidArg = setCmd.invalidArg;
		const notOwnerEmbed = getEmbed.execute(param, "", config.warning_color, notOwner.title, notOwner.description);
		const successEmbed = getEmbed.execute(param, "", config.info_color, param.locale.success, setCmd.changed);
		const noMainEmbed = getEmbed.execute(param, "", config.warning_color, reqConf.title, reqConf.noMainServer);
		const noThreadEmbed = getEmbed.execute(param, "", config.warning_color, reqConf.title, reqConf.noThreadServer);
		const emptyValueEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.empty);
		const invalidLangEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.language);
		const invalidUserEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.user);
		const notNumberEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.nan);
		const negativeNumberEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.negative);
		const invalidServerEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.server);
		const invalidChannelMainEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.channelMain);
		const invalidChannelThreadEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.channelThread);
		const invalidCategoryEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.category);
		const invalidTextChannelEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.text);
		const invalidRoleEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.role);
		const invalidColorEmbed = getEmbed.execute(param, "", config.warning_color, invalidArg.title, invalidArg.color);

		// elimination for invalid input
		if(configName == "botOwnerID") {

			const getUser = await client.users.fetch(inputValue);
			if(!param.isOwner) {
				console.log("> Not bot owner.");
				return replyChannel.send(notOwnerEmbed);
			}
			else if(inputValue == "empty") {
				console.log("> Value can't be empty.");
				return replyChannel.send(emptyValueEmbed);
			}
			else if(!getUser) {
				console.log("> User not found.");
				return replyChannel.send(invalidUserEmbed);
			}

		}
		else if(configName == "language") {

			if(inputValue == "empty") {
				console.log("> Value can't be empty.");
				return replyChannel.send(emptyValueEmbed);
			}
			else if(!client.locale.get(inputValue)) {
				console.log("> Language not found");
				return replyChannel.send(invalidLangEmbed);
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

			const getGuild = await client.guilds.fetch(inputValue);
			if(!getGuild) {
				console.log("> Server not found.");
				return replyChannel.send(invalidServerEmbed);
			}

		}
		else if(configName == "threadServerID" && inputValue != "empty") {

			const getGuild = await client.guilds.fetch(inputValue);
			if(!getGuild) {
				console.log("> Server not found.");
				return replyChannel.send(invalidServerEmbed);
			}

		}
		else if(configName == "categoryID" && inputValue != "empty") {

			const threadServer = await client.guilds.fetch(config.threadServerID);
			if(!threadServer) {
				console.log("> Invalid threadServerID.");
				return replyChannel.send(noThreadEmbed);
			}

			const getChannel = threadServer.channels.cache.get(inputValue);
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
				return replyChannel.send(noThreadEmbed);
			}

			const getChannel = threadServer.channels.cache.get(inputValue);
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
				return replyChannel.send(noMainEmbed);
			}

			const getChannel = mainServer.channels.cache.get(inputValue);
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
				return replyChannel.send(noThreadEmbed);
			}

			const getRole = await threadServer.roles.fetch(inputValue);
			if(!getRole) {
				console.log("> Role not found.");
				return replyChannel.send(invalidRoleEmbed);
			}

		}
		else if(configName == "mentionedRoleID" && inputValue != "empty" && inputValue != "everyone" && inputValue != "here") {

			const threadServer = await client.guilds.fetch(config.threadServerID);
			if(!threadServer) {
				console.log("> Invalid threadServerID.");
				return replyChannel.send(noThreadEmbed);
			}

			const getRole = await threadServer.roles.fetch(inputValue);
			if(!getRole) {
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
			const notFoundEmbed = getEmbed.execute(param, "", config.error_color, invalidArg.title, invalidArg.notFound);
			console.log("> Invalid config name.");
			return replyChannel.send(notFoundEmbed);
		}

	},
};
