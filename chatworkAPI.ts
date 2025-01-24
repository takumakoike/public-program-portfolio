const chatwork_API = process.env.chatworkAPI__CW_API;
const chatwork_URL = "https://api.chatwork.com/v2/";

//自分の情報を取得するスクリプト
function getMyChatWorkAccoutData(): {account_id: string, chatwork_id: string, name: string, mail: string} | Error{
  const url = `${chatwork_URL}/me`;
  if(!chatwork_API) return new Error("チャットワークAPIキーが見つかりませんでした。")
  const getOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers:  {
      "X-ChatWorkToken": chatwork_API,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "get"
  }
  const fetchData: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url,getOptions);
  const jsonData = JSON.parse(fetchData.getContentText());

  return {
    account_id: jsonData.account_id,
    chatwork_id: jsonData.chatwork_id,
    name: jsonData.name,
    mail: jsonData.mail
  }
}

//自分のルーム情報を取得する【自分のチャット一覧の取得】
function getMyRoomInfo(): {roomId: string, roomName: string}[] | Error{
  const url = `${chatwork_URL}/rooms`;
  if(!chatwork_API) return new Error("チャットワークAPIキーが見つかりませんでした。")

  const getOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers:  {
      "X-ChatWorkToken": chatwork_API,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "get"
  }

  const fetchData: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url,getOptions);
  const jsonData = JSON.parse(fetchData.getContentText());

  const roomInfo: {roomId: string, roomName: string}[] = [];
  for (const room of jsonData){
    roomInfo.push({roomId: room.room_id, roomName: room.name});
  }

  return roomInfo
}



// Chatworkで任意のグループチャットへ特定のメッセージを送信する関数。時刻設定を併用すればグループチャットへのbotが作れる
function unReadtypeSendMessage(roomID: string, messageBody: string){
  // const roomID: string = "";
  // const messagebody: string = "";
  const url = `${chatwork_URL}/rooms/${roomID}/messages`;

  if(!chatwork_API) return new Error("チャットワークAPIキーが見つかりませんでした。")
  
  const postOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers:  {
      "X-ChatWorkToken": chatwork_API,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "post",
    payload: `body=${encodeURIComponent(messageBody)}&self_unread=1`
  }
  
  UrlFetchApp.fetch(url,postOptions);
}

// 現在参加しているグループチャットのリストを返す関数
function getMyGroupLists(){

    const groupLists ="";
    return groupLists;
}

// グループチャットに参加中のメンバーを取得
function getGroupMembers(){
    const url = "https://api.chatwork.com/v2/rooms";
    const myinfomation = UrlFetchApp.fetch(url,param);
    const j_myinfo = JSON.parse(myinfomation);
  
    const room_ID = "/" + j_myinfo[6].room_id + "/members";
  
    const mem_url = url + room_ID;
    
    const res = UrlFetchApp.fetch(mem_url,param);
    const infoMembers = JSON.parse(res);


    for(const i=0; i<=infoMembers.length; i++){
      const member_ID = infoMembers.name;
    //  const member_name = member_ID[i];
      console.log(member_ID);
      }
  //const member_ID = infoMembers.map(obj => obj["account_id"]);
  //const member_NAME =infoMembers.map(obj => obj.name);
  //console.log(member_ID + member_NAME);

  //infoMembers.forEach(function (name){
  //  console.log(infoMembers);
  //});
}




//自分の現状ステータスを取得する→OK
function myFunction() {
 const cw_url ="https://api.chatwork.com/v2/my/status";
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

  const url = url_base + url_status;
//  console.log(url);

    const myT = UrlFetchApp.fetch(url,param);
    const tasukude_ta = JSON.parse(myT);
    for(const i=0; i<=10; i++){
        console.log(tasukude_ta[i].limit_time);
      };
}
//ここまで自分のタスクを取得する


//チャット情報を取得するスクリプト
function chatInfo(){
  const base_url = "https://api.chatwork.com/v2/rooms/";
  const room_id = "181817811";
  const cw_url = base_url + room_id;
  
//  console.log(cw_url);

  const res = UrlFetchApp.fetch(cw_url,param);
  const j_chatinfo = JSON.parse(res);

//最終アップデート時刻を取得する部分
  const dateTime = j_chatinfo.last_update_time;
//得られた時刻がUnix timeなので、日本時間に変換
  const unixTime = new Date(dateTime*1000);
//  console.log(unixTime);

//年・月・日に変換
  const Year = unixTime.getFullYear() + "年";
  const Month = unixTime.getMonth() + "月";
  const Day = unixTime.getDate() + "日";
  const japTime = Year + Month + Day;
  console.log(japTime);
}
//ここまでチャット情報を取得するスクリプト