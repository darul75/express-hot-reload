'use strict';

/* middleware and HTTP method routes*/
var routerLevelPattern = /\.(?:all|get|param|post|delete|post|route|use)\('(\/([\w+\-\*\:]|\/?)*)/g;

/* http server*/
var expressInstanciationPattern = /createServer\(/g;

module.exports = function(filepath, source) {
  console.log('parsing %s', filepath);

  var containsExpressInstance = expressInstanciationPattern.test(source);

  var routes = [];
  var uses;
  var lastIndex = -1;
  while ((uses = routerLevelPattern.exec(source)) !== null) {
    routes.push(uses[1]);
    if (lastIndex < 0) {
      lastIndex = routerLevelPattern.lastIndex;
    }
  }

  if (routes.length) {
    console.log('routes defined are %s', routes.toString());
  }

  if (containsExpressInstance) {
    console.log('express instance defined in this file');
  }

  console.log('\n\n');

  return {
    containsExpressInstance: containsExpressInstance,
    routes: routes
  };

};
