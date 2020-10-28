module.exports = {
	name: "set",
	async execute(param, message, args) {
		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const configSync = param.configSync;
		const ConfigDB = param.ConfigDB;
		const configName = args.shift();
		let inputValue = args.shift() || "empty";

		// manual toggle since i set database to String, can't store boolean for maintenance config.
		if(configName == "maintenance") {
			if(config.maintenance == "0") {
				inputValue = "1";
			} else {
				inputValue = "0";
			}
		}

		const notOwnerEmbed = getEmbed.execute(param, config.warning_color, "Missing Permission", `Only bot owner [<@${config.botOwnerID}>] can change this value.`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `The value of \`${configName}\` changed to \`${inputValue}\``);
		const notSetEmbed = getEmbed.execute(param, config.warning_color, "Configuration Needed", `Please set \`threadServerID\` to change this config.`);
		const emptyValueEmbed = getEmbed.execute(param, config.warning_color, "Invalid Value", "This config value can't be empty.");
		const invalidUserEmbed = getEmbed.execute(param, config.warning_color, "Invalid User", `Can't find that user.`);
		const notNumberEmbed = getEmbed.execute(param, config.warning_color, "Invalid Argument", `That isn't a number.`);
		const negativeNumberEmbed = getEmbed.execute(param, config.warning_color, "Invalid Argument", `The value can't be negative.`);
		const invalidServerEmbed = getEmbed.execute(param, config.warning_color, "Invalid Server", `Can't find that server.\n\`Make sure the bot joined the server already\``);
		const invalidChannelMainEmbed = getEmbed.execute(param, config.warning_color, "Invalid Channel", `Can't find that channel.\n\`Make sure the channel is inside Main Server.\``);
		const invalidChannelThreadEmbed = getEmbed.execute(param, config.warning_color, "Invalid Channel", `Can't find that channel.\n\`Make sure the channel is inside Thread Server.\``);
		const invalidCategoryEmbed = getEmbed.execute(param, config.warning_color, "Invalid Category", `That isn't a category channel.`);
		const invalidTextChannelEmbed = getEmbed.execute(param, config.warning_color, "Invalid Channel", `That isn't a text channel.`);
		const invalidRoleEmbed = getEmbed.execute(param, config.warning_color, "Invalid Role", `Can't find that role.\n\`Make sure the role is inside Thread Server.\``);
		const invalidColorEmbed = getEmbed.execute(param, config.warning_color, "Invalid Color", `Use hex code for input.\nCheck : <https://html-color.codes/>`);

		// elimination for invalid input
		if(configName == "botOwnerID") {

			if(message.author.id != config.botOwnerID) {
				return message.channel.send(notOwnerEmbed);
			} else if(inputValue == "empty") {
				return message.channel.send(emptyValueEmbed);
			} else if(!client.users.cache.get(inputValue)) {
				return message.channel.send(invalidUserEmbed);
			}

		} else if(configName == "cooldown") {

			if (isNaN(inputValue)) {
				return message.channel.send(notNumberEmbed);
			} else if(inputValue < 0) {
				return message.channel.send(negativeNumberEmbed);
			}

		} else if(configName == "mainServerID" && inputValue != "empty") {

			if(!client.guilds.cache.get(inputValue)) {
				return message.channel.send(invalidServerEmbed);
			}

		} else if(configName == "threadServerID" && inputValue != "empty") {

			if(!client.guilds.cache.get(inputValue)) {
				return message.channel.send(invalidServerEmbed);
			}

		} else if(configName == "categoryID" && inputValue != "empty") {

			const getChannel = client.guilds.cache.get(config.threadServerID).channels.cache.get(inputValue);
			if(config.threadServerID == "empty") {
				return message.channel.send(notSetEmbed);
			} else if(!getChannel) {
				return message.channel.send(invalidChannelThreadEmbed);
			} else if(getChannel.type != "category") {
				return message.channel.send(invalidCategoryEmbed);
			}

		} else if(configName == "logChannelID" && inputValue != "empty") {

			const getChannel = client.guilds.cache.get(config.threadServerID).channels.cache.get(inputValue);
			if(config.threadServerID == "empty") {
				return message.channel.send(notSetEmbed);
			} else if(!getChannel) {
				return message.channel.send(invalidChannelThreadEmbed);
			} else if(getChannel.type != "text") {
				return message.channel.send(invalidTextChannelEmbed);
			}

		} else if(configName == "botChannelID" && inputValue != "empty") {

			const getChannel = client.guilds.cache.get(config.mainServerID).channels.cache.get(inputValue);
			if(config.mainServerID == "empty") {
				return message.channel.send(notSetEmbed);
			} else if(!getChannel) {
				return message.channel.send(invalidChannelMainEmbed);
			} else if(getChannel.type != "text") {
				return message.channel.send(invalidTextChannelEmbed);
			}

		} else if((configName == "adminRoleID" || configName == "modRoleID") && inputValue != "empty") {

			if(config.threadServerID == "empty") {
				return message.channel.send(notSetEmbed);
			} else if(!client.guilds.cache.get(config.threadServerID).roles.cache.get(inputValue)) {
				return message.channel.send(invalidRoleEmbed);
			}

		} else if(configName == "mentionedRoleID" && inputValue != "empty" && inputValue != "everyone" && inputValue != "here") {

			if(config.threadServerID == "empty") {
				return message.channel.send(notSetEmbed);
			} else if(!client.guilds.cache.get(config.threadServerID).roles.cache.get(inputValue)) {
				return message.channel.send(invalidRoleEmbed);
			}

		} else if(configName == "info_color" || configName == "warning_color" || configName == "error_color" || configName == "sent_color" || configName == "received_color") {

			const colorTest = /^#[0-9A-F]{6}$/i;
			if(inputValue == "empty") {
				return message.channel.send(emptyValueEmbed);
			} else if(colorTest.test(inputValue) == false) {
				return message.channel.send(invalidColorEmbed);
			}

		}

		// getting all the config name from Database
		const configCollection = await ConfigDB.findAll({ attributes: ["name"] });
		const configList = configCollection.map(conf => `\`${conf.name}\``).join(', ');

		// trying to edit the Database
		const affectedRows = await ConfigDB.update({ input: inputValue }, { where: { name:configName } });
		if(affectedRows > 0) {
			console.log(`[${configName}] value changed to [${inputValue}]`);
			await message.channel.send(successEmbed).then(async () => {
				await configSync.execute(param);
				if(configName == "maintenance" || configName == "prefix") {
					setTimeout(async ()=> {
						await param.updateActivity.execute(param);
					}, 5000);
				}
			});
		} else {
			const notFoundEmbed = getEmbed.execute(param, config.error_color, "Failed", `Can't find config named \`${configName}\`.\nAvailable names : ${configList}`);
			return message.channel.send(notFoundEmbed)
		}

	}
};
