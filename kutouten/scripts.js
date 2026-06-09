const trans = document.getElementById('exe')

trans.addEventListener('click',()=>{
	alert(text.value);
});

function exe(){
	var out = document.getElementById('text').value;
	
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