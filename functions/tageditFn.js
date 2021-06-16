module.exports = {
	name: "tagedit",
	async execute(param, message, args) {
		const config = param.config;
		const db = param.db;
		const tagPrefix = param.dbPrefix.tag;
		const getEmbed = param.getEmbed;

		const tagName = args.join(' ').toLowerCase();
		const dbKey = tagPrefix + tagName;
		const isTag = await db.get(dbKey);
		const tagCollection = await db.list(tagPrefix);
		const tagList = tagCollection.map(tag => `\`${tag.slice(tagPrefix.length)}\``).join(', ') || "No available tag";

		const noTagEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn't find tag named \`${tagName}\`.\nAvailable names : ${tagList}`);
		const successEmbed = getEmbed.execute(param, config.info_color, "Success", `Succesfully edit (\`${tagName}\`) tag response.`);
		const waitingEmbed = getEmbed.execute(param, config.info_color, "Response", `Please write new response for this tag.\nType \`cancel\` to cancel the command.\n\n\`Timeout: 30 seconds.\``);
		const cancelEmbed = getEmbed.execute(param, config.error_color, "Canceled", `Command are canceled.`);
		const timeoutEmbed = getEmbed.execute(param, config.error_color, "Timeout", `Timeout, command are canceled.`);

		if(!isTag) {
			console.log(`Tag not found.`);
			return message.channel.send(noTagEmbed);
		} else {
			const filter = msg => msg.author.id == message.author.id;

			message.channel.send(waitingEmbed).then(() => {
				message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
					.then(async collected => {
						if (collected.first().content.toLowerCase() == "cancel") {
							return message.channel.send(cancelEmbed);
						} else {
							const content = collected.first().content;
							db.set(dbKey, content).then(() => {
								console.log(`Edited [${tagName}] tag`);
								return message.channel.send(successEmbed);
							});
						}
					})
					.catch(collected => {
						return message.channel.send(timeoutEmbed);
					});
			});
		}

	}
};
