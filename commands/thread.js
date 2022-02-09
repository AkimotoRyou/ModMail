module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "thread",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: false,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "Moderator",
		bind: "Admin",
	},
	usage(locale) {
		const { commands, operation, target, misc, page, title } = locale;
		const cmdName = commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${operation.name}:${operation.info}\` \`${misc.User.toLowerCase()}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.info}\` \`${misc.channel.toLowerCase()}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.list}\` \`${page.name}: ${page.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.bind}\` \`${misc.User.toLowerCase()}:${target.description}\` \`${misc.channel.toLowerCase()}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.bind}\` \`${misc.User.toLowerCase()}:${target.description}\` \`${misc.channel.toLowerCase()}:${target.description}\` \`${title.name}:${title.description}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, operation, target, misc, page, title } = locale;
		const localeData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description)
			.addStringOption(option => option
				.setName(operation.name)
				.setDescription(operation.description)
				.addChoice(operation.info, "info")
				.addChoice(operation.list, "list")
				.addChoice(operation.bind, "bind")
				.setRequired(true)
			)
			.addUserOption(option => option
				.setName(misc.User.toLowerCase())
				.setDescription(target.description)
			)
			.addChannelOption(option => option
				.setName(misc.channel.toLowerCase())
				.setDescription(target.description)
			)
			.addIntegerOption(option => option
				.setName(page.name)
				.setDescription(page.description)
			)
			.addStringOption(option => option
				.setName(title.name)
				.setDescription(title.description)
			);
		return data;
	},
	// New, reply, and close thread command are separated for easier user experience.
	// I didn't use subcommand since it doesn't have UX that i want it to be.
	async info(param, interaction, locale) {
		// Operation: info.
		const { config, getEmbed, threadList } = param;
		const user = interaction.options.getUser(locale.misc.User.toLowerCase());
		const channel = interaction.options.getChannel(locale.misc.channel.toLowerCase());

		let thread;
		if (user) thread = threadList.find(key => key.userID == user.id);
		if (!user && channel) thread = threadList.find(key => key.channelID == channel.id);
		if (!thread) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true
			});
		}

		const threadData = [
			`${thread.title}`,
			`🔹 ${locale.target.language} : \`${thread.language}\``,
			`🔹 ${locale.misc.User} : <@${thread.userID}> [\`${thread.userID}\`]`,
			`🔹 ${locale.misc.channel} : <#${thread.channelID}> [\`${thread.channelID}\`]`,
		];
		const embed = await getEmbed.execute(param, "", config.infoColor, locale.commands[this.name].infoTitle, threadData.join("\n"));
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	},
	async list(param, interaction, locale) {
		// Operation: list.
		const { config, getEmbed, threadList } = param;
		const { commands, page } = locale;
		let selectedPage = interaction.options.getInteger(page.name);
		const pageItems = 20;
		const totalPage = Math.ceil(threadList.length / pageItems);
		let outputList = threadList.map(thread => thread.userID);

		if (threadList.length == 0) {
			selectedPage = 0;
			outputList = locale.page.emptyList;
		}
		else {
			if (!selectedPage || selectedPage < 1) selectedPage = 1;
			if (selectedPage > totalPage) selectedPage = totalPage;

			const firstIndex = Math.abs((selectedPage - 1) * pageItems);
			outputList = outputList.reduce((total, value, index) => {
				if (index >= firstIndex && index < firstIndex + pageItems) total.push(`🔹 <@${value}> [\`${value}\`]`);
				return total;
			}, []);
			outputList = outputList.join("\n");
		}

		const footer = `${page.name.replace(/^./, page.name[0].toUpperCase())} ${selectedPage} / ${totalPage}`;
		const embed = await getEmbed.execute(param, "", config.infoColor, commands[this.name].listTitle, outputList, "", footer);
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async bind(param, interaction, locale) {
		// Operation: bind.
		const { DB, client, config, getEmbed, threadList, create } = param;
		const user = interaction.options.getUser(locale.misc.User.toLowerCase());
		const channel = interaction.options.getChannel(locale.misc.channel.toLowerCase());
		const cmdData = locale.commands[this.name];
		let output;

		if (!user || !channel || channel.type !== "GUILD_TEXT" || channel.guild.id !== config.threadServerID || channel.parent.id !== config.categoryID || channel.id == config.categoryID || channel.id == config.logChannelID) {
			// Target user or channel isn't provided, or traget channel isn't inside defined thread server nor category channel.
			return await interaction.reply({
				content: locale.target.invalid,
				ephemeral: true
			});
		}
		let thread = threadList.find(key => key.channelID === channel.id);
		if (thread) {
			// Target channel already binded with an active thread.
			return await interaction.reply({
				content: cmdData.activeThread,
				ephemeral: true
			});
		}
		const userID = user.id;
		thread = threadList.find(key => key.userID === userID);
		if (!thread) {
			// Target user doesn't have an active thread, create new thread.
			const title = interaction.options.getString(locale.title.name) || locale.misc.bindTitle;
			output = await create.thread(param, locale, user, channel, title);
			const channelName = `${locale.name}-${user.tag.replace(/[^0-9a-z]/gi, "")}`;
			await channel.setName(channelName);
			if (output == "dmDisabled") output = cmdData.dmDisabled(userID, channel.id);
			else output = cmdData.bindSuccess(userID, channel.id);
		}
		else {
			// Target user have an active thread, bind it to target channel.
			const { language, title } = thread;
			const setLang = param.locale[language] ? language : config.language ;
			await DB.thread.set(userID, channel.id, setLang, title);
			thread.channelID = channel.id;
			const channelName = `${language}-${user.tag.replace(/[^0-9a-z]/gi, "")}`;
			await channel.setName(channelName);
			const userLocale = param.locale[thread.language];
			const userData = [
				`${thread.title}`,
				`🔹 ${userLocale.misc.User} : <@${thread.userID}>`,
				`🔹 ${userLocale.misc.createdAt} : <t:${Math.round(user.createdTimestamp / 1000)}:R>`,
			];
			const member = await client.guilds.cache.get(config.mainServerID).members.fetch(userID);
			if (member) {
				const roles = await member.roles.cache.filter(role => role.name != "@everyone").map(role => `<@&${role.id}>` || "-").join(", ");
				userData.push(`🔹 ${userLocale.misc.joinedAt} : <t:${Math.round(member.joinedTimestamp / 1000)}:R>`);
				userData.push(`🔹 ${userLocale.misc.roles}: ${roles}`);
			}
			const embed = await getEmbed.execute(param, interaction.user, config.infoColor, userLocale.misc.bindTitle, userData.join("\n"), "", user, user.displayAvatarURL());
			await channel.send({ embeds: [embed] });
			output = cmdData.bindSuccess(userID, channel.id);
		}

		return await interaction.reply({
			content: output,
		});
	},
};
