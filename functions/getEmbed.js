module.exports = {
	name: "getEmbed",
	execute(param, author, color, title, description, fields, footer, thumbnail) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);
		console.log(`> Title: ${title || "empty"}`);

		const embed = new param.Discord.MessageEmbed().setTimestamp();
		if (author) {
			if (author.name) {
				// author is a guild instance
				embed.setAuthor(author.name, author.iconURL());
			}
			else if (author.user) {
				// author is a guild member instance
				embed.setAuthor(author.user.tag, author.user.displayAvatarURL());
			}
			else if (author.tag) {
				// author is a user instance
				embed.setAuthor(author.tag, author.displayAvatarURL());
			}
			else {
				// author is possibly a String
				embed.setAuthor(author);
			}
		}
		if (color) {
			embed.setColor(color);
		}
		if (title) {
			embed.setTitle(title);
		}
		if (description) {
			embed.setDescription(description);
		}
		if (fields) {
			fields.forEach(field => {
				const splitted = field.split(";");
				embed.addField(splitted[0], splitted[1]);
			});
		}
		if (thumbnail) {
			embed.setThumbnail(thumbnail);
		}
		if (footer) {
			if (footer.user) {
				// footer is member object
				embed.setFooter(`${footer.user.tag} | ${footer.user.id}`, footer.user.displayAvatarURL());
			}
			else if (footer.tag) {
				// footer is user object
				embed.setFooter(`${footer.tag} | ${footer.id}`, footer.displayAvatarURL());
			}
			else if (footer.name) {
				// footer is guild object
				embed.setFooter(`${footer.name}`, footer.iconURL());
			}
			else {
				// footer is possibly a String
				embed.setFooter(footer);
			}
		}
		return embed;
	},
};
