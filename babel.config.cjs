module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // modules: false,
        targets: '> 1%, not dead'
      }
    ]
  ],
  plugins: [
    'babel-plugin-transform-import-meta',
    ['@babel/plugin-syntax-import-attributes', { deprecatedAssertSyntax: true }],
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: true
      }
    ]
  ]
};
