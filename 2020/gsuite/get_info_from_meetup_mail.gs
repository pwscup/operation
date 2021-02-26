// メールから、氏名所属連絡先を抽出して、spreadsheetに書き込む
// spreadsheet -> スクリプトエディタ にこの関数を登録する
// 1行目はヘッダ　検索・抽出結果を、新規行に追加していく
// 時間トリガをセットして使う
function searchContactMail() {
 
  const query = 'PWS2021 Meetup 参加希望 is:unread';
  const start = 0;
  const max = 100;
 
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();

  const threads = GmailApp.search(query, start, max);
 
  if(threads.length > 0){
    for(thread of threads){
      thread.markRead();
    }
  }
  const messagesForThreads = GmailApp.getMessagesForThreads(threads);
 
  const values = [];
  id = lastRow;
  for(const messages of messagesForThreads){
    const message = messages[0];

    date = message.getDate();
    from_all = message.getFrom();
    text = message.getPlainBody().slice(0,200);
    text = text + '\r';
    
    try {
      from_address = (from_all.split('<'))[1];
      from_address = from_address.split('>')[0]
    } catch(e){
      from_address = '';
    }

    try{
      name = text.match(/氏名：.*?\r/g)[0];
      name = name.split('：')[1];
    } catch(e){
      name = '';
    }
    console.log(name)

    affiliation = ''; 
    try{
      affiliation = text.match(/所属：.*?\r/g)[0];
      affiliation = affiliation.split('：')[1];
    } catch(e){
      //
    }
    console.log('所属' + affiliation)

    console.log('本文' + text)

    try{ 
      to_address = text.match(/メールアドレス.*?\r/g)[0];
      to_address = to_address.split('：')[1];
    } catch(e) {
      to_address = '';
    }
    console.log('to メール: ' + to_address)

    const record = [
      id,
      date, 
      from_address,
      name,
      affiliation,
      to_address,
      text
    ];

    values.push(record);
    id += 1;
  }


 
  if(values.length > 0){
    sheet.getRange(lastRow+1, 1, values.length, values[0].length).setValues(values);
  }
 
}
