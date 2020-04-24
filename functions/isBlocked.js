module.exports = {
  name: "isBlocked",
  async execute(param, userID){
    const BlockedDB = param.BlockedDB;
    const isBlocked = await BlockedDB.findOne({ where: {userID: userID} });

    if(isBlocked){
      return true;
    } else {
      return false;
    }
  }
};
