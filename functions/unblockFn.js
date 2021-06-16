module.exports = {
	name: "unblock",
	async execute(param, message, args) {
		const config = param.config;
		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const getEmbed = param.getEmbed;

		const userID = args.shift();

		const notFoundEmbed = getEmbed.execute(param, config.error_color, "Not Found", `<@${userID}> (\`${userID}\`) isn't blocked.`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Succesfully unblock <@${userID}> (\`${userID}\`).`);

		const dbKey = blockPrefix + userID;
		const blockData = await db.get(dbKey);
		if(blockData) {
			db.delete(dbKey).then(() => {
				console.log(`Unblocked ${userID}.`);
				return message.channel.send(successEmbed);
			})
		} else {
			return message.channel.send(notFoundEmbed);
		}
	}
};
