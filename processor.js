'use strict';

var layerNames = ['bound dispatch','<anonymous>'];

module.exports = {

  doReload: function (app, data) {
    console.log('starting erasing old routes');

    // match layer with current file routes
    var matchRoute = function(layer, idx) {
      for (var i=0; i<data.routes.length; i++) {
        var path = data.routes[i];
        try {
          var match = layer.match(path);
          if (match) {
            return false;
          }
        }
        catch (err) {
          console.log(err);
        }
      }

      return true;
    };

    var checkRoute = function(layer) {

      var stack = layer.handle.stack || (layerNames.indexOf(layer.name) >= 0 ? [layer] : null);

      var removes = [];

      if (stack != null) {

        var oldLengh = stack.length;

        var newStack = stack.filter(matchRoute);

        if (oldLengh !== newStack.length) {
          return true;
        }

      }

      if (layer.route) {
        checkRoutes(layer.route.stack);
      }
    };

    var checkRoutes = function(stack) {

      var removes = [];

      for (var i = 0;i<stack.length;i++) {
        var check = checkRoute(stack[i]);
        if (check) {
          removes.push(i);
        }
      }

      removes.sort(function(a, b) { return a - b; });

      for (var i = removes.length -1; i >= 0; i--) {
        stack.splice(removes[i],1);
      }
    };

    checkRoutes(app._router.stack);

    console.log('erasing old routes done');
  },

  setExpressResourcePath: function(path) {
    this.mainExpressResourcePath = path;
  },

  warn: function() {
    console.warn(
      '********************************************************\n' +
      'It appears you put your middlewares/routes in main file.\n' +
      'Please declare it in your dependencies.\n' +
      '********************************************************\n');
  }
};