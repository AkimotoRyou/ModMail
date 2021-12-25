module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "reply",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: true,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "User",
		guild: "Moderator",
	},
	usage(locale) {
		const { commands, content, anon, misc } = locale;
		const cmdData = commands[this.name];
		const cmdName = cmdData.name;
		const data = [
			`🔹 /${cmdName} \`${content.name}:${cmdData.contentdescription}\``,
			`🔹 /${cmdName} \`${content.name}:${cmdData.contentdescription}\` \`${anon.name}:${misc.true}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, content, anon, misc } = locale;
		const localeData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description)
			.addStringOption(option => option
				.setName(content.name)
				.setDescription(localeData.contentDescription)
				.setRequired(true)
			)
			.addStringOption(option => option
				.setName(anon.name)
				.setDescription(anon.description)
				.addChoice(misc.true, "true")
			);
		return data;
	},
	async execute(param, interaction, locale) {
		const { client, config, getEmbed, threadList } = param;
		const { guild } = interaction;
		const content = interaction.options.getString(locale.content.name);
		const anon = interaction.options.getString(locale.anon.name);
		let thread, channel;
		if (interaction.guild) thread = threadList.find(key => key.channelID === interaction.channel.id);
		else thread = threadList.find(key => key.userID === interaction.user.id);

		if (!thread) {
			return await interaction.reply({
				content: locale.misc.noThread,
				ephemeral: true
			});
		}
		try {
			channel = guild ? interaction.channel : await client.channels.fetch(thread.channelID);
		}
		catch {
			return await interaction.reply({
				content: locale.misc.noChannel,
				ephemeral: true
			});
		}

		const mainServer = client.guilds.cache.get(config.mainServerID);
		const user = await client.users.fetch(thread.userID);
		const userLocale = param.locale[thread.language];

		const userTitle = guild ? userLocale.misc.msgReceived : userLocale.misc.msgSent;
		const channelTitle = guild ? userLocale.misc.msgSent : userLocale.misc.msgReceived;
		const userColor = guild ? config.receivedColor : config.sentColor;
		const channelColor = guild ? config.sentColor : config.receivedColor;
		const mod = anon ? "" : interaction.user;
		const userEmbed = await getEmbed.execute(param, mod, userColor, userTitle, content, "", mainServer);
		try {
			if (guild) await user.send({ embeds: [userEmbed] });
		}
		catch (error) {
			if (error.message === "Cannot send messages to this user") {
				return await interaction.reply({
					content: locale.commands[this.name].dmDisabled,
				});
			}
			return error;
		}

		const channelEmbed = await getEmbed.execute(param, interaction.user, channelColor, channelTitle, content, "", user);
		if (!guild) await channel.send({ embeds: [channelEmbed] });
		const replyEmbed = guild ? channelEmbed : userEmbed;
		return await interaction.reply({
			embeds: [replyEmbed],
		});
	},
};
