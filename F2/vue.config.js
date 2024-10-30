module.exports = {
 
  transpileDependencies: [
    'vuetify'
  ],
  // Other webpack configuration options...
  chainWebpack: config => {
    config.module
      .rule('chartjs')
      .test(/\.js$/)
      .include.add(/chart\.js$/)
      .end()
      .use('esbuild-loader')
      .loader('esbuild-loader')
      .options({
        target: 'es2015' // Transpile to ES2015
      });
  }
}
