function makeFilesSetShare() {
  // データ配布用ディレクトリの作成用スクリプト

  // 指定したディレクトリの配下に、各チーム+運営しか見られないディレクトリを作成する
  // spread sheetに、フォルダ名と、teamAccountを書いておく
  // フォルダを作成して、teamAccountに閲覧権限を付与する

  // 権限設定を書いたspreadsheetの指定
  var fileShareRange = SpreadsheetApp.openById('1sux5ADKRkjcRgqIsJuFzgvByP1YwScmJ2ZSgTPAO3cQ').getActiveSheet().getDataRange();

  //ファイル設定のデータを配列で取得
  var arr = fileShareRange.getValues();

  //配列の行数・列数を取得
  var row = fileShareRange.getLastRow();
  var column = fileShareRange.getLastColumn();

  // ディレクトリの指定
  var parentFolder = DriveApp.getFolderById('1xJ0gURPPJa29iBiq96FX8oUoba3Xwb41');


  for (var i = 1; i < row; i++){
    var folderName = arr[i][0];
    var removeEditors = parentFolder.getEditors();

    // var file = parentFolder.getFilesByName(folderName).next();
    var folder = parentFolder.createFolder(folderName)

    // スプレッドシートで指定したメンバー/グループに権限付与
    var k = 1;
    while (k < column) {
      if (arr[i][k] != '') {
        folder.addViewer(arr[i][k]+'@pwscup.org');
      }
      k++;
    }
  }
}
