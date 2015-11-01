'use strict';

/* MATCH
following declaration

var router = express.Router();
const router = express.Router();
let router = express.Router();
*/
//var routerNamePattern = /(?:var|const|let)\s*(\w+)\s*\=\s*(?:express\.Router)/g;

/* MATCH
middleware and HTTP method routes
*/
var routerLevelPattern = /\.(?:all|get|param|post|delete|post|route|use)\('(\/([\w+\-\*\:]|\/?)*)/g;

var expressInstanciationPattern = /createServer\(/g;

module.exports = {

  check: function (source) {
    console.log("CHECK SOURCE");

    var containsExpressInstance = expressInstanciationPattern.test(source);

    console.log("isExpress " + containsExpressInstance);

    // var routerNames = [];

    // var routeVariableNameMatch;
    // while ((routeVariableNameMatch = routerNamePattern.exec(source)) !== null) {
    //   routerNames.push(routeVariableNameMatch[1]);
    // }

    var routes = [];
    var uses;
    var lastIndex = -1;
    while ((uses = routerLevelPattern.exec(source)) !== null) {
      routes.push(uses[1]);
      if (lastIndex < 0) {
        lastIndex = routerLevelPattern.lastIndex;
      }
    }

    // console.log(routerNames);
    console.log(routes);
    console.log(containsExpressInstance);

    return {
      containsExpressInstance: containsExpressInstance,
      routes: routes
      // routerNames: routerNames
    };

  }

};