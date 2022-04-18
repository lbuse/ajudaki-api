module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    mocha: false
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  extends: [
    'standard'
  ],
  // add your custom rules here
  rules: {
    singleQuote: true,
  }
}
