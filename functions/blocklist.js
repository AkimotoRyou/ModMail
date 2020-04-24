module.exports = {
	name: "blocklist",
	async execute(param, message, args){
    const moment = param.moment;
    const client = param.client;
    const config = param.config;
    const BlockedDB = param.BlockedDB;
		const getEmbed = param.getEmbed;

    var pageNumber = args.shift();

    const blocklist = await BlockedDB.findAll({ attributes: ["userID", "createdAt"] });
    var pages = Math.floor(blocklist.length / 20);
    if (blocklist.length % 20 != 0) {
      //add 1 number of pages if residual quotient is not 0 (15%10=5 -> 5 > 0)
      pages += 1;
    }
    if (blocklist.length == 0) {
      pageNumber = 0;
    } else if(!pageNumber || isNaN(pageNumber) || pageNumber <= 0) {
      //user didn't gave input or input is not a number or input is below or same as 0
      pageNumber = 1;
    } else if(pageNumber > pages){
      //input is higher than the number of pages
      pageNumber = pages;
    }

    const listArray = blocklist.map(block =>`**[${moment(block.createdAt).format("D MMM YYYY")}]** <@${block.userID}> \`(${block.userID})\``);
    const firstIndex = Math.abs((pageNumber-1) * 20);
    let listString = listArray.slice(firstIndex, firstIndex + 20).join("\n") || `\`List empty.\``;
    if (pages > 1) {
      listString += `\n\`Page ${pageNumber} from ${pages} pages\``;
    } else {
      listString += `\n\`Page ${pageNumber} from ${pages} page\``;
    }

    const listEmbed = getEmbed.execute(param, config.info_color, "Blocked Users", listString);
    return message.channel.send(listEmbed);

  }
};
