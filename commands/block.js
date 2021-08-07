module.exports = {
	name: "block",
	aliases: ["b"],
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

		const author = message.author;
		const modID = author.id;
		const firstArg = args.shift().toLowerCase();
		const infoArg = locale.info;
		const listArg = locale.list;

		if(infoArg.includes(firstArg)) {
			const userID = args.shift();
			const notBlocked = locale.notBlocked(userID);
			const notFoundEmbed = getEmbed.execute(param, "", config.error_color, locale.notFound, notBlocked);
			const blockData = await db.get(blockPrefix + userID);

			if(blockData) {
				const temp = blockData.split("-");
				const blockModID = temp.shift();
				const reason = temp.join("-");
				const data = [];
				data.push(`**${locale.user}** : <@${userID}> [\`${userID}\`]`);
				data.push(`**${locale.mod}** : <@${modID}> [\`${blockModID}\`]`);
				data.push(`**${locale.reason}** : ${reason}`);
				const infoEmbed = getEmbed.execute(param, "", config.info_color, locale.blockInfo, data.join("\n"));
				return replyChannel.send(infoEmbed);
			}
			else {
				console.log("> Data not found.");
				return replyChannel.send(notFoundEmbed);
			}
		}
		else if(listArg.includes(firstArg)) {
			let pageNumber = args.shift();

			const blocklist = await db.list(blockPrefix);
			let pages = Math.floor(blocklist.length / 20);
			if (blocklist.length % 20 != 0) {
			// add 1 number of pages if residual quotient is not 0 (15%10=5 -> 5 > 0)
				pages += 1;
			}
			if (blocklist.length == 0) {
				pageNumber = 0;
			}
			else if(!pageNumber || isNaN(pageNumber) || pageNumber <= 0) {
			// user didn't gave input or input is not a number or input is below or same as 0
				pageNumber = 1;
			}
			else if(pageNumber > pages) {
			// input is higher than the number of pages
				pageNumber = pages;
			}

			const pagedList = locale.pagedList(pages, pageNumber);
			const listArray = blocklist.map(block =>`🔸 <@${block.slice(blockPrefix.length)}> (\`${block.slice(blockPrefix.length)}\`)`);
			const firstIndex = Math.abs((pageNumber - 1) * 20);
			const listString = listArray.slice(firstIndex, firstIndex + 20).join("\n") || `\`${locale.emptyList}\``;

			const listEmbed = getEmbed.execute(param, "", config.info_color, pagedList.blockList, listString, "", pagedList.footer);
			return replyChannel.send(listEmbed);
		}
		else {
			const userID = firstArg;
			const reason = args.join(" ") || locale.empty;
			const blockDuplicate = locale.blockDuplicate(userID);
			const blockSuccess = locale.blockSuccess(userID);

			const duplicatedEmbed = getEmbed.execute(param, "", config.error_color, blockDuplicate.title, blockDuplicate.description);
			const successEmbed = getEmbed.execute(param, "", config.info_color, locale.success, blockSuccess);

			const dbKey = blockPrefix + userID;
			const isBlocked = await db.get(dbKey);
			if(isBlocked) {
				console.log(`> User [${userID}] is already blocked.`);
				return replyChannel.send(duplicatedEmbed);
			}
			else {
				db.set(dbKey, `${modID}-${reason}`).then(() => {
					console.log(`> Blocked [${userID}].`);
					return replyChannel.send(successEmbed);
				});
			}
		}
	},
};
