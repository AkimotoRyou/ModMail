module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "guildCreate",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	disabled: false,
	once: true,
	async execute(param, guild) {
		console.log(`Joined ${guild.name} [${guild.id}].`);

		const { client, config } = param;
		const { ownerID } = config;
		const botOwner = ownerID == "-" ? false : await client.users.fetch(ownerID);

		if (botOwner) {
			botOwner.send(`Joined \`${guild.name}• ${guild.id}\`.`).catch(error => {
				if (error.message === "Cannot send messages to this user") return;
				console.log(error);
			});
		}
	},
};
