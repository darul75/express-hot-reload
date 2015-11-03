# express-hot-reload

Webpack loader for Express routes/middleware hot reloads. (experimental, use it only for development)

This loader handles Express version 4.x (routing and middleware) hot updates when combined with webpack HMR.

## Why

Coding on server side with Express can be annoying as we need to restart when some code updates occur. 

Solutions like watchers exist and restart your node process...but webpack can offers hot reloading too.

Webpack HMR updates on an express application with usual Routing HTTP/middlewares routines won't work at all.

Indeed when HMR updates are applied, your code is run again but previous express routing registered to your instance should be canceled first.

![](https://github.com/darul75/express-hot-reload/blob/master/anim.gif)

## Solution

This solution could be certainly improved and I am not sure it works for all cases :)

This loader:

- parses every source files
	- looks for your express instance and register it
	- when detect some routing/middleware (with mount path) register them.
- enhances every source with a reference to current Express instance.

When an HMR update is triggered:

- cancel all previous routing/middleware declared in this file.

## Requirements

- Express application **variable instance name must be set to 'app'**
- Express application **instance must be exported**

```javascript
const app = module.exports = express(); // ok

// below named myApp won't work
// const myApp = module.exports = express();
```

- Use normal way of declaring updates with webpack HMR:

```javascript
if(module.hot) {

  var acceptedDepencies = ['./routing-app'...];

  module.hot.accept(acceptedDepencies, function() {
    // require again...
    require('./routing-app');
  });
```

## Installation

```bash
npm install express-hot-reload
```

In your server webpack config, add this loaders :

```javascript
{
  loaders: [
    {test: /\.js$/, loaders: ['express-hot-reload', 'babel-loader'], exclude: /node_modules/}
   ]
}
```
    	

## Note

Currently, it won't work with no mount path:

```javascript
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});
```

# Examples: 

https://github.com/darul75/hot-node-example
