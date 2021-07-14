module.exports = {
	name: "newThread",
	async execute(param, message, args) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const MessageAttachment = param.MessageAttachment;
		const moment = param.moment;
		const client = param.client;
		const config = param.config;
		const db = param.db;
		const threadPrefix = param.dbPrefix.thread;
		const getEmbed = param.getEmbed;
		const updateActivity = param.updateActivity;

		const mainServerID = config.mainServerID;
		const mainServer = await client.guilds.cache.get(mainServerID);
		const threadServerID = config.threadServerID;
		const threadServer = await client.guilds.cache.get(threadServerID);
		const categoryID = config.categoryID;
		const logChannelID = config.logChannelID;
		const logChannel = await threadServer.channels.cache.get(logChannelID);
		const author = message.author;
		const mentionedRoleID = config.mentionedRoleID;

		let mentionedRole = "";
		if (mentionedRoleID == "everyone" || mentionedRoleID == "here") {
			mentionedRole = "@" + mentionedRoleID;
		}
		else if (config.mentionedRoleID != null && config.mentionedRoleID != "empty") {
			mentionedRole = "<@&" + mentionedRoleID + ">";
		}

		const channelName = author.tag.replace(/[^0-9a-z]/gi, "") + `-${author.id}`;
		const newChannel = await threadServer.channels.create(channelName, { type: "text" });
		// Set channel parent and then set the permissions
		await newChannel.setParent(categoryID).then(chnl => chnl.lockPermissions());

		const logEmbed = getEmbed.execute(param, "", config.info_color, "New Thread", args.join(" "), "", author);
		logChannel.send(logEmbed);

		const dmEmbed = getEmbed.execute(param, "", config.info_color, "Thread Created!", `**Title** : ${args.join(" ")}\n\`Please describe your issue. (No command needed.)\``, "", mainServer);
		author.send(dmEmbed);

		const member = await mainServer.members.cache.get(author.id);
		const memberRoles = await member.roles.cache.filter(role => role.name != "@everyone").map(role => `<@&${role.id}>`).join(", ");
		const userData = [];
		userData.push(`**Created at**: ${moment(author.createdAt).format("D MMM YYYY, HH:mm")}`);
		userData.push(`**Joined at**: ${moment(member.joinedAt).format("D MMM YYYY, HH:mm")}`);
		userData.push(`**Roles**: ${memberRoles}`);
		const newThreadEmbed = getEmbed.execute(param, "", config.info_color, "New Thread", args.join(" "), [`User Info;${userData.join("\n")}`], author, author.displayAvatarURL());
		newChannel.send(mentionedRole, newThreadEmbed);
		if (message.attachments.size > 0) {
			await message.attachments.forEach(async atch => {
				const attachment = new MessageAttachment(atch.url);
				await newChannel.send(attachment);
			});
		}

		await db.set(threadPrefix + author.id, `${newChannel.id}-${args.join(" ")}`).then(() => console.log("> Thread Created!"));
		await updateActivity.execute(param);

	},
};
