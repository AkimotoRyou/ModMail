module.exports = {
	name: "block",
	aliases: ["b"],
	level: "Moderator",
	guildOnly: true,
	args: true,
	reqConfig: false, // Configs needed to run this command.
	usage: ["<userID> [reason]", "<info|i|?> <userID>", "<list|l> [page number]"],
	description: "Block a user, show an info, or show list of blocked user(s).",
	note: "User presence isn't checked to enable blocking users that are outside the server.",
	async execute(param, message, args, replyChannel) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const config = param.config;
		const db = param.db;
		const blockPrefix = param.dbPrefix.block;
		const getEmbed = param.getEmbed;

		const author = message.author;
		const modID = author.id;
		const firstArg = args.shift().toLowerCase();

		switch(firstArg) {
		case "i": // fallthrough
		case "?": // fallthrough
		case "info": {
			const userID = args.shift();
			const notFoundEmbed = getEmbed.execute(param, "", config.error_color, "Not Found", `<@${userID}> (\`${userID}\`) isn't blocked.`);
			const blockData = await db.get(blockPrefix + userID);

			if(blockData) {
				const temp = blockData.split("-");
				const blockModID = temp.shift();
				const reason = temp.join("-");
				const data = [];
				data.push(`**User** : <@${userID}> [\`${userID}\`]`);
				data.push(`**Moderator** : <@${modID}> [\`${blockModID}\`]`);
				data.push(`**Reason** : ${reason}`);
				const infoEmbed = getEmbed.execute(param, "", config.info_color, "Block Info", data.join("\n"));
				replyChannel.send(infoEmbed);
			}
			else {
				console.log("> Data not found.");
				replyChannel.send(notFoundEmbed);
			}
			break;
		}
		case "l": // fallthrough
		case "list": {
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

			const listArray = blocklist.map(block =>`🔸 <@${block.slice(blockPrefix.length)}> (\`${block.slice(blockPrefix.length)}\`)`);
			const firstIndex = Math.abs((pageNumber - 1) * 20);
			let listString = listArray.slice(firstIndex, firstIndex + 20).join("\n") || "`List empty.`";
			if (pages > 1) {
				listString += `\n\`Page ${pageNumber} from ${pages} pages\``;
			}
			else {
				listString += `\n\`Page ${pageNumber} from ${pages} page\``;
			}

			const listEmbed = getEmbed.execute(param, "", config.info_color, "Blocked Users", listString);
			replyChannel.send(listEmbed);
			break;
		}
		default: {
			const userID = firstArg;
			const reason = args.join(" ") || "empty";

			const duplicatedEmbed = getEmbed.execute(param, "", config.error_color, "Duplicated", `<@${userID}> (\`${userID}\`) already blocked.`);
			const successEmbed = getEmbed.execute(param, "", config.info_color, "Success", `Succesfully block <@${userID}> (\`${userID}\`).`);

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
			break;
		}
		}
	},
};
