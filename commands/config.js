module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "config",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	global: false,
	// Valid command level: "Owner", "Admin", "Moderator", "User".
	level: {
		default: "Admin",
	},
	usage(locale) {
		const { commands, operation, target, value } = locale;
		const cmdName = commands[this.name].name;
		const data = [
			`🔹 /${cmdName} \`${operation.name}:${operation.view}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.info}\` \`${target.name}:${target.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.set}\` \`${target.name}:${target.description}\` \`${value.name}:${value.description}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.reset}\` \`${target.name}:${target.all}\``,
			`🔹 /${cmdName} \`${operation.name}:${operation.reset}\` \`${target.name}:${target.description}\``,
		];
		return data;
	},
	getData(SlashCommandBuilder, param, locale) {
		// Defining command structure.
		const { config } = param;
		const { commands, operation, target, value } = locale;
		const configKeys = Object.keys(config);
		const separator = new RegExp("^(_Separator)\\s*");
		const cmdData = commands[this.name];
		const data = new SlashCommandBuilder()
			.setName(cmdData.name)
			.setDescription(cmdData.description)
			.addStringOption(option => option
				.setName(operation.name)
				.setDescription(operation.description)
				.addChoice(operation.view, "view")
				.addChoice(operation.info, "info")
				.addChoice(operation.set, "set")
				.addChoice(operation.reset, "reset")
				.setRequired(true)
			)
			.addStringOption(option => {
				option
					.setName(target.name)
					.setDescription(target.description)
					.addChoice(target.all, locale.target.all);
				configKeys.forEach(key => {
					if (!separator.test(key)) option.addChoice(target[key], key);
				});
				return option;
			})
			.addStringOption(option => option
				.setName(value.name)
				.setDescription(value.description)
			);
		return data;
	},
	async view(param, interaction, locale) {
		// Operation: View.
		const { config, getEmbed } = param;
		const configKeys = Object.keys(config);
		const separator = new RegExp("^(_Separator)\\s*");
		const data = [];

		configKeys.forEach(key => {
			if (separator.test(key)) {
				data.push(`**[ ${locale.misc[key]} ]**`);
			}
			else {
				data.push(`🔹 ${locale.target[key]} : \`${config[key]}\``);
			}
		});

		const embed = await getEmbed.execute(param, "", config.infoColor, "", data.join("\n"));
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async info(param, interaction, locale) {
		// Operation: Info.
		const { config, getEmbed } = param;
		const configKeys = Object.keys(config);
		const configName = interaction.options.getString(locale.target.name);
		if (!configKeys.includes(configName)) {
			return await interaction.reply({
				content: locale.target.invalid,
				ephemeral: true,
			});
		}

		const embed = await getEmbed.execute(param, "", config.infoColor, locale.target[configName], locale.commands[this.name].getInfo(configName));
		return await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
	async set(param, interaction, locale) {
		// Operation: Set.
		const configName = interaction.options.getString(locale.target.name);
		const value = interaction.options.getString(locale.value.name);
		// The main set function for this command is separated to make the code easily readable (check "functions/set.js").
		const result = await param.set.config(param, interaction.user, configName, value);
		let output;
		if (result.output == "invTarget") {
			output = locale.target.notFound;
		}
		else if (result.output == "invValue") {
			output = locale.value.invalid;
		}
		else if (result.output == "noPerm") {
			output = locale.misc.noPerm;
		}
		else if (result.output == "success") {
			output = locale.commands.config.setSuccess(configName, result.value);
		}
		else if (result.output == "error") {
			output = locale.misc.unknownError;
		}
		return await interaction.reply({
			content: output,
		});
	},
	async reset(param, interaction, locale) {
		// Operation: Reset.
		const configName = interaction.options.getString(locale.target.name);
		const configKeys = Object.keys(param.config);
		if (!configKeys.includes(configName) && configName !== locale.target.all) {
			return await interaction.reply({
				content: locale.target.notFound,
			});
		}

		// The main reset function for this command is separated to enable auto reset when config sync is running.
		await param.reset.execute(param, configName);
		const output = locale.commands[this.name].resetSuccess(configName);
		return await interaction.reply({
			content: output,
		});
	},
};
