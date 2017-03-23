'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

var _stylelint = require('stylelint');

var _stylelint2 = _interopRequireDefault(_stylelint);

var _postcssValueParser = require('postcss-value-parser');

var _postcssValueParser2 = _interopRequireDefault(_postcssValueParser);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex');

var _declarationValueIndex2 = _interopRequireDefault(_declarationValueIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ruleName = exports.ruleName = 'plugin/no-low-performance-animation';
var messages = exports.messages = _stylelint2.default.utils.ruleMessages(ruleName, {
  default: function _default(prop) {
    return 'You should not use low performance animation properties (' + prop + ').';
  }
});

var TIMING_FUNCTION_KEYWORDS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'];

var optionsSchema = {
  ignore: [_isString2.default]
};

module.exports = _stylelint2.default.createPlugin(ruleName, function (actual, options) {
  return function (cssRoot, result) {

    var validOptions = _stylelint2.default.utils.validateOptions(result, ruleName, { actual: actual }, {
      actual: options,
      possible: optionsSchema,
      optional: true
    });

    if (!validOptions) return;

    var allowedValue = ['opacity', 'transform', 'none', 'initial', 'inherit'].concat(options ? options.ignore : []);

    cssRoot.walkDecls('transition-property', function (decl) {
      var value = decl.value;

      (0, _postcssValueParser2.default)(value).walk(function (node) {
        if (node.type === 'word' && allowedValue.indexOf(node.value) < 0) {
          var index = (0, _declarationValueIndex2.default)(decl) + node.sourceIndex;
          _stylelint2.default.utils.report({
            ruleName: ruleName,
            result: result,
            node: decl,
            message: messages.default(node.value),
            index: index
          });
        }
      });

      return;
    });

    cssRoot.walkDecls('transition', function (decl) {
      var value = decl.value;
      var nodes = [];

      (0, _postcssValueParser2.default)(value).walk(function (node) {
        if (node.type === 'word') nodes.push({ index: node.sourceIndex, value: node.value });
        return false;
      });

      var props = nodes.filter(function (_ref) {
        var value = _ref.value;

        if (/[\+-]?[\w\.]*m?s/gim.test(value)) return false;
        if (/^\$/gim.test(value)) return false;
        if (TIMING_FUNCTION_KEYWORDS.indexOf(value) >= 0) return false;
        return true;
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          var index = (0, _declarationValueIndex2.default)(decl) + prop.index;
          if (allowedValue.indexOf(prop.value) < 0) {
            _stylelint2.default.utils.report({
              ruleName: ruleName,
              result: result,
              node: decl,
              message: messages.default(prop.value),
              index: index
            });
            return;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return;
    });

    cssRoot.walkAtRules(/^keyframes$/i, function (atRuleKeyframes) {
      atRuleKeyframes.walkDecls(function (decl) {
        if (allowedValue.indexOf(decl.prop) < 0) {
          var index = 1;
          _stylelint2.default.utils.report({
            ruleName: ruleName,
            result: result,
            node: decl,
            message: messages.default(decl.prop)
          });
          return;
        };
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;