# express-hot-reload

Webpack loader for Express routes reloading. (experimental, use it only for development)

This loader handles Express version 4.x (routing and middleware) hot updates when combined with webpack HMR.

## Why

By using Webpack HMR on express application with usual Routing HTTP/middlewares routines, webpack hot reload updates won't work at all.

Indeed when HMR updates are applied, your code is run again but previous express routing registered to your instance should be canceled first.

## Solution

This solution could be certainly improved and I am not sure it works for all cases :)

This loader:

- parses every source files
	- looks for your express instance and register it
	- when detect some routing/middleware (with mount path) register it.
- enhances every source with a reference to current Express instance.

When an HMR update is triggered:

- cancel all previous routing/middleware declared in this file.

## Requirements

- Express application variable instance must be set to 'app'

```javascript
const app = module.exports = express(); // ok

// below named myApp won't work
// const myApp = module.exports = express();
```

- Export your express application instance:

```javascript
const app = module.exports = express();
```

Use normal way of declaring updates with webpack HMR:

if(module.hot) {

  var acceptedDepencies = ['./routing-app'...];

  module.hot.accept(acceptedDepencies, function() {
    // require again...
    require('./routing-app');
  });

## Note

It won't work with no mount path:

```javascript
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});
```


