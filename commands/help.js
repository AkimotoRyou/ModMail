module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "help",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: true,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "User",
	},
	usage(locale) {
		const { commands, target } = locale;
		const cmdName = commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${target.name}:${target.description}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, target } = locale;
		const localeData = commands[this.name];
		const cmdKeys = Object.keys(commands);
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description)
			.addStringOption(option => {
				option
					.setName(target.name)
					.setDescription(target.description)
					.setRequired(true);
				cmdKeys.forEach(key => option.addChoice(commands[key].name, commands[key].name));
				return option;
			});
		return data;
	},
	async execute(param, interaction, locale) {
		const { client, config, getEmbed, cmdDataList } = param;
		const helpLocale = locale.commands[this.name];
		const getTarget = interaction.options.getString(locale.target.name);
		const command = getTarget ? client.commands.get(getTarget) : false;
		const cmdData = cmdDataList.find(cmd => cmd.name == interaction.commandName);
		const cmdLocale = command ? locale.commands[command.name] : false;
		const usage = command.usage ? command.usage(locale) : false;
		const data = [];

		if (!command) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true,
			});
		}
		const title = cmdLocale.name.replace(/^./, cmdLocale.name[0].toUpperCase());
		data.push(`${cmdLocale.description}`);
		if (cmdData.language) data.push(`**${locale.target.language}** : ${cmdData.language}`);
		if (cmdData.id) data.push(`**${helpLocale.cmdID}** : ${cmdData.id}`);
		if (command.level) {
			const temp = [];
			const keys = Object.keys(command.level).filter(key => key !== "default");

			temp.push(`🔹 ${locale.misc.default} : ${locale.misc[command.level.default]}`);
			if (keys.length > 0) {
				keys.forEach(key => {
					temp.push(`🔹 ${locale.operation[key]} : ${locale.misc[command.level[key]]}`);
				});
			}
			data.push(`**${helpLocale.cmdLevel}**\n${temp.join("\n")}`);
		}
		if (usage) data.push(`**${helpLocale.cmdUsage}** :\n${usage.join("\n")}`);

		const embed = await getEmbed.execute(param, "", config.infoColor, title, data.join("\n"));
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
