// 前月分のシートを保護するプログラム
function protectLastMonthSheet(address: string){ 
    // 引数addressは環境ファイルもしくはGASのプロパティに保存して扱う
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 前月分のシートを配列に格納する
    const date = new Date();
    let year: number = parseInt(date.getFullYear().toString().slice(2));
    const mm = date.getMonth(); //mmが『前月』を指す
    if(mm === 11) { year -= 1}
    const dateInfo = `${year}年${mm}月`;
    const lastMonthSheets: string[] = ss.getSheets().map( (sheet) => sheet.getName()).filter((sheet) => sheet.indexOf(dateInfo) !== -1)

    for (const sheet of lastMonthSheets){
        const targetSheet = ss.getSheetByName(sheet);
        if(!targetSheet) continue
        try{
            const protection = targetSheet.protect(); //名前に応じてシートを取得して、保護機能をつける
            const user = protection.getEditors(); //シートの編集権限を持つユーザーリストを取得する
            protection.removeEditors(user); //オーナー以外の編集権限を除去する
            protection.addEditor(address);

        }catch(err){
            const error = err as Error;
            console.log(error.message);
            console.log(`${sheet}はすでに保護機能が付けられています`);
        }
    }
}

// 任意のファイルを同じディレクトリ内にコピーするプログラム
function fileCopy(){
    const basefileId = process.env.reservationManagement__BASEFILE_ID;
    const basefileSheetName = "";   //ディレクトリに格納されいているファイルの名前やリンク、IDが記載されたシートがあることを想定
    if(!basefileId) return Error(`スプレッドシートID：${basefileId? basefileId: null}が見つかりませんでした`);

    const baseFile = SpreadsheetApp.openById(basefileId);
    const linkSheet = baseFile.getSheetByName(basefileSheetName);
    if(!linkSheet) return Error(`${linkSheet}というシートが見つかりませんでした`);

    // 予約管理をするファイル名とファイルID
    const reserveFileId = linkSheet.getRange("g2").getValue();
    const reserveFile = DriveApp.getFileById(reserveFileId);    //🔥ファイルコピー時に使用
    console.log(`予約管理ファイルID：${reserveFileId}`);
    console.log(`予約管理ファイル名：${reserveFile}`);
    
    // 予約管理をするフォルダのIDを取得する
    const reserveBaseFolderId = linkSheet.getRange("D3").getValue();
    const reserveBaseFolder = DriveApp.getFolderById(reserveBaseFolderId); //🔥ファイルコピー時に使用

    // コピーしたファイルの名前を変更する
    const d = new Date();
    const year = d.getFullYear();
    const next_month = d.getMonth() + 2;
    const copiedFileName = `予約管理_${year}年${next_month}月`; //🔥ファイルコピー時に使用

    reserveFile.makeCopy(copiedFileName, reserveBaseFolder);  
}