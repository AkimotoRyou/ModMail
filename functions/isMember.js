module.exports = {
  name: "isMember",
  async execute(param, userID){
    const client = param.client;
    const mainServerID = param.config.mainServerID;
    const mainServer = await client.guilds.get(mainServerID);
    const isMember = await mainServer.members.get(userID);

    if(isMember){
      return true;
    } else {
      return false;
    }
  }
};
