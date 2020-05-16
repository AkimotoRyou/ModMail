module.exports = {
	name: "unblock",
	async execute(param, message, args) {
		const moment = param.moment;
		const client = param.client;
		const config = param.config;
		const BlockedDB = param.BlockedDB;
		const getEmbed = param.getEmbed;

		const userID = args.shift();

		const notFoundEmbed = getEmbed.execute(param, config.error_color, "Not Found", `<@${userID}> (\`${userID}\`) isn't blocked.`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Succesfully unblock <@${userID}> (\`${userID}\`).`);

		const rowCount = await BlockedDB.destroy({ where: { userID: userID } });
		if (rowCount > 0) {
			console.log(`Unblocked ${userID}`);
			return message.channel.send(successEmbed);
		} else {
			return message.channel.send(notFoundEmbed);
		}

	}
};
