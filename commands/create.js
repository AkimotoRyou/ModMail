module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "create",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: true,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "User",
	},
	usage(locale) {
		const cmdName = locale.commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${locale.title.name}:${locale.title.description}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, title } = locale;
		const localeData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description)
			.addStringOption(option => option
				.setName(title.name)
				.setDescription(title.description)
				.setRequired(true)
			);
		return data;
	},
	async execute(param, interaction, locale) {
		const { client, config, threadList, create } = param;
		const user = interaction.user;
		const cmdData = locale.commands[this.name];
		const title = interaction.options.getString(locale.title.name);

		const thread = threadList.find(key => key.userID === user.id);
		if (thread) {
			return await interaction.reply({
				content: cmdData.duplicate,
				ephemeral: true
			});
		}

		const threadServer = client.guilds.cache.get(config.threadServerID);
		const category = await threadServer.channels.fetch(config.categoryID);
		if (category.children.size == 50) {
			return await interaction.reply({
				content: cmdData.maxThread,
				ephemeral: true
			});
		}

		const channelName = `${locale.name.toUpperCase()}-${user.tag.replace(/[^0-9a-z]/gi, "")}`;
		const channel = await threadServer.channels.create(channelName, { type: "GUILD_TEXT", parent: config.categoryID });
		const output = await create.thread(param, locale, user, channel, title);
		if (output == "dmDisabled") {
			return await interaction.reply({
				content: cmdData.dmDisabled(title),
				ephemeral: true
			});
		}
		return await interaction.reply({
			content: cmdData.newSuccess(title),
			ephemeral: true
		});
	},
};
