console.log("Loading wordnik")
var baseUrl = "https://api.wordnik.com/v4/word.json/";
var apiKey = "66264672650b54b17e106647882412a5fe915cbc82e18356f"; //from developer.wordnik.com
function getSynonyms (theWord, callback) { //User-defined function
	var url = baseUrl + theWord + "/relatedWords?useCanonical=true&relationshipTypes=synonym&limitPerRelationshipType=5&api_key=" + apiKey;
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text" , 
		timeout: 30000 
		}) 
	.success (function (data, status) { 
		var array = JSON.parse (data); //This is an array
		//console.log (data);
		try{
		callback (array [0].words);
			}
			catch(err) {
			console.log("No synonym found from the HTML response");
			}
		}) 
	.error (function (status) { 
		console.log ("getSynonyms: url == " + url + ", error == " + JSON.stringify (status, undefined, 4));
		});
	}
function getAudio (theWord, callback) { //User-defined function
	var url = baseUrl + theWord + "/audio?useCanonical=false&limit=50&api_key=" + apiKey;
	var jxhr = $.ajax ({ 
		url: url,
		audioType:"pronunciation",
		timeout: 30000 
		}) 
	.success (function (data, status) { 
		//var array2 = JSON.parse (data);
		console.log (data);
		try {
		callback (data [0].fileUrl);
		}
		catch(err) {
		console.log("No audio found from the HTML response");
		console.log(err)
		}
		}) 
	.error (function (status) { 
		console.log ("getSynonyms: url == " + url + ", error == " + JSON.stringify (status, undefined, 4));
		});
	}
function getExample( theWord, callback) {
	var url = baseUrl + theWord + "/examples?includeDuplicates=false&useCanonical=true&skip=0&limit=5&api_key=" + apiKey;
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text" ,
		timeout: 30000 
		}) 
	.success (function (data, status) { 
		var object = JSON.parse (data); //This is an object
		//  console.log (data);
		try{
		callback(object["examples"]);
		}
		catch(err) {
		console.log("No example found from the HTML response");
		}
		}) 
	.error (function (status) { 
		console.log ("getSynonyms: url == " + url + ", error == " + JSON.stringify (status, undefined, 4));
		});
}
