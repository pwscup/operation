function AddTimestampToFileName(e) {
  // 提出されたファイルのチェックを行う
  // データの中身のチェックと、OKな場合のファイル名変更を行う
  // pre_samplingdata_{teamNumber}_YYYYMMDDhhmmss.csv
  
  var baseName;
  var teamId;
  var fileName;
  var csvFile;
  var mailMessage;
  
  // 回答者のアカウントからチーム番号を拾う
  var userEmail = e.response.getRespondentEmail();
  teamId = userEmail.match(/[0-9][0-9]/g);
  
  // ファイルを取得して、それぞれでformatをチェックする
  var itemResponses = e.response.getItemResponses();
  itemResponse = itemResponses[0];
  var fileIdList = itemResponse.getResponse();
  
  // formatCheckから出力されるメッセージを連結して、通知内容を組み立てる
  var message = '';
  for(var i = 0; i < fileIdList.length; i++){
    var fileId = fileIdList[i];
    var file = DriveApp.getFileById(fileId);
    var tmpMessage = formatCheck(file, teamId);
    
    message = message + tmpMessage + '\n';
  }
  
  // デバッグ用
  console.log(message);
  // メール送信
  sendMessage(teamId, message);

}


function formatCheck(file, teamId){
  // フォーマットをチェックして、メッセージを組み立てる
  // チェック結果がOKなら、timestampを付与してファイルを保存する
  // チェック結果がNGなら、そのまま削除する
  
  var fileName = file.getName();
  var errorMessage = '・ ' + fileName + '...' + '\n';
  var status = 'OK'
  var anonymizer;
  var attacker = teamId;
  var rowNum = 100;
  
  // ファイル名フォーマットのチェック
  var tmp_anonymizer = fileName.match(/inference_[0-9][0-9]_[0-9][0-9]/g);
  
  console.log(tmp_anonymizer);
  
  // ダメならNG
  if(tmp_anonymizer == null){
    status = 'NG';
    errorMessage = errorMessage + 'file name format is NG.' + '\n';
    anonymizer = "NG";
  } else {
    tmp_anonymizer = fileName.match(/[0-9][0-9]/g);
    anonymizer = tmp_anonymizer[0];
    attacker = tmp_anonymizer[1];
    
    // attackerが自分じゃない場合はNG
    if(attacker != teamId){
      status = 'NG';
      errorMessage = errorMessage + 'file name format is NG. (attacker team id != your team id)' + '\n';
    }
  }
  
  // 中身のチェック
  var csv = file.getBlob().getDataAsString("Shift_JIS");
  var rows = Utilities.parseCsv(csv);
  
  console.log(rows.length);
  
  // 行数チェック
  if(rows.length != rowNum){
      status = 'NG';
      errorMessage = errorMessage + 'file name format is NG (row num is not 100).' + '\n';
  } else {
    // 中身のチェック
    for(var i=0; i<rows.length; i++){
      var row = rows[i];
      
      // 列数は1
      if(row.length != 1){
        status = 'NG';
        errorMessage = errorMessage + 'file name format is NG (col num is 1).' + '\n';
      } else {
        var col = row[0];
        
        var val = col.match(/[0-9][0-9]*/g);
        if(val == null){
          status = 'NG';
          errorMessage = errorMessage + 'value in row ' + i + ' is NG. value is 1-100000' + '\n';          
        } else { 
          if(val < 1 || col > 100000){
            status = 'NG';
            errorMessage = errorMessage + 'value in row ' + i + ' is NG. value is 1-100000' + '\n';
          }
        }
      }      
    }
  }
    
  // OKならtimestampを付与して保存する
  if(status == 'OK'){
    errorMessage = errorMessage + 'OK. file is accepted. ' + '\n';
    var name = 'inference_' + anonymizer + '_' + attacker + '_' + dateToStr24HPad0(new Date(), 'YYYYMMDDhhmmss') + '.index';
    console.log(name);
    file.setName(name);
  } else { 
    // NGなら、fileを消す
    file.setTrashed(true);
    console.log(fileName + ' is removed');
  }
  
  return errorMessage;
}



function dateToStr24HPad0(date, format) {
  // 時刻フォーマットを行う関数
    
  if (!format) {
  // デフォルト値
    format = 'YYYY/MM/DD hh:mm:ss'
  }
    
  // フォーマット文字列内のキーワードを日付に置換する
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    
  return format;
}


function sendMessage(teamId, mailMessage){
  // teamIdに対応する宛先にメールで結果を通知する
  // return: なし
  
  // 対応表を作る
  var TeamIdAccountList = {
    '01' : 'hogehoge@gmail.com',
    '02' : 'hogehoge@gmail.com'
    // ID-メールアドレスの対応表を作成する
  }
  
  // メールを送る
  var address = TeamIdAccountList[teamId]; // メールアドレス
  var subject = '[PWSCUP2020] Prerilimary (attack) phase, format check result'; // タイトル
  var message = mailMessage; // メッセージ
  // MailAppだと、pwscup.org外に送ろうとしても送れない。ので、GmailAppの方を使うように変更した。
  //MailApp.sendEmail(address, subject, message);
  GmailApp.sendEmail(address, subject, message);
}



function dateToStr24HPad0(date, format) {
  // 時刻フォーマットを行う関数
    
  if (!format) {
  // デフォルト値
    format = 'YYYY/MM/DD hh:mm:ss'
  }
    
  // フォーマット文字列内のキーワードを日付に置換する
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    
  return format;
}
