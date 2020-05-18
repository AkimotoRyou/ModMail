module.exports = {
	name: "block",
	async execute(param, message, args) {
		const config = param.config;
		const BlockedDB = param.BlockedDB;
		const getEmbed = param.getEmbed;

		const modID = message.author.id;
		const userID = args.shift();
		const reason = args.join(' ') || "empty";

		const duplicatedEmbed = getEmbed.execute(param, config.error_color, "Duplicated", `<@${userID}> (\`${userID}\`) already blocked.`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Succesfully block <@${userID}> (\`${userID}\`).`);

		try{
			const blockThis = await BlockedDB.create({
				userID: userID,
				modID: modID,
				reason: reason
			});
			if(blockThis) {
				console.log(`Blocked [${userID}]`);
				return message.channel.send(successEmbed);
			}
		} catch (error) {
			if(error.name == "SequelizeUniqueConstraintError") {
				return message.channel.send(duplicatedEmbed);
			}
		}

	}
};
