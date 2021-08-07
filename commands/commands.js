module.exports = {
	name: "commands",
	aliases: ["cmd"],
	level: "User",
	guildOnly: false,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const commands = param.client.commands;

		// filtering command for each level
		const ownerCollection = commands.filter(command => command.level === "Owner");
		const adminCollection = commands.filter(command => command.level === "Admin");
		const modCollection = commands.filter(command => command.level === "Moderator");
		const userCollection = commands.filter(command => command.level === "User");
		// mapping command name for each level
		const ownerLevel = ownerCollection.map(command => command.name);
		const adminLevel = adminCollection.map(command => command.name);
		const modLevel = modCollection.map(command => command.name);
		const userLevel = userCollection.map(command => command.name);

		// calling function from locale file and passing command names for each level
		const cmdList = param.locale.cmdList(param, ownerLevel, adminLevel, modLevel, userLevel);

		const title = cmdList.title;
		const description = cmdList.description;
		const ownerField = cmdList.ownerField;
		const adminField = cmdList.adminField;
		const moderatorField = cmdList.modField;
		const userField = cmdList.userField;

		// embeds
		const ownerEmbed = getEmbed.execute(param, client.user, config.info_color, title, description, [ownerField, adminField, moderatorField, userField], "", client.user.displayAvatarURL());
		const adminEmbed = getEmbed.execute(param, client.user, config.info_color, title, description, [adminField, moderatorField, userField], "", client.user.displayAvatarURL());
		const moderatorEmbed = getEmbed.execute(param, client.user, config.info_color, title, description, [moderatorField, userField], "", client.user.displayAvatarURL());
		const userEmbed = getEmbed.execute(param, client.user, config.info_color, title, description, [userField], "", client.user.displayAvatarURL());

		if (param.isOwner) {
			// Bot owner
			return replyChannel.send(ownerEmbed);
		}
		else if(param.isAdmin) {
			// Admin
			return replyChannel.send(adminEmbed);
		}
		else if(param.isModerator) {
			// Moderator
			return replyChannel.send(moderatorEmbed);
		}
		else {
			// User/DM
			return replyChannel.send(userEmbed);
		}
	},
};
