module.exports = {
	name: "commands",
	aliases: ["cmd"],
	level: "User",
	guildOnly: false,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: false,
	description: "List of all available commands according to your permission level.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const commands = param.client.commands;

		const description = `Use \`${config.prefix}help [command name]\` to get information for each command.`;

		// collections
		const ownerCollection = commands.filter(command => command.level === "Owner");
		const ownerLevel = ownerCollection.map(command => `**${command.name}** : ${command.description}`).join("\n");
		const adminCollection = commands.filter(command => command.level === "Admin");
		const adminLevel = adminCollection.map(command => `**${command.name}** : ${command.description}`).join("\n");
		const moderatorCollection = commands.filter(command => command.level === "Moderator");
		const moderatorLevel = moderatorCollection.map(command => `**${command.name}** : ${command.description}`).join("\n");
		const userCollection = commands.filter(command => command.level === "User");
		const userLevel = userCollection.map(command => `**${command.name}** : ${command.description}`).join("\n");

		// fields
		const ownerField = `~ Owner Level ~;${ownerLevel || "empty"}`;
		const adminField = `~ Admin Level ~;${adminLevel || "empty"}`;
		const moderatorField = `~ Moderator Level ~;${moderatorLevel || "empty"}`;
		const userField = `~ User Level ~;${userLevel || "empty"}`;

		// embeds
		const ownerEmbed = getEmbed.execute(param, client.user, config.info_color, "Command List", description, [ownerField, adminField, moderatorField, userField], "", client.user.displayAvatarURL());
		const adminEmbed = getEmbed.execute(param, client.user, config.info_color, "Command List", description, [adminField, moderatorField, userField], "", client.user.displayAvatarURL());
		const moderatorEmbed = getEmbed.execute(param, client.user, config.info_color, "Command List", description, [moderatorField, userField], "", client.user.displayAvatarURL());
		const userEmbed = getEmbed.execute(param, client.user, config.info_color, "Command List", description, [userField], "", client.user.displayAvatarURL());

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
