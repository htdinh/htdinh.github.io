//TODO: clear synonym every question_display() to clear old entry. Control flow of the buttons
//Error handling for request that found no response [] such as no synonym for ambidextrous. This case: showing the other information suffice. 
//Add audio and word example refresh. Possibly extend to keep the list on WordNik

// Update at 7:30pm
//Audio is incorporated into the js but still not working, probably the error is visibility of the HREF
//More info should be disabled except before the submit()  and after first click on moreinfo.
//Alignment for the example. 
//Remove background because of the duplication when info extend
//Add a block: behind the scene.
//Update at 9:08pm
//Flow control done. Attempted to justify alignment. Take 1 more try
// Global variables are accessible by any functions below 
console.log("loading flashcard.js")
var total_questions=5;
var correct_count = 0;
var current = 0;
var prompts_per_question = 3;
var all_prompts_indexes = new Array(30);
var answer = prompts_per_question; // Legitimate range for answer is (0<= to < prompts_per_question). Set this to be prompts_per_question means that there is no answer chosen	
var ques_bank;
var incorrect = new Array();
var submit_status = false;

window.onload = function()
 {
    loadXMLDoc()
	var select = document.getElementById("my_select")
	output = document.getElementById("output")	
	total_questions = select.options[select.selectedIndex].value; // Initial onload must also trigger this value 
	select.onchange = function()
	{	
		total_questions = select.options[select.selectedIndex].value; //Must reset the total questions after every change 
		start(); //Reset size must be before the start() because start() draws a sample based on this size
	};
 };	
function clear_checked(){
    var thequestion = document.getElementsByName("question1")
	for (i = 0; i<prompts_per_question;i = i+1)
	{
		thequestion[i].checked=false
	}
}
// Start doesn't call loadXMLDoc unless the main html fails to call; Start's role is primarily to sample random
function start()
{		
	document.getElementById('quiz').style.visibility="visible"; //activate the QUIZ area
	document.getElementById('instruction').innerHTML = ""; //Clear instruction
	document.getElementById("audioButton").style.visibility = "hidden"; //hide the pronunciation button on start
	correct_count = 0;
	current = 0;
	clear_checked()
	//**********************************************
	//local(); //Activate this line to process local sample. Deactivate the line above
	//question_display(); //only display the question after loading
	//**********************************************
	//Resample the question + distractor set
	try{
	var population = Array.apply(null, {length: ques_bank.length}).map(Number.call, Number) //Array of 30 elements from 0:29. This should be here because the length of the polution is mutable
	//randomly sample 30 unique prompts (=prompts per question x total_questions)
	all_prompts_indexes = _.sample(population, prompts_per_question*total_questions); //till here, a set of unique question indexes is chosen.
	question_display(); //only display the question after loading
	}
	catch(err) //the question bank is not yet loaded
	{
	console.log(err)
	loadXMLDoc();
	alert("Please wait until question bank is loaded!");
	}
	
}

function local() //This function is used to run locally on the client side
{
	ques_bank = ["abacus,frame with balls for calculating       	","abate,to lessen to subside        ","abdication,giving up control authority        ","aberration,straying away from what is normal      ","abet,help/encourage smb (in doing wrong)     ","abeyance,suspended action          ","abhor,to hate to detest        ","abide,be faithful to endure        ","abjure,promise or swear to give up      ","abraded,rubbed off worn away by friction      ","abrogate,repeal or annul by authority       ","abscond,to go away suddenly (to avoid arrest)     ","abstruse,difficult to comprehend obscure        ","abjure2,promise or swear to give up2      ","abraded2,rubbed off worn away by friction2      ","abrogate2,repeal or annul by authority2       ","abscond2,to go away suddenly (to avoid arrest)2     ","abstruse2,difficult to comprehend obscure2        "]
	all_prompts_indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]	
}

// Load XML: This function returns one global variables: ques_bank 
function loadXMLDoc() //create dynamic content of the questions
{
	initialization();
	var xmlhttp;
	current = 0; //after every restart, reset the current counter to zero		
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()	  
	{
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) //after loading
		{
		var text = xmlhttp.responseText; //text is a local variable. It takes effect only within this function's scope		
		ques_bank=text.split('\n');		//If you assign a value to a variable that has not been declared, it will automatically become a GLOBAL variable.														
		document.getElementById('status').innerHTML = "<i>Question bank is successfully loaded.</i>"; //Clear last result display
	  }
	}
	xmlhttp.open("GET","https://raw.githubusercontent.com/Dinh-Hung-Tu/Dinh-Hung-Tu-0.github.io/master/gre/wordlist.txt",true);
	xmlhttp.send();	
}

