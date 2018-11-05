var menx1 = "";
function upDate(previewPic){
	menx1 = document.getElementById("image").innerHTML;
	document.getElementById("image").style.backgroundImage = "url('"+previewPic.src+"')";
	document.getElementById("image").innerHTML = previewPic.alt;  
  
	}

function unDo(){
	document.getElementById("image").innerHTML = menx1;
	document.getElementById("image").style.backgroundImage = "url('')";
}