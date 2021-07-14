module.exports = {
	name: "reset",
	aliases: false,
	level: "Admin",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	usage: ["all", "<config name>"],
	description: "Reset specific or all configuration values.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const getEmbed = param.getEmbed;
		const defConfig = param.defConfig;
		const db = param.db;
		const configPrefix = param.dbPrefix.config;
		const configKeys = Object.keys(param.config);

		const firstArg = args.shift();
		let resetName;
		if(!firstArg || firstArg == "all") resetName = "All";
		else resetName = `\`${firstArg}\``;

		const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `${resetName} config value is reset to default value.`);

		if(!firstArg || firstArg == "all") {
			configKeys.forEach(async aKey => {
				const dbKey = configPrefix + aKey;
				console.log(`> Resetting ${dbKey} value to ${defConfig[aKey]}.`);
				await db.set(dbKey, defConfig[aKey]);
			});
		}
		else if(configKeys.includes(firstArg)) {
			const dbKey = configPrefix + firstArg;
			console.log(`> Resetting ${dbKey} value to ${defConfig[firstArg]}.`);
			await db.set(dbKey, defConfig[firstArg]);
		}
		else {
			const invalidEmbed = getEmbed.execute(param, "", config.warning_color, "Not a Config Name", `That's not a valid config name.\nUse \`${config.prefix}config\` to show available configs.`);
			console.log("> Not a config name.");
			return replyChannel.send(invalidEmbed);
		}
		return param.configSync.execute(param).then(() => replyChannel.send(successEmbed));
	},
};
