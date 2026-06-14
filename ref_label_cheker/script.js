document.getElementById('exe').addEventListener('click', () => {
	const fout = document.getElementById('file');
	const text = document.getElementById('text').value;
	const resultArea = document.getElementById('labelResult');

	if(fout.files.length > 0){
		const file = fout.files[0];
		const reader = new FileReader();
		reader.onload = function(e){
			check(e.target.result);
		}
		reader.readAsText(file);
	} else if(text.trim() !== ""){
		check(text);
	} else {
		alertText();
	}

	function check(inputText){
		const lines = inputText.split(/\r?\n/);
		const items = [];
		const labelNames = new Set();
		const refNames = new Set();

		lines.forEach((line, index) => {
			const lineNum = index + 1;
			let match;

			const labelRegex = /\\label\{([^}]+)\}/g;
			while ((match = labelRegex.exec(line)) !== null) {
				items.push({ type: 'label', name: match[1], lineNum: lineNum });
				labelNames.add(match[1]);
			}

			const refRegex = /\\ref\{([^}]+)\}/g;
			while ((match = refRegex.exec(line)) !== null) {
				items.push({ type: 'ref', name: match[1], lineNum: lineNum });
				refNames.add(match[1]);
			}
		});

		if (items.length === 0) {
			resultArea.innerHTML = "<span style='color: #666;'>テキスト内に \\label や \\ref は見つかりませんでした。</span>";
			resultArea.style.display = "block";
			return;
		}

		items.sort((a, b) => a.lineNum - b.lineNum);

		const showNormal = document.getElementById('showNormal').checked;
		const showUnused = document.getElementById('showUnused').checked;
		const showUndefined = document.getElementById('showUndefined').checked;

		const filteredItems = items.filter(item => {
			if (item.type === 'label') {
				if (!refNames.has(item.name)) return showUnused; // 未参照
				return showNormal; // 正常
			} else if (item.type === 'ref') {
				if (!labelNames.has(item.name)) return showUndefined; // 未定義
				return showNormal; // 正常
			}
			return false;
		});


		if (filteredItems.length === 0) {
			resultArea.innerHTML = "<span style='color: #666;'>チェックボックスの条件に一致する項目はありません。</span>";
			resultArea.style.display = "block";
			return;
		}


		let html = `
			<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95em;">
				<thead>
					<tr style="border-bottom: 2px solid #ddd; background-color: #f1f1f1;">
						<th style="padding: 10px;">行番号</th>
						<th style="padding: 10px;">コマンド</th>
						<th style="padding: 10px;">中身 (key)</th>
						<th style="padding: 10px;">ステータス</th>
					</tr>
				</thead>
				<tbody>
		`;


		filteredItems.forEach(item => {
			let bgColor = "transparent";
			let textColor = "#333";
			let statusHTML = "<span style='color: #2ecc71;'>✅ 正常</span>";

			if (item.type === 'label') {
				if (!refNames.has(item.name)) {
					bgColor = "#fff3cd"; 
					textColor = "#856404";
					statusHTML = "<span style='color: #e67e22; font-weight: bold;'>⚠️ 未参照</span>";
				}
			} else if (item.type === 'ref') {
				if (!labelNames.has(item.name)) {
					bgColor = "#f8d7da"; 
					textColor = "#721c24";
					statusHTML = "<span style='color: #e74c3c; font-weight: bold;'>❌ 未定義</span>";
				}
			}

			html += `
				<tr style="background-color: ${bgColor}; color: ${textColor}; border-bottom: 1px solid #eee;">
					<td style="padding: 8px;">${item.lineNum} 行目</td>
					<td style="padding: 8px; font-weight: bold; color: #2980b9;">\\${item.type}</td>
					<td style="padding: 8px; font-family: monospace; font-size: 1.1em;">${item.name}</td>
					<td style="padding: 8px;">${statusHTML}</td>
				</tr>
			`;
		});

		html += "</tbody></table>";
		resultArea.innerHTML = html;
		resultArea.style.display = "block";
	}
});

function alertText(){
	const toast = document.getElementById('toast');
	toast.classList.add('show');
	setTimeout(() => {
		toast.classList.remove('show');
	}, 3000);
}
