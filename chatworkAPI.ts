const chatwork_API = process.env.chatworkAPI__CW_API;
const chatwork_URL = "https://api.chatwork.com/v2/my/status";

// Chatworkで任意のグループチャットへ特定のメッセージを送信する関数。時刻設定を併用すればグループチャットへのbotが作れる
function unReadtypeSendMessage(roomId: string, messageBody: string){
  // const roomID: string = "";
  // const messagebody: string = "";
  const url = `https://api.chatwork.com/v2/rooms/${roomID}/messages`;
  
  if(!chatwork_API) return new Error("チャットワークAPIキーが見つかりませんでした。")
  
  // URLfetchするためのOptions設定
  const header = {
    "X-ChatWorkToken": chatwork_API,
    "Content-Type": "application/x-www-form-urlencoded"
  };

  const param: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers: header,
    method: "post",
    payload: `body=${encodeURIComponent(messageBody)}&self_unread=1`
  }
  
  UrlFetchApp.fetch(url,param);
}



//情報発信ブートキャンプの参加メンバーが知りたい

function MEMBERS(){
//  情報発信ブートキャンプのルームIDを取得する:174650003ルームIDがわかった。
    var url = "https://api.chatwork.com/v2/rooms";
    var myinfomation = UrlFetchApp.fetch(url,param);
    var j_myinfo = JSON.parse(myinfomation);
  
  //    ここでルームIDと対応するルーム名を取得する
  //      for(var i=0; i<=10; i++){
  //        var roomID = j_myinfo[i].room_id;
  //        var roomNAME = j_myinfo[i].name;
  //      console.log([i+1] + "つめのルームIDは【" + roomID + "】でルーム名『" + roomNAME + "』です");
  //      }
      //情報発信ブートキャンプのルームIDは『174650003』
    var room_ID = "/" + j_myinfo[6].room_id + "/members";
//    console.log(room_ID);
  
  var mem_url = url + room_ID;
//  console.log(mem_url);
  
  var res = UrlFetchApp.fetch(mem_url,param);
  var infoMembers = JSON.parse(res);
//console.log(infoMembers.length);

for(var i=0; i<=infoMembers.length; i++){
  var member_ID = infoMembers.name;
//  var member_name = member_ID[i];
  console.log(member_ID);
  }
//var member_ID = infoMembers.map(obj => obj["account_id"]);
//var member_NAME =infoMembers.map(obj => obj.name);
//console.log(member_ID + member_NAME);

//infoMembers.forEach(function (name){
//  console.log(infoMembers);
//});
}







function sendtest(){
  var room_id = "181817811";
  var msgBody = "Hellochatwork";
  var body = msgBody + "&self_unread=0";
  var cw_url = "https://api.chatwork.com/v2/rooms/" + room_id + "/messages" + body;
  var res = UrlFetchApp.fetch(cw_url,{
  headers: header,
  method: "post",
//  payload: msgBody,
  muteHttpExceptions: true
  });
  console.log(res);
}


//自分の情報を取得するスクリプト
function myP_data(){
  var cw_url = "https://api.chatwork.com/v2/me";
  var p_data = UrlFetchApp.fetch(cw_url,param);
  var j_p_data = JSON.parse(p_data);
    console.log(j_p_data.chatwork_id);
    console.log(j_p_data["organization_id"]);
    console.log(j_p_data);
}
//ここまで自分の情報を取得するスクリプト


//自分の現状ステータスを取得する→OK
function myFunction() {
 var cw_url ="https://api.chatwork.com/v2/my/status";
// console.log(cw_url);
    const myTasks = UrlFetchApp.fetch(cw_url,{
    headers : header,
    method: "GET"
    });
    const taskData = JSON.parse(myTasks);
    console.log(taskData["mytask_num"]);
    console.log(taskData.mytask_num);
}
/*ここまで自分の現状ステータスを取得する関数*/

//自分のタスクを取得する
function MYTASK(){
  const url_base = "https://api.chatwork.com/v2/my/tasks?";
    //assigned_by_account_id=78& /*タスクを依頼した人を特定したい場合にはこれを入力してfetchにかける*/
  const url_assigned = "assigned_by_account_id=" + '**********' +"&"; //アスタリスク部分『**********』を変更する
  const url_status = "status=done";

  var url = url_base + url_status;
//  console.log(url);

    const myT = UrlFetchApp.fetch(url,param);
    const tasukude_ta = JSON.parse(myT);
    for(var i=0; i<=10; i++){
        console.log(tasukude_ta[i].limit_time);
      };
}
//ここまで自分のタスクを取得する


//自分のルーム情報を取得する【自分のチャット一覧の取得】
function myInfo(){
  //console.log(header);
  var url = "https://api.chatwork.com/v2/rooms";
  var myinfomation = UrlFetchApp.fetch(url,param);
//    console.log(myinfomation);

  var j_myinfo = JSON.parse(myinfomation);

//    ここでルームIDと対応するルーム名を取得する
    for(var i=0; i<=10; i++){
      var roomID = j_myinfo[i].room_id;
      var roomNAME = j_myinfo[i].name;
    console.log([i+1] + "つめのルームIDは【" + roomID + "】でルーム名『" + roomNAME + "』です");
//    console.log(j_myinfo[i]);
    }
//    console.log(j_myinfo);
  //キーをダブルクォーテーションで指定すればOK
}
//ここまで自分のルーム情報を取得する【自分のチャット一覧の取得】


//チャット情報を取得するスクリプト
function chatInfo(){
  var base_url = "https://api.chatwork.com/v2/rooms/";
  var room_id = "181817811";
  var cw_url = base_url + room_id;
  
//  console.log(cw_url);

  var res = UrlFetchApp.fetch(cw_url,param);
  var j_chatinfo = JSON.parse(res);

//最終アップデート時刻を取得する部分
  var dateTime = j_chatinfo.last_update_time;
//得られた時刻がUnix timeなので、日本時間に変換
  var unixTime = new Date(dateTime*1000);
//  console.log(unixTime);

//年・月・日に変換
  var Year = unixTime.getFullYear() + "年";
  var Month = unixTime.getMonth() + "月";
  var Day = unixTime.getDate() + "日";
  var japTime = Year + Month + Day;
  console.log(japTime);
}
//ここまでチャット情報を取得するスクリプト