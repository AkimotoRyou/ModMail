module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "create",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async thread(param, locale, user, channel, title) {
		const { DB, client, config, getEmbed, threadList, updateActivity } = param;
		const { mainServerID, threadServerID, logChannelID, mentionedRoleID, infoColor } = config;
		const guilds = client.guilds;
		const userEmbedData = locale.commands.create.newThread(locale, title);

		const mainServer = guilds.cache.get(mainServerID);
		const threadServer = guilds.cache.get(threadServerID);
		const logChannel = await threadServer.channels.fetch(logChannelID);

		await DB.thread.set(user.id, channel.id, locale.name, title);
		threadList.push({
			userID: user.id,
			channelID: channel.id,
			language: locale.name,
			title: title,
		});
		await updateActivity.execute(param);

		const logEmbed = await getEmbed.execute(param, "", infoColor, userEmbedData.title, title, "", user);
		await logChannel.send({ embeds: [logEmbed] });

		let mentionedRole = "";
		if (mentionedRoleID == "@everyone" || mentionedRoleID == "@here") {
			mentionedRole = mentionedRoleID;
		}
		else if (config.mentionedRoleID && config.mentionedRoleID != "-") {
			mentionedRole = "<@&" + mentionedRoleID + ">";
		}
		const userData = [
			`${title}`,
			`🔹 ${locale.misc.User} : <@${user.id}>`,
			`🔹 ${locale.misc.createdAt} : <t:${Math.round(user.createdTimestamp / 1000)}:R>`,
		];
		const member = await guilds.cache.get(config.mainServerID).members.fetch(user.id);
		if (member) {
			const roles = await member.roles.cache.filter(role => role.name != "@everyone").map(role => `<@&${role.id}>` || "-").join(", ");
			userData.push(`🔹 ${locale.misc.joinedAt} : <t:${Math.round(member.joinedTimestamp / 1000)}:R>`);
			userData.push(`🔹 ${locale.misc.roles}: ${roles}`);
		}
		const threadEmbed = await getEmbed.execute(param, "", infoColor, userEmbedData.title, userData.join("\n"), "", user, user.displayAvatarURL());
		if (mentionedRole) await channel.send({ content: mentionedRole, embeds: [threadEmbed] });
		else await channel.send({ embeds: [threadEmbed] });

		const userEmbed = await getEmbed.execute(param, "", infoColor, userEmbedData.title, userEmbedData.userDM, "", mainServer);
		await user.send({ embeds: [userEmbed] }).catch(error => {
			if (error.message === "Cannot send messages to this user") return "dmDisabled";
			return error;
		});
	},
};