//Display question, one by one
function question_display()
{ // this function accepts no argument, it will repeat until current reach the max number of questions	
	document.getElementById('quiz').style.visibility="visible"; //activate the 		
	document.getElementById('main').disabled = true;
	document.getElementById('result').innerHTML = ""; //Clear last result display
	document.getElementById('idElaborate').innerHTML = "";//clear info about last search
	document.getElementById("audioButton").style.visibility = "hidden";
	clear_checked()
	myquiz.reset();
	answer = prompts_per_question;
	submitButton.disabled = false;
	elaborateButton.disabled = true;
	//Set question vs revision question
	if (current<total_questions) {document.getElementById('order').innerHTML = "Question "+(current+1).toString()+":";}
	else 
	{
		if (incorrect.length != 0) {document.getElementById('order').innerHTML = "Revision Question "+(current+1 - total_questions).toString()+":";}
		else // after completing all question in revision (incorrect.length == 0)
		{
			document.getElementById('instruction').innerHTML = "Revision finished! Click START to take another test";
			submitButton.disabled = true;
			startButton.disabled = false;
		}
	}
				

	// Two random variables (set global so as that the submit button can check (1) and next button (which add to incorrect) check (2)
	//		(1) which of (a) (b) (c) is the answer
	//      (2) which of the set all_prompts_indexes the stem. From (1) set the prompt for that stem correspondingly
	// (1) This is the first random variable: answer key one value of [0, 1, 2]
	key = Math.floor((Math.random() * prompts_per_question) + 0); 	
	// (2) random variable key_index is the index of the key in the all_prompts_indexes
	if (current < total_questions){	key_index = current;} //not in revision mode
		else if (incorrect.length!=0) {key_index = incorrect.shift();} //in revision mode
	//Set the stem
	document.getElementById('stem').innerHTML = ques_bank[all_prompts_indexes[key_index]].split(',')[0];
	//Set the true answer: Change to slice method to cater for the case when definition contains multiple instance splitted by ','
	document.getElementById(key.toString()).innerHTML = ques_bank[all_prompts_indexes[key_index]].split(',').slice(1);
		
	//Loop thru the prompts_per_question (3 choices in this case), set the 3 prompts
	var count = 0;
	for (prompt_id = 0;prompt_id <prompts_per_question; prompt_id = prompt_id + 1)
	{			
		if (prompt_id!=key) // if not the answer, choose two other random in two spaces
		{
			count = count+1; //Local count except the correct answer
			// The space of all_prompt_indexes is divided into the 3 segments. Just choose one of the random number from the three segments.
			random_factor = Math.floor((Math.random() * total_questions) + 0); //       Random_factor = [0:9]		
			var local_index = current%total_questions+count*total_questions;//ensure the limit of the reference is guaranteed 1) 0 <= current%total_questions <= 9; // 2) 0<= prompt_id*total_qn <= 20				
			var entry_line = ques_bank[all_prompts_indexes[local_index]];						
			var entry = entry_line.split(",");	
			document.getElementById(prompt_id.toString()).innerHTML = entry.slice(1,);
		}		
	}	
	current = current + 1;	
}	
function submit_switch(){
     if (validate_answer()==false){
        return
     }

    if (submit_status==false){
        submit()
        document.getElementById("submitButton").value = "Next"
        submit_status=true
    }
    else{
        question_display()
        document.getElementById("submitButton").value = "Check"
        submit_status=false
    }
}
//Submit button handler
function get_answer(){
	var thequestion=document.getElementsByName("question1")
	for (i = 0; i<prompts_per_question;i = i+1)
	{
		if (thequestion[i].checked==true) {answer = i;}
	}
	return answer
}

function validate_answer(){
    answer = get_answer()
	if (answer < prompts_per_question) //valid answer
	return true
	else
	{
	document.getElementById('result').innerHTML = "Opps! You forgot to choose one answer!";	}
    return false
}

function submit()
{
    answer = get_answer()
	document.getElementById('quiz').disabled = true;
    if (answer == key)
    {
        document.getElementById('result').innerHTML = "Correct!";
        if (current <= total_questions){correct_count = correct_count+1;}// not yet in revision
    }
    else
    {
        document.getElementById('result').innerHTML = "Incorrect!"+" Correct answer is: " + ques_bank[all_prompts_indexes[key_index]].split(',').slice(1);
        //push the index of wrong question
        incorrect.push(key_index); //every wrong choice will add into the incorrect set for revision
    }
    elaborateButton.disabled = false;
    //submitButton.disabled = true;
    //nextButton.disabled = false;
    answer = prompts_per_question; //this is to clear the variable answer in next question


	if (current == total_questions)
	{
		var result_display = "Your total result is " + correct_count.toString() + "/" + total_questions.toString()		
		document.getElementById('result').innerHTML = result_display;
		if (incorrect.length == 0) //not revision mode
		{
			document.getElementById('instruction').innerHTML = "Click START to take another test";
			//nextButton.disabled = true;
			startButton.disabled = false;
			submitButton.disabled = true;
		}
		else //in revision mode
		{
			document.getElementById('instruction').innerHTML = "Next section is revision of incorrect answers";
			startButton.disabled = true;
			submitButton.disabled = false;
		}
	}
	else
	{
		document.getElementById('instruction').innerHTML = ""; //Clear the instruction
	}
}
//Initialization upon page load
function initialization()
{		
	document.getElementById('quiz').style.visibility="hidden";
	submitButton.disabled = true;
}
//Add the function for elaboration
function elaborate()
{	//Keep word a local variable
	elaborateButton.disabled = true;
	var word = document.getElementById('stem').innerHTML; //This variable is shared for all functions below.
	getSynonyms (word, function (synonym) 
		{
		var s1 = "<b>Synonym:</b><br> "; //String to output: Local variable
		for (var i = 0; i <synonym.length; i++) {
			s1 += synonym [i] + " " //Add space between consecutive synonyms
			}
		s1 += "<br><br>" //Break a new line
		document.getElementById('idElaborate').innerHTML += s1 //Append the synonyms to elaboration
		});
	getExample (word, function (examples) 
		{
		var array = examples;
		var s2 = "<b>Examples:</b><br> "; //Initialize string to output
		for (var i = 0; i <array.length; i++) {
			s2 += "<li>" + array[i]["text"] + "</li>"} //Add an extra line between two examples
		document.getElementById('idElaborate').innerHTML += s2 //Append the examples to elaboration
		});
	getAudio(word,function(url){
		$("#idAudio").html("<audio id = 'audiotag'> <source src=" + url+">"+ "</audio>");
		document.getElementById("audioButton").style.visibility = "visible";
		});	
}

function play_audio()
{
	audiotag.play();
}