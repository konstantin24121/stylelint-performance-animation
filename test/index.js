const testRule = require('stylelint-test-rule-tape');
const fn = require('../')

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  config: [
    true
  ],
  accept: [
    {
      code: `div {
        font-size: 14px;
        width: 200px;
        transition-property: opacity;
      }`
    },
    {
      code: 'div { transition-property: transform; }'
    },
    {
      code: 'div { transition-property: transform, opacity; }'
    },
    {
      code: 'div { transition: opacity 0.3s steps(4, end); }'
    },
    {
      code: 'div { transition: 350ms step-start opacity; }'
    },
    {
      code: 'div { transition: opacity 350ms easy-in 100ms, transform 350ms linear 200ms; }'
    },
  ],
  reject: [
    {
      code: 'div { transition-property: width; }',
      message: fn.messages.default('width'),
      line: 1,
      column: 28,
    },
    {
      code: 'div { transition-property: transform, opacity, width; }',
      message: fn.messages.default('width')
    },
    {
      code: 'div { transition: padding 0.3s step-start; }',
      message: fn.messages.default('padding')
    },
    {
      code: 'div { transition: 350ms width, padding 150ms; }',
      message: fn.messages.default('width'),
      line: 1,
      column: 25,
    },
    {
      code: 'div { transition: opacity 350ms easy-in 100ms, transform 350ms linear 200ms, padding 200ms ease-out; }',
      message: fn.messages.default('padding')
    },
    {
      code: `
div {
  font-size: 14px;
  width: 200px;
  transition-property: margin;
}`,
      message: fn.messages.default('margin'),
      line: 5,
      column: 24,
    }
  ]
})

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  config: [
    true,
    {
      ignore: ['color', 'background-color']
    }
  ],
  accept: [
    {
      code: 'div { transition-property: transform, color; }'
    },
    {
      code: 'div { transition-property: color; }'
    },
    {
      code: 'div { transition-property: background-color, color; }'
    },
  ],
  reject: [
    {
      code: 'div { transition-property: transform, color, border; }',
      message: fn.messages.default('border'),
      line: 1,
      column: 46,
    },
  ],
})


