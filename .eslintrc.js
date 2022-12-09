module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    parser: '@babel/eslint-parser',
  },
};
