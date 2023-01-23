$(document).ready(function () {
  var jsonFile = "qs.json";
  var questionsData;
  var wrongCounter = 0;
  var totalQuestions = 0;
  var displayedQuestions = [];
  var questionNum = 0;
  var randomIndex = 0;
  var WrongQustionsIndex = [];

  $.getJSON(jsonFile, function (data) {
    questionsData = data;
    totalQuestions = questionsData.length;
    displayQuestion();
  });

  $('.dropdown-select').on('change', function(){
    jsonFile = $(this).val();
    resetQuiz();
    $(this)[0].selectedIndex = 0;
  });

  function displayQuestion() {
    randomIndex = Math.floor(Math.random() * totalQuestions);
    while (displayedQuestions.indexOf(randomIndex) !== -1) {
      randomIndex = Math.floor(Math.random() * totalQuestions);
    }
    displayedQuestions.push(randomIndex);
    $("#question").html(questionsData[randomIndex].Questions);
    $("#labelA").html(questionsData[randomIndex].A);
    $("#labelB").html(questionsData[randomIndex].B);
    $("#labelC").html(questionsData[randomIndex].C);
    $("#labelD").html(questionsData[randomIndex].D);
    $(".answer input").prop("checked", false);
    $("#result").html("");
    $("#counter1").html("Question:" + (questionNum + 1));
    $("#counter").html("Your score is: " + (questionNum - wrongCounter) + " out of " + totalQuestions);

  }

  $("#submit-button").click(function () {
    var selectedAnswer = $(".answer input:checked");
    if (selectedAnswer.length) {
      var selectedAnswerValue = $(".answer input:checked + label").text();
      if (selectedAnswerValue.charAt(0) === questionsData[randomIndex].Answer) {
        $("#result").html("Correct!");
        $("#result").css("color", "green");
        questionNum += 1;
        if (displayedQuestions.length === totalQuestions) {
          setTimeout(() => { displayWrongQuestions(); }, 2500);
          $("#counter").html("Your score is: " + (totalQuestions - wrongCounter) + " out of " + totalQuestions);
          alert("Your score is: " + (totalQuestions - wrongCounter) + " out of " + totalQuestions);
        }
        else {
          setTimeout(() => { displayQuestion(); }, 250);
        }
      } else {
        $("#result").html("Incorrect. The correct answer is " + questionsData[randomIndex].Answer);
        $("#result").css("color", "red");
        wrongCounter++;
        WrongQustionsIndex.push(randomIndex);

      }
    } else {
      $("#result").html("Please select an answer");
      $("#result").css("color", "blue");
    }
  });

  $(".answer input").change(function () {
    if (this.checked ) {
      $(".answer input").not(this).prop("checked", false);
    }
  });
  function resetQuiz() {
    $.getJSON(jsonFile, function (data) {
      questionsData = data;
      totalQuestions = questionsData.length;
      displayedQuestions = [];
      questionNum = 0;
      wrongCounter = 0;
      localStorage.removeItem("quizData");
      displayQuestion();
    });
  }
  function displayWrongQuestions() {
    $("body").empty();
    let label = $('<div>',{class:"counter-label",id:'counter'}).text("Wrong Questions")
    label.css({
      "position":"relative",
      "top":"auto",
      "left":"auto",
      "transform":"translate(0, 0)"
    })
    $('body').append(label);
    for (let i = 0; i < WrongQustionsIndex.length; i++) {
      let question = questionsData[WrongQustionsIndex[i]];
      let questionContainer = $('<div>', { class: 'question-container', style: "border: 1px solid red;"});
      let questionDiv = $('<div>', { id: 'question' }).text(question.Questions);
      let answersContainer = $('<div>', { class: 'answers-container' });
    
      let answers = ["A", "B", "C", "D"];
      for (let j = 0; j < answers.length; j++) {
        let answer = answers[j];
        let answerDiv = $('<div>', { class: 'answer' });
        let label = $('<label>', { id: 'label' + answer }).text(question[answer]);
        if (question.Answer === answer) {
          label.css("color", "red");
        }
        answerDiv.append(label);
        answersContainer.append(answerDiv);
      }
    
      questionContainer.append(questionDiv);
      questionContainer.append(answersContainer);
      
      setTimeout(function() {
        questionContainer.hide();
        questionContainer.fadeIn(1500);
        $('body').append(questionContainer);
        $("body").css("height", "auto");
      }, i * 500);
    }
    
  }
  $("#end-button").click(displayWrongQuestions)

});


