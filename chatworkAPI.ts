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

// 自分の未完了タスク数とタスク詳細を取得する
function myTaskInformation(): {openTaskCount: number, taskDetail: {roomName: string, taskDetail: string}[]} | Error {
  const statusUrl =`${chatwork_URL}/my/status`;
  if(!chatwork_API) return new Error("チャットワークAPIキーが見つかりませんでした。")

  const getOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers:  {
      "X-ChatWorkToken": chatwork_API,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "get"
  }
  
  // 未完了タスク情報の取得
  const statusFetchData: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(statusUrl,getOptions);
  const taskStatusData = JSON.parse(statusFetchData.getContentText());
  const taskCount: number = taskStatusData.mytask_num;

  // タスクの詳細取得
  const taskDetailUrl = `${chatwork_URL}/my/tasks?status=open`
  const taskFetchData: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(taskDetailUrl, getOptions)
  const jsonTasks = JSON.parse(taskFetchData.getContentText());

  const myTasks: {roomName: string, taskDetail: string}[] = [];
  for (const item of jsonTasks){
    const taskRoomName = item.room.name;
    const taskBody = item.body;
    myTasks.push({roomName: taskRoomName, taskDetail: taskBody});

  }
  return {
    openTaskCount: taskCount,
    taskDetail : myTasks
  }
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