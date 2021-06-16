module.exports = {
	name: "blockinfo",
	async execute(param, message, args) {
		const config = param.config;
		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const getEmbed = param.getEmbed;

		const userID = args.shift();

		const notFoundEmbed = getEmbed.execute(param, config.error_color, "Not Found", `<@${userID}> (\`${userID}\`) isn't blocked.`);

		const blockData = await db.get(blockPrefix + userID);
		if(blockData) {
			const temp = blockData.split("-");
			const modID = temp.shift();
			const reason = temp.join("-");
			const data = [];
			data.push(`**User** : <@${userID}> [\`${userID}\`]`);
			data.push(`**Moderator** : <@${modID}> [\`${modID}\`]`);
			data.push(`**Reason** : ${reason}`);
			const infoEmbed = getEmbed.execute(param, config.info_color, "Block Info", data.join('\n'));
			return message.channel.send(infoEmbed);
		} else {
			return message.channel.send(notFoundEmbed);
		}

	}
};
