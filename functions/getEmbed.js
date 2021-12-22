module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "getEmbed",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async execute(param, author, color, title, description, fields, footer, thumbnail) {
		const embed = new param.MessageEmbed();

		if (color) embed.setColor(color);
		if (title) embed.setTitle(title);
		if (description) embed.setDescription(description);
		if (thumbnail) embed.setThumbnail(thumbnail);
		if (fields) {
			fields.forEach(field => {
				const splitted = field.split(param.separator);
				embed.addField(splitted[0], splitted[1]);
			});
		}
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// author is a guild instance
		if (author?.name) embed.setAuthor(author.name, author.iconURL());
		// author is a guild member instance
		else if (author?.user) embed.setAuthor(author.user.tag, author.user.displayAvatarURL());
		// author is a user instance
		else if (author?.tag) embed.setAuthor(author.tag, author.displayAvatarURL());
		// author is possibly a String
		else if (author) embed.setAuthor(author);
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// footer is guild object
		if (footer?.name) embed.setFooter(`${footer.name}`, footer.iconURL());
		// footer is member object
		else if (footer?.user) embed.setFooter(`${footer.user.tag} • ${footer.user.id}`, footer.user.displayAvatarURL());
		// footer is user object
		else if (footer?.tag) embed.setFooter(`${footer.tag} • ${footer.id}`, footer.displayAvatarURL());
		// footer is possibly a String
		else if (footer) embed.setFooter(`${footer}`);
		return embed;
	},
};
