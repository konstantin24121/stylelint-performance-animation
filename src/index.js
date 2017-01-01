import stylelint from 'stylelint'

export const ruleName = 'plugin/no-low-prformance-animation';
export const messages = stylelint.utils.ruleMessages(ruleName, {
  default: () => {
    return 'You should not use low performance animation properties.'
  }
})

module.exports = stylelint.createPlugin(ruleName, (options) => (cssRoot, result) => {
  cssRoot.walkDecls('transition-property', (decl) => {
    const allowedValue = ['opacity', 'transform'];
    const value = decl.value;
    if (allowedValue.indexOf(value) >= 0) return

    stylelint.utils.report({
      ruleName: ruleName,
      result: result,
      node: decl,
      message: messages.default()
    })
  })
})

module.exports.ruleName = ruleName
module.exports.messages = messages
