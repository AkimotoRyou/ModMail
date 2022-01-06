module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "tag",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: true,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "Moderator",
		view: "User",
		list: "User",
	},
	usage(locale) {
		const { commands, operation, target, content, show, page, misc } = locale;
		const cmdName = commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${operation.name}:${operation.view}\` \`${target.name}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.view}\` \`${target.name}:${target.description}\` \`${show.name}:${misc.true}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.sent}\` \`${target.name}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.info}\` \`${target.name}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.list}\` \`${page.name}:${page.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.add}\` \`${target.name}:${target.description}\` \`${content.name}:${content.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.set}\` \`${target.name}:${target.description}\` \`${content.name}:${content.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.remove}\` \`${target.name}:${target.description}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, operation, target, content, show, page, misc } = locale;
		const localeData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(localeData.name)
			.setDescription(localeData.description)
			.addStringOption(option => option
				.setName(operation.name)
				.setDescription(operation.description)
				.addChoice(operation.view, "view")
				.addChoice(operation.sent, "sent")
				.addChoice(operation.info, "info")
				.addChoice(operation.list, "list")
				.addChoice(operation.add, "add")
				.addChoice(operation.set, "set")
				.addChoice(operation.remove, "remove")
				.setRequired(true)
			)
			.addStringOption(option => option
				.setName(target.name)
				.setDescription(target.description)
			)
			.addStringOption(option => option
				.setName(content.name)
				.setDescription(content.description)
			)
			.addStringOption(option => option
				.setName(show.name)
				.setDescription(show.description)
				.addChoice(misc.true, "true")
			)
			.addIntegerOption(option => option
				.setName(page.name)
				.setDescription(page.description)
			);
		return data;
	},
	async view(param, interaction, locale) {
		// Operation: view.
		const tagName = interaction.options.getString(locale.target.name);
		const show = interaction.options.getString(locale.show.name);
		const content = param.tagList[tagName];
		if (!content) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true,
			});
		}

		return await interaction.reply({
			content: content,
			ephemeral: !show,
		});
	},
	async sent(param, interaction, locale) {
		// Operation: sent.
		const { client, config, getEmbed, tagList, threadList } = param;
		const { channel } = interaction;
		const tagName = interaction.options.getString(locale.target.name);
		const content = tagList[tagName];
		if (!content) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true,
			});
		}

		const thread = threadList.find(key => key.channelID === channel.id);
		if (!thread) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true
			});
		}

		const mainServer = client.guilds.cache.get(config.mainServerID);
		const user = await client.users.fetch(thread.userID);
		const userLocale = param.locale[thread.language];
		const userEmbed = await getEmbed.execute(param, "", config.receivedColor, userLocale.misc.msgReceived, content, "", mainServer);
		try {
			await user.send({ embeds: [userEmbed] });
		}
		catch (error) {
			if (error.message === "Cannot send messages to this user") {
				return await interaction.reply({
					content: locale.commands[this.name].dmDisabled,
					ephemeral: true
				});
			}
			return error;
		}

		const channelEmbed = await getEmbed.execute(param, interaction.user, config.sentColor, userLocale.misc.msgSent, content, "", user);
		return await interaction.reply({
			embeds: [channelEmbed],
		});
	},
	async info(param, interaction, locale) {
		// Operation: Info.
		const { DB, config, getEmbed } = param;
		const tagName = interaction.options.getString(locale.target.name);
		const tagData = await DB.tag.get(tagName);
		if (!tagData) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true,
			});
		}

		const { modID, content } = tagData;
		const data = [
			`🔹 ${locale.misc.Moderator}: <@${modID}> [\`${modID}\`]`,
			`\`\`\`${content}\`\`\``,
		];
		const embed = await getEmbed.execute(param, "", config.infoColor, tagName, data.join("\n"));
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async list(param, interaction, locale) {
		// Operation: List.
		const { config, getEmbed, tagList } = param;
		const { commands, page } = locale;
		let selectedPage = interaction.options.getInteger(page.name);
		const pageItems = 30;
		let outputList = Object.keys(tagList);
		const totalPage = Math.ceil(outputList.length / pageItems);

		if (tagList.length == 0) {
			selectedPage = 0;
			outputList = locale.page.emptyList;
		}
		else {
			if (!selectedPage || selectedPage < 1) selectedPage = 1;
			if (selectedPage > totalPage) selectedPage = totalPage;

			const firstIndex = Math.abs((selectedPage - 1) * pageItems);
			outputList = outputList.reduce((total, value, index) => {
				if (index >= firstIndex && index < firstIndex + pageItems) total.push(`\`${value}\``);
				return total;
			}, []);
			outputList = outputList.join(", ");
		}

		const footer = `${page.name.replace(/^./, page.name[0].toUpperCase())} ${selectedPage} / ${totalPage}`;
		const embed = await getEmbed.execute(param, "", config.infoColor, commands[this.name].listTitle, outputList, "", footer);
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async add(param, interaction, locale) {
		// Operation: Add.
		const { DB, tagList } = param;
		const tagName = interaction.options.getString(locale.target.name);
		const isTag = tagList[tagName];
		if (isTag) {
			return await interaction.reply({
				content: locale.target.duplicate,
				ephemeral: true,
			});
		}

		const content = interaction.options.getString(locale.content.name);
		if (!content) {
			return await interaction.reply({
				content: locale.content.invalid,
				ephemeral: true,
			});
		}

		const modID = interaction.user.id;
		await DB.tag.set(tagName, modID, content).then(async () => {
			tagList[tagName] = content;
			return await interaction.reply({
				content: locale.commands[this.name].addSuccess(tagName),
			});
		});
	},
	async set(param, interaction, locale) {
		// Operation: Set.
		const { DB, tagList } = param;
		const tagName = interaction.options.getString(locale.target.name);
		const isTag = tagList[tagName];
		if (!isTag) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true,
			});
		}

		const content = interaction.options.getString(locale.content.name);
		if (!content) {
			return await interaction.reply({
				content: locale.content.invalid,
				ephemeral: true,
			});
		}

		const modID = interaction.user.id;
		await DB.tag.set(tagName, modID, content).then(async () => {
			tagList[tagName] = content;
			return await interaction.reply({
				content: locale.commands[this.name].setSuccess(tagName),
			});
		});
	},
	async remove(param, interaction, locale) {
		// Operation: Remove.
		const { DB, tagList } = param;
		const tagName = interaction.options.getString(locale.target.name);
		const isTag = tagList[tagName];
		if (!isTag) {
			return await interaction.reply({
				content: locale.target.notFound,
				ephemeral: true,
			});
		}

		await DB.tag.del(tagName).then(async () => {
			delete tagList[tagName];
			return await interaction.reply({
				content: locale.commands[this.name].removeSuccess(tagName),
			});
		});
	},
};
