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

  // フォーマットをチェックする  
  var errorMessage = formatCheck(e);
  
  // 結果に応じて、通知内容を変える
  if(errorMessage == 'OK') {
    // OKの場合
    mailMessage = '提出されたcsvファイルを受け付けました フォーマットエラーはありませんでした. (有用性指標値は計算していません。お手元でご確認ください。\n' +  
    'We have received the submitted file without any problem in data-format. (This script does not check the Utility criteria.)';

    // 回答のオブジェクトを取得
    var itemResponses = e.response.getItemResponses();
    
    // ファイル名を設定する
    baseName = "pre_samplingdata";
    
    fileName = baseName + '_' + teamId + '_' + dateToStr24HPad0(new Date(), 'YYYYMMDDhhmmss');
    fileName = fileName + '.csv';
    
    // ファイルを受け付けて、名前を変えて保存する
    itemResponse = itemResponses[0];
    csvFile = DriveApp.getFileById(itemResponse.getResponse());
    csvFile.setName(fileName);
    console.log('receive file');
    
  } else {
    mailMessage = '提出されたcsvファイルが正しくありません。The submitted file is not correct. \n' + 
      'Error Message follows: \n' + errorMessage;
 
    // ファイルを受け付けずに削除する
    var itemResponses = e.response.getItemResponses();
    itemResponse = itemResponses[0];
    csvFile = DriveApp.getFileById(itemResponse.getResponse());
    csvFile.setTrashed(true);
    console.log('remove file');
  }
  
  // デバック用 結果を通知する
  console.log(mailMessage);
  console.log(teamId[0]);
  // とりあえず、 teamIdの値が配列になってたので、[0]を指定しておきました。
  sendMessage(teamId[0], mailMessage);
}

function sendMessage(teamId, mailMessage){
  // teamIdに対応する宛先にメールで結果を通知する
  // return: なし
  
  // 対応表を作る
  var TeamIdAccountList = {
    '01' : 'adad0405+pwscup2020@gmail.com',
    // ほかのチームは省略 // 
    '24' : 'adad0405+pwscup2020dummy2@gmail.com',
    '25' : 'adad0405+pwscup2020dummy3@gmail.com',
    '26' : 'adad0405+pwscup2020dummy4@gmail.com',
    '27' : 'adad0405+pwscup2020dummy5@gmail.com'
  }
  
  // メールを送る
  var address = TeamIdAccountList[teamId]; // メールアドレス
  var subject = '[PWSCUP2020] データ提出結果'; // タイトル
  var message = mailMessage; // メッセージ
  //MailAppだと、pwscup.org外に送ろうとしても送れない。ので、GmailAppの方を使うように変更した。
  //MailApp.sendEmail(address, subject, message);
  GmailApp.sendEmail(address, subject, message);
}


function formatCheck(e){
  // 提出されたデータの中身が仕様通りかチェックするsyori
  // return : ErrorMessage
  
  var ErrorMessage;
  
  // 各列の値域を定める
  var col_values = [];
  
  const col0_values = ['17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90'];
  const col1_values = ['Federal-gov', 'Local-gov', 'Never-worked', 'Private', 'Self-emp-inc', 'Self-emp-not-inc', 'State-gov', 'Without-pay'];
  const col2_values = ['10th', '11th', '12th', '1st-4th', '5th-6th', '7th-8th', '9th', 'Assoc-acdm', 'Assoc-voc', 'Bachelors', 'Doctorate', 'HS-grad', 'Masters', 'Preschool', 'Prof-school', 'Some-college'];
  const col3_values = ['Divorced', 'Married-AF-spouse', 'Married-civ-spouse', 'Married-spouse-absent', 'Never-married', 'Separated', 'Widowed'];
  const col4_values = ['Adm-clerical', 'Armed-Forces', 'Craft-repair', 'Exec-managerial', 'Farming-fishing', 'Handlers-cleaners', 'Machine-op-inspct', 'Other-service', 'Priv-house-serv', 'Prof-specialty', 'Protective-serv', 'Sales', 'Tech-support', 'Transport-moving'];
  const col5_values = ['Husband', 'Not-in-family', 'Other-relative', 'Own-child', 'Unmarried', 'Wife'];
  const col6_values = ['Female', 'Male'];
  const col7_values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
  const col8_values = ['<=50K', '>50K'];

  col_values.push(col0_values);
  col_values.push(col1_values);
  col_values.push(col2_values);
  col_values.push(col3_values);
  col_values.push(col4_values);
  col_values.push(col5_values);
  col_values.push(col6_values);
  col_values.push(col7_values);
  col_values.push(col8_values);

  // ファイルを取得してcsvとしてパース
  var itemResponses = e.response.getItemResponses();
  itemResponse = itemResponses[0];
  csvFile = DriveApp.getFileById(itemResponse.getResponse());
  var csv = csvFile.getBlob().getDataAsString("Shift_JIS");
  var rows = Utilities.parseCsv(csv);
  
  // 行ごとに処理する
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    
    // 行数の上限
    if(i > 100000) {
      ErrorMessage = 'Row number exceeds the limit (100,000)';
      return ErrorMessage;
    }
   
    // 列数が9でない場合はエラー
    if(row.length != 9){
      ErrorMessage = 'row: '  + (i+1) + ' is NG (column size is not correct)';
      return ErrorMessage;
    } 
    
    // 各行で値が値域に含まれていなかったらエラー
    for(var j = 0; j < row.length; j++){
      var col = row[j];
      
      // console.log(col);
      // console.log(col_values[j].indexOf(col));
      // console.log(col_values[j].indexOf(col) == -1);
      
      if(col_values[j].indexOf(col) == -1){
        ErrorMessage = 'col: ' + (j+1) + ' row: ' + (i+1) + ' is NG (the domain does not include the value)';
        return ErrorMessage;
      }
    }  
  }
  
  ErrorMessage = 'OK';
  
  return ErrorMessage;
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
