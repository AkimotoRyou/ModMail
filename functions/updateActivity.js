module.exports = {
	name: "updateActivity",
	async execute(param) {
		const activities = param.activities;
		const ThreadDB = param.ThreadDB;

		const threads = await ThreadDB.findAll({ attributes: ["userID"] }).catch(
			error => {console.log(error)}
		);

		activities.shift();
		activities.unshift(`${threads.length} Threads | ${param.config.prefix}commands`);
	}
};
