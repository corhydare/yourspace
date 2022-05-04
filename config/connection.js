const { connect, connection } = require("mongoose");

// After you create your Heroku application, visit https://dashboard.heroku.com/apps/ select the application name and add your Atlas connection string as a Config Var
// Node will look for this environment variable and if it exists, it will use it. Otherwise, it will assume that you are running this application locally
const connectionString =
  process.env.MONGODB_URI ||
  `mongodb+srv://winston:LbLUz1F7jo0A4Pf1@2plus2is5.e4cqa.mongodb.net/Mainframe?authMechanism=SCRAM-SHA-1`;

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
