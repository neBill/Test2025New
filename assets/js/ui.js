'use strict';

let rightOptionIndex;
//let isLearnMode;
let isHistorySave = true;
//let isShuffle;
let isAnswerDone = false;
let defaultRank;
let currentIndex;

let state = {
  currentIndex: 0,
  wrongAnswers: []
};



let isTestFinished = false;

const testSuccess = "<br>Тест успешно пройден!<br>Результат - 100%";
//let mistakes = {};
let currentTestLength;
let curQuestionNumber;
const btnHome = document.getElementById('button_home');
const navBlock = document.getElementById('nav_block');
const divLavels = document.getElementById('levels');
const divTest = document.getElementById('test');
const btnMenu = document.getElementById('button_menu');
const headerBlock = document.getElementById('header_block');
const listBlock = document.getElementById('list-block');
const tglLearnMode = document.getElementById('learn_mode');
const tglShuffle = document.getElementById('shuffle');





class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}



// class WrongAnswers {
//    constructor(answer) {
//      this.answer = answer
//    }
// }


// class Errors {  
//   errors = []  
//   addError(error) {   
//     this.errors.push(error)
//   }
// }

// const wrongAnswers = new Errors();
// const currentIndex = new Counter(0);
const currentTest = new CurrentTest();


function putToCache(elem, cache) {
  if (cache.indexOf(elem) !== -1) {
    return;
  }
  let i = Math.floor(Math.random() * (cache.length + 1));
  cache.splice(i, 0, elem);
}


function madness() {
  let cache = [];
  return function(a, b) {
    putToCache(a, cache);
    putToCache(b, cache);
    return cache.indexOf(b) - cache.indexOf(a);
  };
}


function shuffle(arr) {  

    let compare = madness();
    return arr.sort(compare);

}


function showErrors(btnValue){

 // alert(btnValue)

 // let val = Number(btnValue)
  
  const history = getTestHistory(currentTest.id) 

  const mistakes = Object.values(history)[1];   

  //проверить есть ли ошибки
  const userAnswer = mistakes[btnValue][1]; 

  const questNumber = mistakes[btnValue][0];

  updateQuestionBlock(questNumber)

  divTest.style.display = 'block'; 

  document.getElementById('option0').style.border = 'var(--right-answer-border)';

  document.getElementById('option' + userAnswer).style.border = 'var(--wrong-answer-border)'  

  var nodes = document.getElementById("testButtons").getElementsByTagName('*');

  for(var i = 0; i < nodes.length; i++){

      nodes[i].disabled = true;
  }
  
}





function updateQuestionBlock(questionIndex) { 

  // let currentQuestionBlock = testsList[defaultRank][testId][0][currentIndex - 1];  

  let currentQuestionBlock = testsList[defaultRank][currentTest.id][0][questionIndex];

  let optionsCount = currentQuestionBlock.answers.length;  

  if(optionsCount < 4) {

    while(optionsCount < 4) {

      currentQuestionBlock.answers.push("Нет варианта ответа (*)");

      optionsCount++;

    }

  }   


  //shuffle(currentQuestionBlock.answers);  




  for (var i = 0; i < 4; ++i) {    

    const btnId = `option${i}`;

    document.getElementById(btnId).innerHTML = currentQuestionBlock.answers[i];

    document.getElementById(btnId).style.border = 'none';

    document.getElementById(btnId).disabled = false;
  }

  document.getElementById('question').innerHTML = currentQuestionBlock.question;
  
  document.getElementById('counter').innerHTML = `Вопрос: ${state.currentIndex + 1}/${currentTestLength}`;

  var ul = document.getElementById('testButtons');

  for (var i = ul.children.length; i >= 0; i--) {

    ul.appendChild(ul.children[Math.random() * i | 0]);

  }

}


function setTrainingMode(optionIndex) {

  document.getElementById('button_next').style.display = "inline-block";

  let borderColor = '';

  if (currentTest.test[currentIndex][1][optionIndex][1] == 1) {

    borderColor = "var(--right-answer-border)";

  } else {

    borderColor = "var(--wrong-answer-border)";

    document.getElementById('option' + rightOptionIndex).style.border = "var(--right-answer-border)";
  }

    document.getElementById('option' + optionIndex).style.border = borderColor;  

  for (let element of divTest.children) {

    element.disabled = true;

  }

}



