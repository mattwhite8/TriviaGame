var count = 0;
var correctAnswer;
var answerChoices;
var jasonData;
var intervalID;
var timer = 10;
var timerDiv = document.getElementById("timer");

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

  timer = 10;

  if(count > 4){
    return gameOver();
  }

  var newArr = jasonData[count].incorrect_answers;
  newArr.push(jasonData[count].correct_answer);
  newArr = shuffle(newArr);
  correctAnswer = jasonData[count].correct_answer;
  answerChoices = document.getElementsByClassName("answer-choice");
  timerDiv.innerHTML = "<p>" + timer + "</p>";
  document.getElementById("category").innerHTML = jasonData[count].category;
  document.getElementById("question").innerHTML = jasonData[count].question;

  for(i = 0;i < newArr.length;i++){
    document.getElementById('answer'+ i).innerHTML = newArr[i];
  }

  answerOnClick(answerChoices);

  start();

}

function answerOnClick(answers){
    Array.prototype.forEach.call(answers, function(element){
    element.onclick = function(){
      if(element.innerHTML === correctAnswer){
        stop();
        alert("Correct!");
        timer = 10;
        count++;
        setTimeout(nextObject, 500);
      } else {
        stop();
        alert("Wrong!");
        timer = 10;
        count++;
        setTimeout(nextObject, 500);
      }
    }
  })
}

function disableAnswerOnClick(answers){
  Array.prototype.forEach.call(answers, function(element){
    element.onclick = function(){
      alert("Paused!");
    }
  })
}

function start(){
  intervalID = setInterval(countDown, 1000);
}

function countDown(){
  timer--;
  timerDiv.innerHTML = "<p>" + timer + "</p>";
  if (timer === 0){
    stop();
    alert("You're out of time");
    timer = 10;
    count++;
    setTimeout(nextObject, 500);
  }
}

function stop(){
  clearInterval(intervalID);
}

function callTrivia(category, difficulty){
  $.ajax({
    url:'https://opentdb.com/api.php?amount=5',
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

function gameOver(){
  timer = 10;
  timerDiv.innerHTML = "<p>" + timer + "</p>";
  alert("You ran out of questions, choose another category!");
}

document.addEventListener("DOMContentLoaded", function(){
  var selectBox = document.getElementById("select-box");
  var difficultyBox = document.getElementById("difficulty-box");
  var selectButton = document.getElementById("select-button");
  var nextButton = document.getElementById("next-button");
  var pauseButton = document.getElementById("pause");
  var resumeButton = document.getElementById("resume");

  pauseButton.disabled = true;
  resumeButton.disabled = true;
    
  selectButton.onclick = function(){
    stop();
    pauseButton.disabled = false;
    count = 0;
    var index1 = selectBox.selectedIndex;
    var index2 = difficultyBox.selectedIndex;
    callTrivia(selectBox.item(index1).id, difficultyBox.item(index2).id);
  }

  pauseButton.onclick = function(){
    disableAnswerOnClick(answerChoices);
    resumeButton.disabled = false;
    stop();
  }

  resumeButton.onclick = function(){
    answerOnClick(answerChoices);
    resumeButton.disabled = true;
    start();
  }

});