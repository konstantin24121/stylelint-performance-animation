const testRule = require('stylelint-test-rule-tape');
const fn = require('../')

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,

  accept: [
    {
      code: 'div { transition-property: opacity; }'
    },
  ],
  reject: [
    {
      code: 'div { transition-property: width; }',
      message: fn.messages.default()
    },
  ]
})
