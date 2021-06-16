module.exports = {
	name: "taginfo",
	async execute(param, message, args) {
		const moment = param.moment;
		const config = param.config;
		const db = param.db;
		const tagPrefix = param.dbPrefix.tag;
		const getEmbed = param.getEmbed;

		const tagName = args.join(' ').toLowerCase();
		const dbKey = tagPrefix + tagName;
		const isTag = await db.get(dbKey);
		const tagCollection = await db.list(tagPrefix);
		const tagList = tagCollection.map(tag => `\`${tag.slice(tagPrefix.length)}\``).join(', ') || "No available tag";

		const noTagEmbed = getEmbed.execute(param, config.error_color, "Not Found", `CouldnS't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);

		if(!isTag) {
			console.log(`Tag not found.`);
			return message.channel.send(noTagEmbed);
		} else {
			const data = [];

			data.push(`**Name** : ${tagName}`);
			data.push(`**Response** : \`\`\`${isTag}\`\`\``);

			const tagInfoEmbed = getEmbed.execute(param, config.info_color, "Tag Information", data.join('\n'));
			return message.channel.send(tagInfoEmbed);
		}

	}
};