function calcRightAnswers(questionsQuantity, errorsQuantity ) { 

  let rightAnswersQuantity = Math.round(questionsQuantity - errorsQuantity);

  let percent = Math.round(rightAnswersQuantity * 100 / (questionsQuantity));

  return { rightAnswers: rightAnswersQuantity, errorsPercent: percent };
}



function getTestHistory(testId) {

  const testHistory = localStorage.getItem(testId);

  if(!testHistory) return;

  return JSON.parse(testHistory);

}


function showTestResult() {  

    const history = getTestHistory(currentTest.id);
    
    if (!history || typeof history !== 'object') {
        console.error("Invalid test history");
        return;
    }

    const questionQuantity = Object.values(history)[0] + 1;
    const mistakes = Object.values(history)[1];

    //alert(mistakes[0])

    // if (!mistakes || typeof mistakes !== 'object') {
    //     console.error("Mistakes data is invalid");
    //     return;
    // }

    const mistakesQuantity = Object.keys(mistakes).length;

    const testState = questionQuantity === currentTestLength ? 'завершен' : 'остановлен';

    // if (mistakesQuantity === 0 && testState === 'завершен') {
    if (testState === 'завершен') {

      if(mistakesQuantity === 0) {

        document.getElementById('result').innerHTML = testSuccess;

        isTestFinished = false;


        localStorage.removeItem(currentTest.id);
        return;

      } else {

        isTestFinished = true;

      }
    }

   

    const testInfo = `<br>Тест ${testState}<br>Пройдено вопросов: ${questionQuantity} из ${currentTestLength}<br>`;
    const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, mistakesQuantity);

    const mistakesHeader = mistakesQuantity > 0 ? '<br>Ваши ошибки:<br>' : '';

    const resultHTML = `${testInfo}Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;
    document.getElementById('result').innerHTML = resultHTML;

    // Clear previous buttons before adding new ones
    const btnContainer = document.getElementById('errors');
    btnContainer.innerHTML = ''; 

    
    //let count = 0;

    for(let i = 0; i < mistakes.length; i++) {

      const button = document.createElement('button');
      button.id = `erBtn${i}`;
      button.value = i;
      button.className = 'error_button';
      const btnNumber = i + 1;
      button.textContent = btnNumber;
      btnContainer.appendChild(button);

    }

}
 
    


function showSelectedMistake(id) {  

  const links = document.querySelectorAll(".error_button");

  const btnValue = document.getElementById(id).value;

  //alert(erBtnId)

  showErrors(btnValue);

  links.forEach(link => {

    link.setAttribute("style", "background:`:root { --main-bg-color}`");

  });

  document.getElementById(id).style.background = "var(--error-btn-color)";

}



document.addEventListener("click", function(event) {

  // const buttonClass = event.target.className;

  // const buttonId = event.target.id;

  // if (buttonClass == "error_button") {

  //   const links = document.querySelectorAll(".error_button");

  //   showErrors(buttonId);

  //   links.forEach(link => {

  //     link.setAttribute("style", "background:`:root { --main-bg-color}`");

  //   });

  //   document.getElementById(buttonId).style.background = "var(--error-btn-color)";

  // }



  // if (buttonClass == "font-size-change") {

  //    chageFontSize(buttonId);
  // }


});


//переход на главную страницу,нажата кнопка На главную или Завершить
btnHome.addEventListener("click", function(event) {

    //showLevels();


  const buttonText = event.target.textContent

  if (buttonText == "Завершить") {

    if(currentIndex === 1 || !isAnswerDone) {

        showLevels();    
        return;
    
      } 
    
    showResultsPage();

    showTestResult();



    

  }

  if (buttonText == "На главную") { 

    isAnswerDone = false;

    showLevels();

  }

   



  if(tglShuffle.checked) {

    localStorage.removeItem(currentTest.id);

    currentTest.id = '';

  }

  //Object.keys(state).forEach(key => delete state[key]);
  

})

button_next.addEventListener("click", function() {

  updateQuestionBlock(state.currentIndex);

  document.getElementById('button_next').style.display = "none";

})



function saveTestHistory() {     

  localStorage.setItem(currentTest.id, JSON.stringify(state)); 

}



function check(optionIndex) {  

  
  // alert(optionIndex)

  // if (state.currentIndex === currentTestLength - 1) {      
    
  //   saveTestHistory();    
 
  // //  showResultsPage();

  // //  showTestResult();   

  //   alert('Fin')

  //   return;

  // } 


  //alert(testsList[defaultRank][currentTest.id][0][0][1][0][1])

 // let selectedIndex = testsList[defaultRank][currentTest.id][0][0][1][optionIndex][1];

 ///////////////////////////////

  //let answerText = document.getElementById(optionIndex).textContent

  //let currentQuestionBlock = testsList[defaultRank][currentTest.id][0][0].answers;

  //let answerKey = testsList[defaultRank][currentTest.id][0][0].answers[optionIndex][1];

  //let ans = answerText + answerKey 

// alert(currentQuestionBlock)

 // alert(currentQuestionBlock.indexOf(ans))



  /////////////////////////////////////

 //alert(testsList[defaultRank][currentTest.id][0][0].answers[optionIndex][1])

// let answerKey = testsList[defaultRank][currentTest.id][0][0].answers[optionIndex][1];

  //alert(answerKey)

  if(optionIndex != 0){

  // alert(state.currentIndex)

    // mistake.questionNumber = (currentIndex -1).toString();
    // mistake.userAnswer = optionIndex;

    //alert(mistake.questionNumber)

    //const mistake = [state.currentIndex, optionIndex]

    // let fruits = ['яблоко', 'банан', 'вишня'];
    // fruits.splice(1, 1, 'голубика');
    // console.log(fruits); // ['яблоко', 'голубика', 'вишня']

    

    //state.wrongAnswers.push([state.currentIndex, optionIndex])

    if(state.wrongAnswers.length > 0) {

      state.wrongAnswers.forEach((el) => {
      
        alert(el[0])

      })

      // alert(state.wrongAnswers[state.currentIndex])

    } else {

      state.wrongAnswers.push([state.currentIndex, optionIndex]);

    }

    
  //  saveTestHistory(); 

  } else {

   //alert("right")
   //state.currentIndex
   //saveTestHistory();


  }

  

  

  

  saveTestHistory();


  if (state.currentIndex === currentTestLength - 1) {      
    
    saveTestHistory();    
 
    showResultsPage();

    showTestResult();   

    //alert('Fin')
    state.currentIndex = 0;

    return;

  } 

 

  

  if (tglLearnMode.checked === true && optionIndex != rightOptionIndex) { 

    setTrainingMode(optionIndex);

    currentIndex++;

    return;

  } 

  //currentIndex.index++;
 // currentIndex++;

  //curQuestionNumber++;

  //alert(currentIndex++)

  state.currentIndex++;

  //alert(state.currentIndex)

 // localStorage.setItem("quizState", JSON.stringify(state));

  updateQuestionBlock(state.currentIndex);

}

// function checkIsTestFinished(currentIndex) {
  
//   return  currentIndex === currentTestLength ? true : false;

// }




function showMainPage() {

  document.getElementById('main_page').style.display = "block";
  document.getElementById('results').style.display = "none";
  divLavels.style.display = "none";
  document.getElementById('questions_counter').style.display = 'none';
  divTest.style.display = "none";
  navBlock.style.display = "none";
  document.getElementById('result').style.display = "none";

}

function showLevels() {

  //alert(document.getElementById('results').style.display)

  btnHome.style.display = "none";
  navBlock.style.display = "none";
  divLavels.style.display = "block";
  document.getElementById('errors').innerHTML = "";
  document.getElementById('test-title').innerHTML = "";
  document.getElementById('results').style.display = "none";
  divTest.style.display = "none";
  btnMenu.style.display = "block";
  headerBlock.style.display = "block";
  document.getElementById('counter').style.display = "none";
  //wrongAnswers.errors.length = 0;

  //alert(document.getElementById('results').style.display)

}

function showTest() {

  document.getElementById('questions_counter').style.display = 'block';
  divLavels.style.display = "none";
  document.getElementById('counter').style.display = "block";
}




  //if(event.target.className !== "test_button") return; 

  //currentTest.id = event.target.id;  
  


  document.addEventListener("click", function(event) {

    const id = event.target.id;

    const classNamed = event.target.className;

    if(classNamed == "test_button") {   
      
      //alert(id)

      chooseTest(id, event.target.textContent);

    } 

    if (classNamed == "error_button") {

      showSelectedMistake(id);

    }

    if (classNamed == "option_button") {


      //alert(typeof(value))

      check(event.target.value);

    }

  
  })





function chooseTest(testId, testName) {

  //if(event.target.className !== "test_button") return; 

  //currentTest.id = event.target.id;  

  //alert(testId)
  
  //alert(testName)
  currentTest.id = testId;

  //alert(testsList[defaultRank][testId][0].length)
  

  //const testHistory = localStorage.getItem(currentTest.id);

  const history = getTestHistory(testId);

  //alert(history.currentIndex)

  currentTestLength = testsList[defaultRank][testId][0].length;

 // const testLength = testsList[defaultRank][testId][0].length;

  //const mistakes = Object.values(history)[0];  

  //alert(currentTestLength)
 
  
  // if(testHistory) {   
  if(history) {

    //const history = JSON.parse(testHistory) ;   

    //mistakes = Object.values(history)[0];   
    
    //const mistakes = getMistakes(testHistory);  

    //alert("isTestFinished")

    //const mistakes = Object.values(history)[0]; 

    //const mistakesQuantity = Object.keys(mistakes).length;

   // alert(history.wrongAnswers.length)

    // const mistakesQuantity = Object.keys(mistakes).length;

    const quNumber = history.currentIndex + 1;

    // currentTestLength = testsList[defaultRank][testId][0].length;

    if(quNumber === currentTestLength) { 


      //...................здесь логика проработки допущенных ошибок..........................................................


      alert('ошибки'); 
       
      currentTestLength = history.wrongAnswers.length;

      state.currentIndex = 0;

      saveTestHistory();



    } else {

  
      alert('тест '); 


      state.currentIndex = quNumber;

    }

    

   
  } else {   

   state.currentIndex = 0;    

  }

   
  if (tglShuffle.checked) {

    shuffle(currentTest.test);

    currentTest.id += '$';

  } else if (tglLearnMode.checked) {

    currentTest.id += '*';
  
  }  

  //alert(target.textContent)
 
  showChosenTest(testName);  

  updateQuestionBlock(state.currentIndex);


}



function showResultsPage() {
  
  btnHome.style.display = "block";
  document.getElementById('button_next').style.display = "none";
  document.getElementById('results').style.display = 'block';
  divTest.style.display = "none";
  document.getElementById('result').style.display = "block";
  document.getElementById('counter').style.display = "none"; 
  btnHome.innerText = "На главную";

}

function showChosenTest(testName) {
  
  divTest.style.display = "block";
  document.getElementById('counter').innerHTML = "Вопрос: 1/" + currentTestLength;
  document.getElementById('counter').style.display = "block";
  document.getElementById('questions_counter').style.display = 'block';
  divLavels.style.display = "none";
  navBlock.style.display = "block";
  document.getElementById('button_next').style.display = "none";

  btnHome.innerText = "Завершить";
  btnHome.style.display = "block";


  btnMenu.style.display = "none";
  document.getElementById('test-title').innerHTML = testName;
  headerBlock.style.display = "none";
 

}

//////////////////////////////////////////////////////////////////////list///////////////////

const testTitle = document.getElementById('test-title');

testTitle.addEventListener("click", list)

function list() {

  const parrentBlock = document.getElementById('q-list');

  let questions = testsList[defaultRank][currentTest.id][0]

  let i = 0;

  questions.forEach((question) => {
   
    const line = document.createElement('p');
    line.textContent = `${i + 1}) ${question[0]}`;
    line.id = i.toString();
    line.className = "q-line"
    parrentBlock.appendChild(line);
    i++;


  })  
 

  listBlock.style.display = "block";

  questions = []

}  
  

const btnHideList = document.getElementById('btn-hide-list')

btnHideList.addEventListener("click", hideListBlock)

function hideListBlock() {

  listBlock.style.display = "none";

}


document.addEventListener("click", function (event) {
 

  if(event.target.className !== 'q-line') return;

 // let questions = testsList[defaultRank][currentTest.id][0]  

  const parrentBlock = document.getElementById('mod-content'); 

  const question = document.createElement('p');

  const line = document.createElement('hr');

  line.className = 'line'

  let questions = testsList[defaultRank][currentTest.id][0]

  question.textContent = questions[event.target.id][0];

  

  let text = questions[event.target.id][1];   

  
  
  

  while (parrentBlock.hasChildNodes()) {

    parrentBlock.removeChild(parrentBlock.firstChild);

  }

  parrentBlock.appendChild(question);

  parrentBlock.appendChild(line);

    let i = 0;
  
    text.forEach((answer) => {
    
      
      const paragraph = document.createElement('p');
      
      paragraph .id = i.toString();
      

      paragraph .innerHTML = '   ' + `${i + 1}) ${answer[0]}`;
      
      if(answer[1].toString() === "1")
      {        
        

        paragraph .className = 'right-option';

        
      }

      parrentBlock.appendChild(paragraph );

      i++;
  
  
    })
    
    modal.style.display = "block";


});



// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
  
