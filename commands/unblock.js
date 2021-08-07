module.exports = {
	name: "unblock",
	aliases: [],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const getEmbed = param.getEmbed;
		const locale = param.locale;

		const userID = args.shift();
		const unblockCmd = locale.unblockCmd(userID);

		const notFoundEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, unblockCmd.notBlocked);
		const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, unblockCmd.unblock);

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
