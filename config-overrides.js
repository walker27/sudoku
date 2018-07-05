const tsImportPluginFactory = require('ts-import-plugin');
const { getLoader, injectBablePlugin } = require('react-app-rewired');
const autoprefixer = require('autoprefixer');
const rewireLess = require('react-app-rewire-less');
const webpack = require('webpack');
// const MonacoWebpackPlugin = require('monaco-editor/webpack');


const rewireCssModules = require('./tool/react-app-rewire-css-modules');

module.exports = function override(config, env) {
  // 按需加载
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );
  
  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [tsImportPluginFactory({
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style: 'css'
        style: true,
      })]
    })
  }

  // 自定义antd
  config = rewireLess.withLoaderOptions({
    modifyVars: { "@primary-color": '#3996CD' },
  })(config, env);

  // css modules 需要给模块化的css命名为*.module.css
  config = rewireCssModules(config, env);
  config.plugins = config.plugins.concat([
    // Ignore require() calls in vs/language/typescript/lib/typescriptServices.js
    new webpack.IgnorePlugin(
      /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
      /vs\/language\/typescript\/lib/
    ),
    // new webpack.ProvidePlugin({
    //   monaco: 'monaco-editor',
    // }),
    // new MonacoWebpackPlugin(webpack),
  ]);
  // console.log(config.plugins);
  // return null;
  return config;
}