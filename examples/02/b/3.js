
// Example 02.b.2 - Create REST API, and serve static files

const NeDB = require('nedb');
const path = require('path');

const service = require('feathers-nedb');
const rest = require('feathers-rest');

const httpServerConfig = require('../common/httpServerConfig');
const middleware = require('../common/middleware');

const app = httpServerConfig()
  .configure(rest())
  .configure(services)
  .configure(middleware);

const server = app.listen(3030);
server.on('listening', () => console.log(`Feathers application started on port 3030`));

function services() {
  this.use('/users', service({ Model: userModel() }));
}

function userModel() {
  return new NeDB({
    filename: path.join('examples', 'data', 'users.db'),
    autoload: true
  });
}
