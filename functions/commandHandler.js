module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "commandHandler",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async execute(param, interaction) {
		const { Collection, client, config, blockList, cmdDataList } = param;
		const { guild, commandName, channel, member, user } = interaction;
		const cooldowns = client.cooldowns;
		const cooldown = parseInt(config.cooldown);
		const command = client.commands.get(commandName);
		const cmdData = cmdDataList.find(key => key.name == commandName);
		let locale = param.locale[cmdData.language];

		if (!locale) {
			locale = param.locale(config.language);
			if (!locale) return interaction.reply(`Invalid language configuration, ask <@${config.ownerID}> to set valid language using message command.`);
		}

		if (!isNaN(cooldown) && cooldown > 0) {
			// Command cooldown.
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection());
			}
			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = cooldown * 1000;
			if (timestamps.has(user.id)) {
				const expirationTime = timestamps.get(user.id) + cooldownAmount;
				if (now < expirationTime) {
					// Comment this to disable cooldown message.
					// User will get "This interaction failed" message instead.
					/* */
					const timeLeft = (expirationTime - now) / 1000;
					await interaction.reply({
						content: locale.cooldown(timeLeft.toFixed(1)),
						ephemeral: true
					});
					/* */
					return console.log("> Command still in cooldown.");
				}
			}
			timestamps.set(user.id, now);
			setTimeout(() => timestamps.delete(user.id), cooldownAmount);
		}

		const mainServer = client.guilds.cache.get(config.mainServerID);
		const threadServer = client.guilds.cache.get(config.threadServerID);
		let operation = interaction.options.getString(locale.operation.name);

		let operationPerm = operation && command.level[operation] ? command.level[operation] : command.level.default;
		if (command.name == "reply") operationPerm = interaction.guild ? "Moderator" : "User";
		// Defining user's permissions.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		const userPerm = {
			// Default permission value.
			Owner: user.id === config.ownerID,
			Admin: false,
			Moderator: false,
			User: false,
		};
		if (guild && !mainServer && !threadServer) {
			userPerm.Admin = member.permissions.has("ADMINISTRATOR");
		}
		if (guild && (guild.id == config.mainServerID || guild.id == config.threadServerID)) {
			userPerm.Admin = member.permissions.has("ADMINISTRATOR") || member.roles.cache.has(config.adminRoleID);
			userPerm.Moderator = userPerm.Admin || member.roles.cache.has(config.modRoleID);
		}
		userPerm.User = userPerm.Admin || userPerm.Moderator || !blockList.includes(user.id);
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		// User elimination at maintenance mode.
		if (config.maintenance == "1" && !userPerm.Owner && !userPerm.Admin) {
			return await interaction.reply({
				content: locale.misc.maintenance,
				ephemeral: true
			});
		}
		// Elimination based on command level.
		if (!userPerm.Owner && !userPerm[operationPerm]) {
			return await interaction.reply({
				content: locale.misc.noPerm,
				ephemeral: true
			});
		}

		console.log(`> ${user.tag}[${user.id}] calling "${cmdData.name}" command.`);
		try {
			param.timestamp = Date.now();
			if (!operation) operation = "execute";
			await command[operation](param, interaction, locale, cmdData);
		}
		catch (error) {
			// Catching the error occured when executing the command and send the info to user.
			await interaction.reply({
				content: locale.errorMsg(error, config.ownerID),
				ephemeral: true
			}).catch(async () => {
				await channel.send(locale.errorMsg(error, config.ownerID));
			});
			console.log(error);
		}
		return console.log(`> Executed for ${Date.now() - param.timestamp} ms`);
	},
};
