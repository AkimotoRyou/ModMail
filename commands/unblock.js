module.exports = {
	name: "unblock",
	aliases: false,
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<userID>"],
	description: "Unblock user from creating new thread.",
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const getEmbed = param.getEmbed;

		const userID = args.shift();

		const notFoundEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `<@${userID}> (\`${userID}\`) isn't blocked.`);
		const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `Succesfully unblock <@${userID}> (\`${userID}\`).`);

		const dbKey = blockPrefix + userID;
		const blockData = await db.get(dbKey);
		if(blockData) {
			db.delete(dbKey).then(() => {
				console.log(`> Unblocked ${userID}.`);
				return replyChannel.send(successEmbed);
			});
		}
		else {
			console.log("> Data not found.");
			return replyChannel.send(notFoundEmbed);
		}
	},
};
