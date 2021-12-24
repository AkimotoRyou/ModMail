module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "close",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: false,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "Moderator",
	},
	usage(locale) {
		const { commands, reason, note, anon, misc } = locale;
		const cmdName = commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${reason.name}:${reason.description}\``,
			`🔹 /${cmdName} \`${reason.name}:${reason.description}\` \`${note.name}:${note.description}\``,
			`🔹 /${cmdName} \`${reason.name}:${reason.description}\` \`${note.name}:${note.description}\` \`${anon.name}:${misc.true}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, reason, note, anon, misc } = locale;
		const localeData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description)
			.addStringOption(option => option
				.setName(reason.name)
				.setDescription(reason.description)
				.setRequired(true)
			)
			.addStringOption(option => option
				.setName(note.name)
				.setDescription(note.description)
			)
			.addStringOption(option => option
				.setName(anon.name)
				.setDescription(anon.description)
				.addChoice(misc.true, "true")
			);
		return data;
	},
	async execute(param, interaction, locale) {
		const { DB, client, config, getEmbed, threadList, updateActivity } = param;
		const reason = interaction.options.getString(locale.reason.name);
		const note = interaction.options.getString(locale.note.name) || "-";
		const anon = interaction.options.getString(locale.anon.name);
		const thread = threadList.find(key => key.channelID === interaction.channel.id);

		if (!thread) {
			return await interaction.reply({
				content: locale.misc.noThread,
				ephemeral: true
			});
		}
		if (!reason) {
			return await interaction.reply({
				content: locale.reason.invalid,
				ephemeral: true
			});
		}

		const mainServer = client.guilds.cache.get(config.mainServerID);
		const threadServer = client.guilds.cache.get(config.threadServerID);
		const logChannel = await threadServer.channels.fetch(config.logChannelID);
		const channel = await threadServer.channels.fetch(thread.channelID);
		const user = await client.users.fetch(thread.userID);
		const userLocale = param.locale[thread.language];
		const cmdData = userLocale.commands[this.name];
		const embedData = [
			`${thread.title}`,
			`🔹 ${userLocale.reason.name.replace(/^./, userLocale.reason.name[0].toUpperCase())} : ${reason}`,
		];

		const mod = anon ? "" : interaction.user;
		const userEmbed = await getEmbed.execute(param, mod, config.closeColor, cmdData.closeTitle, embedData.join("\n"), "", mainServer);
		await user.send({ embeds: [userEmbed] }).catch(error => {
			if (error.message === "Cannot send messages to this user") return console.log(`> ${error.message}`);
			return error;
		});

		embedData.push(`🔹 ${userLocale.note.name.replace(/^./, userLocale.note.name[0].toUpperCase())} : ${note}`);
		const logEmbed = await getEmbed.execute(param, interaction.user, config.closeColor, cmdData.closeTitle, embedData.join("\n"), "", user);
		await logChannel.send({ embeds: [logEmbed] });
		return await channel.delete().then(async () => {
			const index = threadList.indexOf(thread);
			if (index > -1) {
				threadList.splice(index, 1);
			}
			await DB.thread.del(user.id);
			await updateActivity.execute(param);
		});
	},
};
