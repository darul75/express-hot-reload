var path = require('path'),
  parser = require('./parser'),
  SourceNode = require('source-map').SourceNode,
  SourceMapConsumer = require('source-map').SourceMapConsumer,
  makeIdentitySourceMap = require('./makeIdentitySourceMap');

module.exports = function(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  var resourcePath = this.resourcePath,
    filename = path.basename(resourcePath);

  if (/[\\/]webpack[\\/]express-hot-loader[\\/]/.test(resourcePath)) {
    return this.callback(null, source, map);
  }

  var fine = true;

  if (/node_modules/.test(resourcePath)) {
    return this.callback(null, source, map);
  }

  // cleaner
  var src = source.replace(/\r?\n|\r/g, ' ');

  // code generation
  var prependTxt = [],
      appendTxt,
      separator = '\n\n';

  var check = parser(resourcePath, src);

  var processor = require('./processor');

  if (check.containsExpressInstance) {
    processor.setExpressResourcePath(resourcePath);
  }

  prependTxt = [
    'var processor = require(' + JSON.stringify(require.resolve('./processor')) + ');\n',
  ];

  if (processor.mainExpressResourcePath != null &&
    processor.mainExpressResourcePath !== resourcePath) {
    // INJECT EXPRESS APP
    prependTxt.push('var expressFile = ' +JSON.stringify(processor.mainExpressResourcePath) + ';\n\t');
    prependTxt.push('var app = require(' + JSON.stringify(require.resolve(processor.mainExpressResourcePath)) + ');\n\t');
  }

  prependTxt = prependTxt.join(' ');

  appendTxt = [
    'if (module.hot && ' +JSON.stringify(fine) +') {\n\t',
      'module.hot.dispose(function(data){\n\t\t',
        'if (module.hot.data.routes.length > 0 && app != null) {\n\t\t',
          '\tprocessor.doReload(app, module.hot.data);\n',
        '\t\t}\n',
      '\t});\n\n',

      'var warning = '+JSON.stringify(check.containsExpressInstance)+' && '+(check.routes != null && check.routes.length > 0) + ';\n\n',

      'module.hot.data = {\n\t',
        'routerNames: '+JSON.stringify(check.routerNames)+',\n\t',
        'routes: '+JSON.stringify(check.routes)+',\n\t',
        'warning: warning\n',
      '};\n\n',

      'if (module.hot.data.warning) {\n',
        '\tprocessor.warn();\n',
      '}\n',

    '}'
  ].join(' ');

  if (this.sourceMap === false) {
    return this.callback(null, [
      prependTxt,
      source,
      appendTxt
    ].join(separator));
  }

  var newCode = [
      prependTxt,
      source,
      appendTxt
    ].join(separator);

  if (!map) {
    map = makeIdentitySourceMap(source, this.resourcePath);
  }

  var node = new SourceNode(null, null, null, [
    new SourceNode(null, null, this.resourcePath, prependTxt),
    SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
    new SourceNode(null, null, this.resourcePath, appendTxt)
  ]).join(separator);

  var result = node.toStringWithSourceMap();

  this.callback(null, result.code, result.map.toString());
}
