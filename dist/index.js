'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

var _stylelint = require('stylelint');

var _stylelint2 = _interopRequireDefault(_stylelint);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ruleName = exports.ruleName = 'plugin/no-low-prformance-animation';
var messages = exports.messages = _stylelint2.default.utils.ruleMessages(ruleName, {
  default: function _default() {
    return 'You should not use low performance animation properties.';
  }
});

var TIMING_FUNCTION_KEYWORDS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'];

module.exports = _stylelint2.default.createPlugin(ruleName, function (options) {
  return function (cssRoot, result) {
    var allowedValue = ['opacity', 'transform'];

    cssRoot.walkDecls('transition-property', function (decl) {
      var value = decl.value;

      (0, _postcssValueParser2.default)(value).walk(function (node) {
        if (node.type === 'word' && allowedValue.indexOf(node.value) < 0) {
          _stylelint2.default.utils.report({
            ruleName: ruleName,
            result: result,
            node: decl,
            message: messages.default()
          });
        }
      });

      return;
    });

    cssRoot.walkDecls('transition', function (decl) {
      var value = decl.value;
      var nodes = [];

      (0, _postcssValueParser2.default)(value).walk(function (node) {
        if (node.type === 'word') nodes.push(node.value);
        return false;
      });

      var props = nodes.filter(function (node) {
        if (/[\+-]?[\w\.]*m?s/gim.test(node)) return false;
        if (TIMING_FUNCTION_KEYWORDS.indexOf(node) >= 0) return false;
        return true;
      });

      props.forEach(function (value) {
        if (allowedValue.indexOf(value) < 0) {
          _stylelint2.default.utils.report({
            ruleName: ruleName,
            result: result,
            node: decl,
            message: messages.default()
          });
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;