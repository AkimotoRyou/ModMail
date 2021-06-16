module.exports = {
	name: "tagdelete",
	async execute(param, message, args) {
		const config = param.config;
		const db = param.db;
		const tagPrefix = param.dbPrefix.tag;
		const getEmbed = param.getEmbed;

		const tagName = args.join(' ').toLowerCase()
		const dbKey = tagPrefix + tagName;
		const isTag = await db.get(dbKey);
		const tagCollection = await db.list(tagPrefix);
		const tagList = tagCollection.map(tag => `\`${tag.slice(tagPrefix.length)}\``).join(', ') || "No available tag";

		const noTagEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Deleted (\`${tagName}\`) tag.`);

		if(!isTag) {
			console.log(`Tag not found.`);
			return message.channel.send(noTagEmbed);
		} else {
			db.delete(dbKey).then(() => {
				console.log(`Deleted ${tagName}.`);
				return message.channel.send(successEmbed);
			});
		}

	}
};
