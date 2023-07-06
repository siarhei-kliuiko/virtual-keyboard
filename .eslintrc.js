module.exports = {
  extends: [
    'eslint-config-airbnb-base',
  ],

  env: {
    browser: true,
  },

  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
    ],
  },
};
