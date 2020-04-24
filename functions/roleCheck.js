module.exports = {
  name: "roleCheck",
  async execute(message, roleID){
    const isRole = message.member.roles.get(roleID);

    if(isRole){
      return true;
    } else {
      return false;
    }
  }
};
