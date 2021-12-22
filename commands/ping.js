module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "ping",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: false,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "User",
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const localeData = locale.commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description);
		return data;
	},
	async execute(param, interaction, locale) {
		const cmdData = locale.commands[this.name];
		const timestamp = interaction.createdTimestamp;
		await interaction.reply({
			content: "...",
			ephemeral: true
		});
		return await interaction.editReply({
			content: cmdData.reply(Math.round(param.client.ws.ping), (Date.now() - timestamp)),
			ephemeral: true
		});
	},
};
