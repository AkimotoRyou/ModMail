module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "set",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async config(param, author, target, value) {
		const { DB, client, config } = param;
		const configKeys = Object.keys(config);
		const invTarget = { output: "invTarget" };
		const invValue = { output: "invValue" };
		const noPerm = { output: "noPerm" };

		// Return if it's an invalid config name.
		if (!configKeys.includes(target)) return invTarget;
		// Change the value if target is "maintenance" based on current config value.
		if (target == "maintenance") value = config.maintenance == "1" ? "0" : "1";

		// Elimination of invalid input based on config name. Return for an invalid input.
		switch (target) {
		case "ownerID": {
			if (author.id !== config.ownerID) return noPerm;
			const getUser = await client.users.fetch(value);
			if (!getUser) return invValue;
			break;
		}
		case "cooldown": {
			value = parseInt(value);
			if (isNaN(value) || value < 0) return invValue;
			break;
		}
		case "language": {
			if (!param.locale[value]) return invValue;
			break;
		}
		case "mainServerID":
		// Fallthrough
		case "threadServerID": {
			const getGuild = await client.guilds.cache.get(value);
			if (!getGuild) return invValue;
			break;
		}
		case "categoryID":
		// Fallthrough
		case "logChannelID": {
			const getGuild = await client.guilds.cache.get(config.threadServerID);
			if (!getGuild) return invValue;
			const getChannel = await getGuild.channels.cache.get(value);
			if (!getChannel) return invValue;
			if (target == "categoryID" && getChannel.type !== "GUILD_CATEGORY") return invValue;
			if (target == "logChannelID" && getChannel.type !== "GUILD_TEXT") return invValue;
			break;
		}
		case "adminRoleID":
		// Fallthrough
		case "modRoleID":
		// Fallthrough
		case "mentionedRoleID": {
			const getGuild = await client.guilds.cache.get(config.threadServerID);
			if (!getGuild) return invValue;
			let getRole = await getGuild.roles.fetch(value);
			if (target == "mentionedRoleID") {
				// Change the value and getRole if value is empty or -.
				if (!value || value == "-") {
					getRole = "-";
					value = "-";
				}
				value = value.toLowerCase();
				// Change the getRole value if value is the either everyone or here.
				if (value == "@everyone" || value == "@here") getRole = value;
				if (value == "everyone" || value == "here") {
					getRole = value;
					value = "@" + value;
				}
			}
			if (!getRole) return invValue;
			break;
		}
		case "infoColor":
		// Fallthrough
		case "sentColor":
		// Fallthrough
		case "receivedColor": {
			const colorTest = new RegExp(/^#[0-9A-F]{6}$/i);
			const color = [
				"DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "YELLOW", "PURPLE", "LUMINOUS_VIVID_PINK", "FUNCHSIA",
				"GOLD", "ORANGE", "RED", "GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE",
				"DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK RED", "DARK_GREY", "DARKER_GREY", "LIGHT_GREY",
				"DARK_NAVY", "BLURPLE", "GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK", "RANDOM"
			];
			value = value.toUpperCase();
			if (!colorTest.test(value) && !color.includes(value)) return invValue;
			break;
		}
		default: {
			// Config that aren't specified deemed passed the elimination process.
			break;
		}
		}
		// Change database config value.
		const set = await DB.config.set(target, value);
		if (!set) return { output: "error" };
		param.config[target] = value;
		if (target == "maintenance" || target == "language") await param.updateActivity.execute(param);
		return { output: "success", value: value };
	},
};
