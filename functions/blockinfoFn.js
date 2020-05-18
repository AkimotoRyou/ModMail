module.exports = {
	name: "blockinfo",
	async execute(param, message, args) {
		const moment = param.moment;
		const config = param.config;
		const BlockedDB = param.BlockedDB;
		const getEmbed = param.getEmbed;

		const userID = args.shift();

		const notFoundEmbed = getEmbed.execute(param, config.error_color, "Not Found", `<@${userID}> (\`${userID}\`) isn't blocked.`);

		const findUser = await BlockedDB.findOne({ where: { userID: userID } });
		if(findUser) {
			const data = [];
			data.push(`**User** : <@${findUser.userID}>`);
			data.push(`**User ID** : \`${findUser.userID}\``);
			data.push(`**Blocked at** : ${moment(findUser.createdAt).format("D MMMM YYYY, **HH:mm:ss** UTC")}`);
			data.push(`**Moderator** : <@${findUser.modID}>`);
			data.push(`**Moderator ID** : \`${findUser.modID}\``);
			data.push(`**Reason** : ${findUser.reason}`);
			const infoEmbed = getEmbed.execute(param, config.info_color, "Block Info", data.join('\n'));
			return message.channel.send(infoEmbed);
		} else {
			return message.channel.send(notFoundEmbed);
		}

	}
};
