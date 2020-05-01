module.exports = {
	name: "tagdelete",
	async execute(param, message, args){
    const client = param.client;
    const config = param.config;
    const TagDB = param.TagDB;
		const getEmbed = param.getEmbed;

    const tagName = args.join(' ').toLowerCase();
		const isTag = await TagDB.findOne({where: {name: tagName}});
		const tagCollection = await TagDB.findAll({ attributes: ["name"] });
    const tagList = tagCollection.map(tag => `\`${tag.name}\``).join(', ') || "No available tag";

    const noTagEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn\'t find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
    const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Deleted (\`${tagName}\`) tag.`);

		if(!isTag){
			return message.channel.send(noTagEmbed);
		} else {
			const rowCount = await TagDB.destroy({where: {name: tagName}});
			if(rowCount > 0){
				return message.channel.send(successEmbed);
			}
		}

  }
};
