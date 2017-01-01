'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

var _stylelint = require('stylelint');

var _stylelint2 = _interopRequireDefault(_stylelint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ruleName = exports.ruleName = 'plugin/no-low-prformance-animation';
var messages = exports.messages = _stylelint2.default.utils.ruleMessages(ruleName, {
  default: function _default() {
    return 'You should not use low performance animation properties.';
  }
});

module.exports = _stylelint2.default.createPlugin(ruleName, function (options) {
  return function (cssRoot, result) {
    cssRoot.walkDecls('transition-property', function (decl) {
      var allowedValue = ['opacity', 'transform'];
      var value = decl.value;
      if (allowedValue.indexOf(value) >= 0) return;

      _stylelint2.default.utils.report({
        ruleName: ruleName,
        result: result,
        node: decl,
        message: messages.default()
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;