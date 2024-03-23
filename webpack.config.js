const path = require('path');

module.exports = {
  entry: './js/index.js', // エントリーポイントのファイルパス
  output: {
    path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリのパス
    filename: 'main.js' // 出力ファイル名
  }
};
