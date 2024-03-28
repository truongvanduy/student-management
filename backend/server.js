const app = require('./app');
const config = require('./src/configs');

function startServer() {
  let port = config.app.port || 3000;
  port = 3001;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
