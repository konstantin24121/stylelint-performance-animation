import stylelint from 'stylelint'
import valueParser from 'postcss-value-parser';
import isString from 'lodash/isString';
import filter from 'lodash/filter'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex';

export const ruleName = 'plugin/no-low-performance-animation';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  default: (prop) =>
    `You should not use low performance animation properties (${prop}).`
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

module.exports = stylelint.createPlugin(ruleName, (actual, options) => (cssRoot, result) => {

  const validOptions = stylelint.utils.validateOptions(result, ruleName, { actual }, {
    actual: options,
    possible: optionsSchema,
    optional: true,
  });

  if (!validOptions) return;

  const allowedValue = ['opacity', 'transform', 'none', 'initial', 'inherit'].concat(options ? options.ignore : []);

  cssRoot.walkDecls('transition-property', (decl) => {
    const value = decl.value;

    valueParser(value).walk((node) => {
      if (node.type === 'word' && allowedValue.indexOf(node.value) < 0) {
        const index = declarationValueIndex(decl) + node.sourceIndex;
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: decl,
          message: messages.default(node.value),
          index: index,
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
        nodes.push({index: node.sourceIndex, value: node.value});
      return false;
    })

    const props = nodes.filter(({ value }) => {
      if (/[\+-]?[\w\.]*m?s/gim.test(value)) return false;
      if (/^\$/gim.test(value)) return false;
      if (TIMING_FUNCTION_KEYWORDS.indexOf(value) >=0 ) return false;
      return true;
    })

    for (const prop of props) {
      const index = declarationValueIndex(decl) + prop.index;
      if (allowedValue.indexOf(prop.value) < 0) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: decl,
          message: messages.default(prop.value),
          index: index,
        })
        return;
      }
    }
    return;
  })
})

module.exports.ruleName = ruleName
module.exports.messages = messages
