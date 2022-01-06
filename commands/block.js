module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "block",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: false,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "Moderator",
	},
	usage(locale) {
		// Return command usages;
		const { commands, operation, target, reason, page } = locale;
		const cmdName = commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${operation.name}:${operation.info}\` \`${target.name}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.list}\` \`${page.name}:${page.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.add}\` \`${target.name}:${target.description}\` \`${reason.name}:${reason.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.set}\` \`${target.name}:${target.description}\` \`${reason.name}:${reason.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.remove}\` \`${target.name}:${target.description}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { commands, operation, target, reason, page } = locale;
		const cmdData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(cmdData.name)
			.setDescription(cmdData.description)
			.addStringOption(option => option
				.setName(operation.name)
				.setDescription(operation.description)
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
				.setName(reason.name)
				.setDescription(reason.description)
			)
			.addIntegerOption(option => option
				.setName(page.name)
				.setDescription(page.description)
			);
		return data;
	},
	async info(param, interaction, locale) {
		// Operation: Info.
		const { DB, getEmbed, config } = param;
		const { target, misc } = locale;
		const userID = interaction.options.getString(target.name);
		const blockData = await DB.block.get(userID);
		if (!blockData) {
			// Can't find block data, return notFound.
			return await interaction.reply({
				content: target.notFound,
				ephemeral: true,
			});
		}

		const { modID, reason } = blockData;
		const data = [
			`🔹 ${misc.User}: <@${userID}> [\`${userID}\`]`,
			`🔹 ${misc.Moderator}: <@${modID}> [\`${modID}\`]`,
			`🔹 ${misc.reason}: ${reason}`,
		];
		const embed = await getEmbed.execute(param, "", config.infoColor, locale.commands[this.name].infoTitle, data.join("\n"));
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async list(param, interaction, locale) {
		// Operation: List.
		const { config, getEmbed, blockList } = param;
		const { page, commands } = locale;
		let selectedPage = interaction.options.getInteger(page.name);
		const pageItems = 20;
		const totalPage = Math.ceil(blockList.length / pageItems);
		let outputList;

		if (blockList.length == 0) {
			selectedPage = 0;
			outputList = page.emptyList;
		}
		else {
			if (!selectedPage || selectedPage < 1) selectedPage = 1;
			if (selectedPage > totalPage) selectedPage = totalPage;

			const firstIndex = Math.abs((selectedPage - 1) * pageItems);
			outputList = blockList.reduce((total, value, index) => {
				if (index >= firstIndex && index < firstIndex + pageItems) total.push(`🔸 <@${value}> [\`${value}\`]`);
				return total;
			}, []);
			outputList = outputList.join("\n");
		}

		const footer = `${page.name.replace(/^./, page.name[0].toUpperCase())} ${selectedPage} / ${totalPage}`;
		const embed = await getEmbed.execute(param, "", config.infoColor, commands.block.listTitle, outputList, "", footer);
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async add(param, interaction, locale) {
		// Operation: Add.
		const { DB, blockList } = param;
		const { commands, target } = locale;
		const userID = interaction.options.getString(target.name);
		const isBlocked = blockList.includes(userID);
		if (isBlocked) {
			return await interaction.reply({
				content: target.duplicate,
				ephemeral: true,
			});
		}

		const reason = interaction.options.getString(locale.reason.name);
		if (!reason) {
			return await interaction.reply({
				content: locale.reason.invalid,
				ephemeral: true,
			});
		}

		const modID = interaction.user.id;
		await DB.block.set(userID, modID, reason).then(async () => {
			blockList.push(userID);
			return await interaction.reply({
				content: commands.block.addSuccess(userID),
			});
		});
	},
	async set(param, interaction, locale) {
		// Operation: Set.
		const { DB, blockList } = param;
		const { commands, target } = locale;
		const userID = interaction.options.getString(target.name);
		const isBlocked = blockList.includes(userID);
		if (!isBlocked) {
			return await interaction.reply({
				content: target.notFound,
				ephemeral: true,
			});
		}

		const reason = interaction.options.getString(locale.reason.name);
		if (!reason) {
			return await interaction.reply({
				content: locale.reason.invalid,
				ephemeral: true,
			});
		}

		const modID = interaction.user.id;
		await DB.block.set(userID, modID, reason).then(async () => {
			blockList.push(userID);
			return await interaction.reply({
				content: commands.block.addSuccess(userID),
			});
		});
	},
	async remove(param, interaction, locale) {
		// Operation: Remove.
		const { DB, blockList } = param;
		const { commands, target } = locale;
		const userID = interaction.options.getString(target.name);
		const isBlocked = blockList.includes(userID);
		if (!isBlocked) {
			return await interaction.reply({
				content: target.notFound,
				ephemeral: true,
			});
		}

		await DB.block.del(userID).then(async () => {
			const index = blockList.indexOf(userID);
			if (index > -1) {
				blockList.splice(index, 1);
			}
			return await interaction.reply({
				content: commands.block.removeSuccess(userID),
			});
		});
	},
};
