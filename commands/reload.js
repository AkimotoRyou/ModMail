module.exports = {
	name: "reload",
	aliases: ["rl"],
	level: "Owner",
	guildOnly: false,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const client = param.client;
		const config = param.config;
		const getEmbed = param.getEmbed;
		const locale = param.locale;
		const reload = locale.reload;

		const sensitive = args.shift(); // Function name are case sensitive
		const insensitive = sensitive.toLowerCase(); // Command name case are case insensitive.
		const getCommand = client.commands.get(insensitive) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(insensitive));
		const getFN = client.functions.get(sensitive);
		const getLocale = client.locale.get(insensitive);
		const cmdMap = client.commands.map(cmd => `\`${cmd.name}\``).join(", ");
		const fnMap = client.functions.map(fnc => `\`${fnc.name}\``).join(", ");
		const localeMap = client.locale.map(loc => `\`${loc.name}\``).join(", ");
		const cmdField = `${reload.cmdNames}:;${cmdMap}`;
		const fnField = `${reload.fnNames}:;${fnMap}`;
		const localeField = `${reload.locNames}:;${localeMap}`;

		const notFoundEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, reload.notCmdFnLoc, [cmdField, fnField, localeField]);
		const data = [];

		if(getCommand) {
			const cmdName = getCommand.name;
			console.log(`> Deleting ${cmdName} cache.`);
			delete require.cache[require.resolve(`./${cmdName}.js`)];

			console.log(`> Loading ${cmdName}.`);
			const newCommand = require(`./${cmdName}.js`);
			client.commands.set(newCommand.name, newCommand);
			data.push(`${reload.action} \`${cmdName}\` ${reload.cmd}.`);
		}
		if(getFN) {
			const fnName = getFN.name;
			console.log(`> Deleting ${fnName} cache.`);
			delete require.cache[require.resolve(`../functions/${fnName}.js`)];

			console.log(`> Loading ${fnName}.`);
			const newFunction = require(`../functions/${fnName}.js`);
			client.functions.set(newFunction.name, newFunction);
			param[fnName] = client.functions.get(fnName);
			data.push(`${reload.action} \`${fnName}\` ${reload.fn}.`);
		}
		if(getLocale) {
			const locName = getLocale.name;
			console.log(`> Deleting ${locName} cache.`);
			delete require.cache[require.resolve(`../locale/${locName}.js`)];

			console.log(`> Loading ${locName}.`);
			const newLocale = require(`../locale/${locName}.js`);
			client.locale.set(newLocale.name, newLocale);
			data.push(`${reload.action} \`${locName}\` ${reload.loc}.`);
		}
		if(!getCommand && !getFN && !getLocale) {
			console.log("> Invalid Name.");
			return replyChannel.send(notFoundEmbed);
		}

		const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, data.join("\n"));
		return replyChannel.send(successEmbed);
	},
};
