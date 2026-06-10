function exe(){

	var out = document.getElementById('text').value;
	var fout = document.getElementById('file');
	if(fout.files.length > 0){
		const file = fout.files[0];
		var reader = new FileReader();
		let out = "";

		reader.onload = function(e){
			let fileout = e.target.result;
			fix(fileout);
		}
		reader.readAsText(file);
	}
	else if(out.trim() != ""){
		fix(out);
	}
	
	
	function fix(out){
		const tenCheck = document.getElementById('kutouten').checked;
		if(tenCheck){
			out = out.replace(/、/g,'，');
			out = out.replace(/。/g,'．');
		}
	
		const spaceCheck = document.getElementById('space').checked;
		if(spaceCheck){
			out = out.replace(/　/g,' ');
	}
	
		const zenkaku = document.getElementById('zenkaku').checked;
		if(zenkaku){
			out = out.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(c){
				var charCode = c.codePointAt(0);
				charCode -= 65248;
				const hankaku = String.fromCodePoint(charCode);
				return hankaku;
		});
	}
	
			document.getElementById('output').value = out;
	}
}


document.getElementById('copy').addEventListener('click', ()=>{
	const copyText = document.getElementById('output').value;
	if(copyText == ""){
		return;
	}
	navigator.clipboard.writeText(copyText);
	const toast = document.getElementById('toast');
	toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
});
