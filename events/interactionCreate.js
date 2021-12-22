module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "interactionCreate",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	disabled: false,
	once: false,
	async execute(param, interaction) {
		if (interaction.isCommand()) {
			return await param.commandHandler.execute(param, interaction);
		}
		return;
	},
};
