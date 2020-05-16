module.exports = {
	name: 'helpes',
	aliases: ['ayuda'],
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: 'Mostrar instrucciones sobre cómo usar el bot.',
	note: false,
	async execute(param, message, args) {
		const config = param.config;
		const prefix = config.prefix;
		const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "Instrucción", `En un mensaje privado, utilice \`${config.prefix}new el tema de su problema\` para crear un nuevo ticket (se muestra **Thread Created!**). No necesita usar ningún comando después de la creación del ticket. Luego describe su problema.`);

		return message.channel.send(helpEmbed);

	}
};
