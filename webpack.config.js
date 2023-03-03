module.exports = {
  entry: {
    lambda: './src/lambda.js',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
    libraryTarget: 'umd',
    clean: true,
  },
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false,
    usedExports: true,
    sideEffects: true,
  },
};