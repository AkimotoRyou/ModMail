module.exports = {
	name: 'helppt',
  aliases: ['ajuda'],
  level: 'User',
  guildOnly: false,
	args: false,
  usage: false,
	description: 'Mostrar instruções sobre como usar o bot.',
	note: false,
	async execute(param, message, args){
    const config = param.config;
    const prefix = config.prefix;
    const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "Instrução", `Na mensagem direta, usar \`${config.prefix}new Título do assunto\` para criar um novo tópico (**Thread Created!** é exibido). Não precisa de usar nenhum comando depois de criar o seu tópico. Em seguida, descreva o seu problema.`);

    return message.channel.send(helpEmbed);

  }
};
