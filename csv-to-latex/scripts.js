// CSVからLaTeXへの変換ロジック
function convertCSVtoLaTeX(csvString) {
    const lines = csvString.trim().split(/\r?\n/);
    if (lines.length === 0 || lines[0] === "") return "データがありません。";

    let maxColumns = 0;
    let bodyRows = [];

    // 1. 各行を読み込んで、セルの結合と最大列数の計算を行う
    lines.forEach(line => {
        const cells = line.split(',');
        if (cells.length > maxColumns) {
            maxColumns = cells.length;
        }
        // ループの中は改行（\\）のみ出力する
        bodyRows.push(cells.join(' & ') + ' \\\\');
    });

    // 2. LaTeXの表（Tabular）の組み立て
    // maxColumnsの数だけ「c」（中央揃え）を作り、「|」で繋ぐ
    const columnFormat = Array(maxColumns).fill('c').join('|');
    
    // 表の開始
    let latex = `\\begin{tabular}{|${columnFormat}|}\n`;
    
    // 一番上の横線
    latex += `\\hline\n`; 
    
    // 表の中身（各行）
    latex += bodyRows.join('\n') + `\n`; 
    
    // 一番下の横線と、表の終了
    latex += `\\hline\n`; 
    latex += `\\end{tabular}`;

    return latex;
}

// 変換ボタンを押したときの処理
document.getElementById('convertBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('csvFile');
    const textArea = document.getElementById('csvText');
    const output = document.getElementById('output');

    // 1. ファイルが選択されている場合
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            output.textContent = convertCSVtoLaTeX(e.target.result);
        };
        reader.readAsText(file);
    } 
    // 2. テキストエリアに入力がある場合
    else if (textArea.value.trim() !== "") {
        output.textContent = convertCSVtoLaTeX(textArea.value);
    } 
    // 3. どちらも空っぽの場合
    else {
        alert("CSVファイルを指定するか、テキストを入力してください。");
    }
});

// コピーボタンを押したときの処理
document.getElementById('copyBtn').addEventListener('click', () => {
    const outputText = document.getElementById('output').textContent;
    if (!outputText) return;

    navigator.clipboard.writeText(outputText).then(() => {
        alert("クリップボードにコピーしました！");
    });
});
