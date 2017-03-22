# stylelint-performance-animation

[![Build Status][ci-img]][ci]

Stylelint rule for preventing the use of low performance animation and transition.

## Install

```sh
npm install stylelint-performance-animation --save-dev
```

or


```sh
yarn add stylelint-performance-animation --save-dev
```

## Usage

Add this config to your `.stylelintrc`:

```json
{
  "plugins": [
    "stylelint-performance-animation"
  ],
  "rules": {
    "plugin/no-low-performance-animation": true
  }
}
```

## Details

```css
div { transition: margin 350ms easy }
/**               ^^^^^^
 * You should not use low performance animation properties */
```

```css
@keyframes { 50% { top: 5px; } }
/**                ^^^^^^
 * You should not use low performance animation properties */
```

For more information [read article](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) By Paul Lewis and Paul Irish

### Options

#### `true`

The following pattern is considered warning:

```css
div { transition: margin-left 350ms easy; }
```

The following pattern is *not* considered warning:

```css
div { transition: transform 350ms easy; }
```

### Optional secondary options

#### `ignore: [string]`

Given:

`{ ignore: ['color', 'background-color'] }`

The following pattern is considered warning:

```css
div { transition: color, margin; }
```

The following pattern is *not* considered warning:

```css
div { transition: color, opacity, background-color; }
```

---

## License

MIT © [Vinston Wolf](https://github.com/konstantin24121)

[ci]: https://travis-ci.org/konstantin24121/stylelint-performance-animation
[ci-img]: https://travis-ci.org/konstantin24121/stylelint-performance-animation.svg?branch=master
