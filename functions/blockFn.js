module.exports = {
	name: "block",
	async execute(param, message, args) {
		const config = param.config;
		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const getEmbed = param.getEmbed;

		const modID = message.author.id;
		const userID = args.shift();
		const reason = args.join(' ') || "empty";

		const duplicatedEmbed = getEmbed.execute(param, config.error_color, "Duplicated", `<@${userID}> (\`${userID}\`) already blocked.`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Succesfully block <@${userID}> (\`${userID}\`).`);

		const dbKey = blockPrefix + userID;
		const isBlocked = await db.get(dbKey);
		if(isBlocked){
			console.log(`User [${userID}] is already blocked.`);
			return message.channel.send(duplicatedEmbed);
		} else {
			db.set(dbKey, `${modID}-${reason}`).then(() => {
				console.log(`Blocked [${userID}].`);
				return message.channel.send(successEmbed);
			})
		}
	}
};
