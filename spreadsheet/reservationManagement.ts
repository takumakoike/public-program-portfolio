function protectLastMonthSheet(address: string){ // 前月分のシートを保護するプログラム
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