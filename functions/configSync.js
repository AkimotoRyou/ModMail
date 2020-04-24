module.exports = {
  name: "configSync",
  async execute(param){
    const config = param.config;
    const ConfigDB = param.ConfigDB;
    const user = param.client.user;

    console.log("[Syncing Configuration]")
    user.setActivity("Syncing...", { type: "WATCHING" });
    let configKeys = Object.keys(config);
    var syncPromise = new Promise(resolve => {
      try {
        async function forLoop(){
          for (var i = 0; i < configKeys .length; i++) {
            let getConfig = await ConfigDB.findOne({ where: { name: configKeys[i] } });
            if(getConfig){
              console.log(`Syncing ${getConfig.name}...`)
              config[configKeys[i]] = getConfig.input || "empty";
            } else {
              //resolved too cause im still confused with reject()
              console.log("Calling reset function...")
              await param.reset.execute(param);
              break;
            }
          }
          resolve();
        }
        forLoop();
      } catch (error) {
        return console.log(error);
      }
    });
    syncPromise.then(() => {
      console.log("[Synced]");
      user.setActivity("[Ready]", { type: "WATCHING" });
    });
  }
};
