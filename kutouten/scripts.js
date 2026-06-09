const trans = document.getElementById('exe')

trans.addEventListener('click',()=>{
	aler(text.value);
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
	
		document.getElementById('output').value = out;
	
}