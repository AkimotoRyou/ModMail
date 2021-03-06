module.exports = {
	name: "taginfo",
	async execute(param, message, args) {
		const moment = param.moment;
		const config = param.config;
		const TagDB = param.TagDB;
		const getEmbed = param.getEmbed;

		const tagName = args.join(' ').toLowerCase();
		const isTag = await TagDB.findOne({ where: { name: tagName } });
		const tagCollection = await TagDB.findAll({ attributes: ["name"] });
		const tagList = tagCollection.map(tag => `\`${tag.name}\``).join(', ') || "No available tag";

		const noTagEmbed = getEmbed.execute(param, config.error_color, "Not Found", `CouldnS't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);

		if(!isTag) {
			return message.channel.send(noTagEmbed);
		} else {
			const data = [];

			data.push(`**Name** : ${isTag.name}`);
			data.push(`**Created at** : ${moment(isTag.createdAt).format("D MMMM YYYY, **HH:mm:ss** UTC")}`);
			data.push(`**Updated at** : ${moment(isTag.updatedAt).format("D MMMM YYYY, **HH:mm:ss** UTC")}`);
			data.push(`**Response** : \`\`\`${isTag.content}\`\`\``);

			const tagInfoEmbed = getEmbed.execute(param, config.info_color, "Tag Information", data.join('\n'));
			return message.channel.send(tagInfoEmbed);
		}

	}
};
