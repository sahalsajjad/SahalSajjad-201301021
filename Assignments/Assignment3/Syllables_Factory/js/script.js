$(document).ready(function(){

var xmlhttp = new XMLHttpRequest();
var jsonurl = "/Syllables_Factory/json/malayalam.txt";
window.dictionarysize = 15;
window.words = [];
window.syllables = [];
window.permitIndexes = [];
window.score = 0;
window.answered = true;
window.answerunlock = true;
window.dataloaded = false;
window.message = "";
window.level = 1;
window.turn = 0;
window.scoresheet = [0,0,0,0,0,0,0,0,0,0];
dataLoader();
function dataLoader(){
		window.dataloaded = true;
		xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			text = xmlhttp.responseText;
			var jsonobj = $.parseJSON(text);
			var count = jsonobj.count, wordlist = jsonobj.text; 
			for ( var i = 0; i < count; i++){
				words.push(wordlist[i][0]);
				syllables.push(wordlist[i][1]);
				}
    		}	
	}
	xmlhttp.open("GET", jsonurl, true);
	xmlhttp.send();
	for ( var i = 0; i < window.dictionarysize; i++ ){
		window.permitIndexes.push(i);
	}
	levelFiller();
}

window.fireWord = function(){
	if(window.dataloaded == false){
		dataLoader();
	}
	clearMessage();
	window.answerunlock = true;
	window.turn += 1;
    if(window.answered == false){
    	alert("Please select an Answer!");
    }
    else{
    	window.answered = false;
	    chosenword  = chooseWord();
	    document.getElementById('word-container').innerHTML= "<h1>"+chosenword[0]+ "</h1>";
	    return chosenword;
	}
}

window.Answer = function(clicked){/* Tested OK */
		window.answered = true;
		if(clicked == chosenword[1] && window.answerunlock ){
			window.message = "Great! You've earned a point";
			updateScore();
			window.answerunlock = false;
			displayMessage();
			window.scoresheet[window.turn-1] = 1;
		}
		else{
			window.message = "Sorry! Incorrect Answer!";
			displayMessage();
			window.answerunlock = false;
			window.scoresheet[window.turn-1] = 2;
		}
		scoreSheetFiller();
}
window.updateScore = function(){ /* Tested OK */
	window.score += 1;
	document.getElementById("score-display").innerHTML = window.score;

}
window.displayMessage = function(){ /* Tested OK */
	$("#message-box").css('visibility','visible');
	document.getElementById("message-box").innerHTML = "<center>"+window.message+"</center>";
}
window.clearMessage = function(){ /*Tested OK */
	window.message = "";
	$("#message-box").css('visibility','hidden');

}
function levelFiller(){ /* Tested OK */

	if(window.level == 1){
		$('#level-1').css('background','green');
	}
	else if(window.level == 2){
		$('#level-1').css('background','green');
		$('#level-2').css('background','green');
	}
	else if(window.level == 3){
		$('#level-1').css('background','green');
		$('#level-2').css('background','green');
		$('#level-3').css('background','green');
	}
}
function scoreSheetFiller(){
		
        for(i = 0; i < 10; i++){
        	var id = "#scoresheet-"+(i+1);
        	
        	if( window.scoresheet[i] == 0 ){

        		$(id).css('background','aliceblue');
        		$(id).css('color','aliceblue');
        	}
        	else if(window.scoresheet[i] == 1){
        		$(id).css('background','green'); 
        		$(id).css('color','green');       		
        	}
        	else if(window.scoresheet[i] == 2){
				$(id).css('background','red');
				$(id).css('color','red');
        	}
        }
}
window.chooseWord = function(){/* Tested OK */
	
			randomindex = randomIndex();
			
			if(typeof(randomindex) == "number"){
				return [window.words[randomindex], window.syllables[randomindex]];
			}
			else{
				chooseWord();
			}			
}



function randomIndex(){ /* Tested OK */
	var returned = Math.floor((Math.random() * window.permitIndexes.length));
	var indexofReturned = window.permitIndexes[returned]; 

	window.permitIndexes.splice(returned,1);
	return indexofReturned;
	}
});
