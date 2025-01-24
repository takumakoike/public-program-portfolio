// Clasp利用してスプレッドシートで活用することを想定
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
function getGroupMembers(): {chatworkId: string, name: string}[] | Error{
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

    const members_url = `${url}/${jsonData[6].room_id}/members`
    
    const res = UrlFetchApp.fetch(members_url,getOptions);
    const infoMembers = JSON.parse(res.getContentText());

    const members: {chatworkId: string, name: string}[] = [];
    for( const item of infoMembers){
      members.push({chatworkId: item.chatwork_id, name: item.name });
    }

    return members;
}