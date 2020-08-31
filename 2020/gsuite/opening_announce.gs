function sendOpeningEmailToEveryTeam() {
  // 初期ログイン情報アナウンス用スクリプト
  // google spreadsheetに、チーム毎の値を書いておく 今回は (teamName, userEmail, teamAccount, teamPassword)
  // spreadsheetのidを↓に書けば、チームごとにパラメータを変えたメールが送信できる
  // 本番用
  // var fileShareRange = SpreadsheetApp.openById('1NUFZEqDtVYBu2lPRrpNulA7aUVES_LFIKgzForVWISw').getActiveSheet().getDataRange();
  // テスト用 
  var fileShareRange = SpreadsheetApp.openById('1BDPOX8Ka54dvS6RNJH1UsSueEFCFG9Js5yVmKSZLkQE').getActiveSheet().getDataRange();

  //ファイル設定のデータを配列で取得
  var arr = fileShareRange.getValues();

  //配列の行数・列数を取得
  var row = fileShareRange.getLastRow();
  var column = fileShareRange.getLastColumn();

  // 行ごとに処理する
  for (var i = 1; i < row; i++){
    var teamName = arr[i][0];
    var userEmail = arr[i][1];
    var teamAccount = arr[i][2];
    var teamPassword = arr[i][3];
    
    
    var message = 'Dear Team ' + teamName + '\n\n' + 
      'Thank you for your registration for PWS Cup 2020 (AMIC). \n\n' + 
      'Let me announce your GSuite Account for contest.\n\n' +   
      'Account : ' + teamAccount + '\n' + 
      'Password: ' + teamPassword + '\n\n' + 
      'There are 7 steps to check the anonymized data submission flow as described below. \n\n' +  
      '----------------------------\n\n' + 
      '1: login to Google Drive "https://drive.google.com" using your GSuite account. (you can change the password)\n' + 
      '2: check the the shared folder "https://drive.google.com/drive/shared-with-me", you can find folder: "pre_anonymize_teamXX (XX: your team id)" \n' + 
      '3: check the file "pre_anonymize_teamXX/pre_samplingdata_XX.csv". This is the samplingdata of your team. \n\n' + 
      '4: access the submission form "https://forms.gle/4KjdoHbum6Jo6Xqf9". \n\n' + 
      '5: Make a test submission by using your GSuite accout and sampling-data: "pre_samplingdata_XX.csv". \n\n' + 
      '6: check an email from committee : we send the result of format-check to your email address (same as "To: " address of this mail) \n\n' +
      '7: check the shared folder at google drive: public. Sample scripts are included. \n\n' +   
      '----------------------------\n\n' +
      'The preliminary-anonymization phase ends at 2020/09/07(Mon) 23:59:59 JST \n\n' + 
      'Please let me know if you need any further information. \n' + 
      'Mail: pwscup2020-info@iwsec.org \n\n' + 
      '[Rule] \n' + 
      'Please check the contest Website: https://www.iwsec.org/pws/2020/cup20.html \n' + 
      'Contest rule briefing seminar video(in JP): https://www.youtube.com/watch?v=trbfq4tIc6A \n\n' + 
      'Thanks.'

   
    console.log(message);
    // メール送信
    var subject = '[PWSCUP2020] Your team accout'; // タイトル
    GmailApp.sendEmail(userEmail, subject, message);
  }
}
