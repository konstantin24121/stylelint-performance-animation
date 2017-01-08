import stylelint from 'stylelint'
import valueParser from 'postcss-value-parser';
import isString from 'lodash/isString';

export const ruleName = 'plugin/no-low-performance-animation';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  default: () => {
    return 'You should not use low performance animation properties.'
  }
})

const TIMING_FUNCTION_KEYWORDS = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'step-start',
  'step-end'
];

const optionsSchema = {
  ignore: [isString],
};

module.exports = stylelint.createPlugin(ruleName, (options) => (cssRoot, result) => {

  const validOptions = stylelint.utils.validateOptions(result, ruleName, {
    actual: options,
    possible: optionsSchema,
    optional: true,
  });

  if (!validOptions) return;

  const allowedValue = ['opacity', 'transform'].concat(options ? options.ignore : []);

  cssRoot.walkDecls('transition-property', (decl) => {
    const value = decl.value;

    valueParser(value).walk((node) => {
      if (node.type === 'word' && allowedValue.indexOf(node.value) < 0) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: decl,
          message: messages.default()
        })
      }
    });

    return;
  })

  cssRoot.walkDecls('transition', (decl) => {
    const value = decl.value;
    const nodes = [];

    valueParser(value).walk((node) => {
      if (node.type === 'word')
        nodes.push(node.value)
      return false;
    })

    const props = nodes.filter((node) => {
      if (/[\+-]?[\w\.]*m?s/gim.test(node)) return false;
      if (TIMING_FUNCTION_KEYWORDS.indexOf(node) >=0 ) return false;
      return true;
    })

    props.forEach((value) => {
      if (allowedValue.indexOf(value) < 0) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: decl,
          message: messages.default()
        })
      }
    })
  })
})

module.exports.ruleName = ruleName
module.exports.messages = messages
