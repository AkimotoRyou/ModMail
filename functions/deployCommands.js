const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const process = require("process");
require("dotenv").config();

module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "deployCommands",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async execute(param) {
		const { dbSync, client, config, cmdDataList } = param;
		const clientID = client.user.id;
		const locale = param.locale[config.language];
		const localeNames = client.commands.keys();

		// Getting commands data and store it in `commands` array.
		const globalCommands = [];
		const guildCommands = [];
		for (const localeName of localeNames) {
			const command = client.commands.get(localeName);
			const cmdData = cmdDataList.find(key => key.name == localeName);
			// Getting commands data based on it's language.
			const cmdLocale = param.locale[cmdData.language];
			const data = command.getData(SlashCommandBuilder, param, cmdLocale);
			if (command.global) globalCommands.push(data.toJSON());
			else guildCommands.push(data.toJSON());
		}

		// Registering the slash commands.
		const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
		let result;
		try {
			await rest.put(Routes.applicationCommands(clientID), { body: globalCommands });
			await rest.put(Routes.applicationGuildCommands(clientID, config.threadServerID), { body: guildCommands });
			result = locale ? locale.misc.deploySuccess : "`Succesfully registered application commands.`";
		}
		catch (error) {
			result = locale ? locale.errorMsg(error, config.ownerID) : `An error occured, please contact bot owner <@${config.ownerID}>.\n🔸 Name: \`${error.name}\`\n🔸 Message: \`${error.message}\``,
			console.log(error);
		}
		await dbSync.execute(param);
		return result;
	},
};
