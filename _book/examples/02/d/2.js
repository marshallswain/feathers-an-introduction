
// Example 02.d.2 - Use hooks with service

const Ajv = require('ajv'); // new
const NeDB = require('nedb');
const path = require('path');

const authHooks = require('feathers-authentication-local').hooks; // new
const hooks = require('feathers-hooks'); // new
const commonHooks = require('feathers-hooks-common'); // new
const service = require('feathers-nedb');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const httpServerConfig = require('../common/httpServerConfig');
const middleware = require('../common/middleware');

const app = httpServerConfig()
  .configure(hooks()) // new
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);

const server = app.listen(3030);
server.on('listening', () => console.log(`Feathers application started on port 3030`));

function services() {
  this.configure(user); // new
}

function user() { // new
  const app = this;
  
  app.use('/users', service({ Model: userModel() }));
  const userService = app.service('users');
  
  const { /* validateSchema, */ setCreatedAt, setUpdatedAt, unless, remove } = commonHooks;
  
  userService.before({
    create: [
      validateSchema(userSchema(), Ajv), authHooks.hashPassword(), setCreatedAt(), setUpdatedAt()
    ]});
  userService.after({
    all: unless(hook => hook.method === 'find', remove('password')),
  });
}

function userModel() {
  return new NeDB({
    filename: path.join('examples', 'data', 'users.db'),
    autoload: true
  });
}

function userSchema() { // new
  return {
    title: 'User Schema',
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: [ 'email', 'password' ],
    additionalProperties: false,
    properties: {
      email: { type: 'string', maxLength: 100, minLength: 6 },
      password: { type: 'string', maxLength: 30, minLength: 8 }
    }
  };
}

function validateSchema() { // todo replace
  return hook => hook;
}
