var count = 0;
var correctAnswer;
var answerChoices;
var jasonData;

//Fisher-Yates shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function nextObject(){

  var newArr = jasonData[count].incorrect_answers;
  newArr.push(jasonData[count].correct_answer);
  newArr = shuffle(newArr);
  correctAnswer = jasonData[count].correct_answer;
  answerChoices = document.getElementsByClassName("answer-choice");
  document.getElementById("category").innerHTML = jasonData[count].category;
  document.getElementById("question").innerHTML = jasonData[count].question;

  for(i = 0;i < newArr.length;i++){
    document.getElementById('answer'+ i).innerHTML = newArr[i];
  }

  Array.prototype.forEach.call(answerChoices, function(element){
    element.onclick = function(){
      if(element.innerHTML === correctAnswer){
        alert("Correct!");
      } else {
        alert("Wrong!");
      }
    }
  })

}

function callTrivia(category, difficulty){
  $.ajax({
    url:'https://opentdb.com/api.php?amount=10',
    data: {
      category: category,
      difficulty: difficulty,
      type: 'multiple'
    }
  }).done(function(returnData){
    jasonData = returnData.results;
    console.log(jasonData);
    console.log(returnData.results[count]);
    nextObject();
  });
}

document.addEventListener("DOMContentLoaded", function(){
  var selectBox = document.getElementById("select-box");
  var difficultyBox = document.getElementById("difficulty-box");
  var selectButton = document.getElementById("select-button");
  var nextButton = document.getElementById("next-button");
    
  selectButton.onclick = function(){
    count = 0;
    var index1 = selectBox.selectedIndex;
    var index2 = difficultyBox.selectedIndex;
    callTrivia(selectBox.item(index1).id, difficultyBox.item(index2).id);
  }

  nextButton.onclick = function(){
    count++;
    if(count > 9){
      alert("Out of questions! Choose another set.")
    } else{
      nextObject();
    }
  }
  
});