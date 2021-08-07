module.exports = {
	name: "reset",
	aliases: [],
	level: "Admin",
	guildOnly: true,
	args: false,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const getEmbed = param.getEmbed;
		const defConfig = param.defConfig;
		const db = param.db;
		const configPrefix = param.dbPrefix.config;
		const configKeys = Object.keys(param.config);
		const locale = param.locale;

		const firstArg = args.shift();
		let resetName;
		if(!firstArg || firstArg.toLowerCase() == locale.all.toLowerCase()) resetName = locale.all;
		else resetName = `\`${firstArg}\``;

		const resetCmd = locale.resetCmd(resetName);
		const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, resetCmd);

		if(resetName == locale.all) {
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
			const noConfig = locale.noConfig(param, resetName);
			const invalidEmbed = getEmbed.execute(param, "", config.warning_color, locale.notFound, noConfig);
			console.log("> Not a config name.");
			return replyChannel.send(invalidEmbed);
		}
		return param.configSync.execute(param).then(() => replyChannel.send(successEmbed));
	},
};
