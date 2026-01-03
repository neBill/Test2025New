'use strict';

let rightOptionIndex;
//let isLearnMode;
let isHistorySave = true;

let isAnswerDone = false;
let defaultRank;
let currentIndex;
//let testMistakes;

let state = {
  currentIndex: 0,
  wrongAnswers: [],
  isMistakes: false
};



//let isTestFinished = false;

const testSuccess = "<br>Тест успешно пройден!<br>Результат - 100%";
//let mistakes = {};
let currentTestLength;
let curQuestionNumber;
const btnHome = document.getElementById('button_home');
const navBlock = document.getElementById('nav_block');
const divLevels = document.getElementById('levels');
const divTest = document.getElementById('test');
const btnMenu = document.getElementById('button_menu');
const headerBlock = document.getElementById('header_block');
const listBlock = document.getElementById('list-block');
const tglLearnMode = document.getElementById('learn_mode');
const tglShuffle = document.getElementById('shuffle'); 
const questionElement = document.getElementById('question');
const questionCounter = document.getElementById('counter');
const testResult = document.getElementById('result');
const mistakeButtons = document.getElementById('mistakeButtons');  


 // document.getElementById('results').style.display = NONE;
  //divLavels.style.display = NONE;
 // document.getElementById('questions_counter').style.display = NONE;


const BLOCK = 'block';
const NONE = 'none';


const mainPage = document.getElementById('main_page');
const resultBlock = document.getElementById('results');
const counterBlock = document.getElementById('questions_counter');


const testTitle = document.getElementById('test-title');


class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

const currentTest = new CurrentTest();


// function showErrors(btnValue){

  
//  // const history = getTestHistory(currentTest.id) 

//   //const mistakes = Object.values(history)[1];   

//   //проверить есть ли ошибки

//   const userAnswer = mistakes[btnValue][1]; 

 

//   const questNumber = mistakes[btnValue][0];

 

//   //updateQuestionBlock(questNumber)
//   //updateQuestionBlock()

 

//   const questionBlock = testBases[currentTest.id].testBody[state.currentIndex];   

//   fillQuestionBlock(questionBlock)

 

//   divTest.style.display = 'block'; 

//   document.getElementById('option0').style.border = 'var(--right-answer-border)';

//   document.getElementById('option' + userAnswer).style.border = 'var(--wrong-answer-border)'  

//   var nodes = document.getElementById("testButtons").getElementsByTagName('*');

//   for(var i = 0; i < nodes.length; i++){

//       nodes[i].disabled = true;
//   }
  
// }


function fillQuestionBlock(questionBlock, isShuffle) {  
  
  const REQUIRED_OPTIONS = 4;

  // 1. Безопасное получение и копирование массива ответов
  let answers = Array.isArray(questionBlock?.answers)
    ? [...questionBlock.answers]
    : [];

  // 2. Дополнение до требуемого количества вариантов
  while (answers.length < REQUIRED_OPTIONS) {
    answers.push('Нет варианта ответа (*)');  }

  
  // 3. Перемешивание массива
  if(isShuffle) {
    //const shuffled = shuffleArray(answers);
    answers = shuffleArray(answers);   

  }

  // 4. Заполнение кнопок ответов
  for (let i = 0; i < REQUIRED_OPTIONS; i++) {
    const qBtn = document.getElementById(`option${i}`);

    if (qBtn) {
      //qBtn.textContent = shuffled[i];
      qBtn.textContent = answers[i];
      qBtn.style.border = 'none';
      qBtn.disabled = false;
    } else {
      console.warn(`Элемент #option${i} не найден в DOM. Проверьте разметку.`);
    }
  }

   // 6. Обновление текста вопроса
  if (questionElement) {
    questionElement.textContent = questionBlock.question || 'Вопрос не указан';
  } else {
    console.error('Элемент questionElement не найден в DOM.');
  }

  // 7. Обновление счётчика вопросов
  //updateTeststatistics();

  questionCounter.textContent = `Вопрос: ${state.currentIndex + 1}/${currentTestLength}`; 

  //state.currentIndex++;

}




// function updateTeststatistics() { 

//     questionCounter.textContent = `Вопрос: ${state.currentIndex + 1}/${currentTestLength}`; 

// }


function shuffleArray(array) {
  const arr = [...array]; // создаём копию, чтобы не мутировать оригинал
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // обмен через деструктуризацию
  }
  return arr;
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

  const rightAnswersQuantity = questionsQuantity - errorsQuantity;

  const percent = Math.round(rightAnswersQuantity * 100 / questionsQuantity); 

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

    // const questionQuantity = Object.values(history)[0];
    //const mistakes = Object.values(history)[1];

   

    

    // if (!mistakes || typeof mistakes !== 'object') {
    //     console.error("Mistakes data is invalid");
    //     return;
    // }

    //const mistakesQuantity = Object.keys(mistakes).length;

    const mistakesQuantity = history.wrongAnswers.length;

    const questionQuantity = history.currentIndex + 1;

  

    const testState = questionQuantity === currentTestLength ? 'завершен' : 'остановлен';

    // if (mistakesQuantity === 0 && testState === 'завершен') {
    if (testState === 'завершен') {

      //тест пройден без ошибок
      if(mistakesQuantity === 0) {

        //document.getElementById('result').innerHTML = testSuccess;

        testResult.textContent = testSuccess;

        state.isMistakes = false;


        localStorage.removeItem(currentTest.id);
        return;

      } else {//есть ошибки

      

        state.isMistakes = true;

        state.currentIndex = 0;

        saveTestHistory();


      }


    }

   

    const testInfo = `<br>Тест ${testState}<br>Пройдено вопросов: ${questionQuantity} из ${currentTestLength}<br>`;

    const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, mistakesQuantity);

    const mistakesHeader = mistakesQuantity > 0 ? '<br>Ваши ошибки:<br>' : '';



    const resultHTML = `${testInfo}Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;

    //document.getElementById('result').innerHTML = resultHTML;

    testResult.innerHTML = resultHTML;

   
    // const quNumber = history.

    createMistakesButtons(mistakesQuantity, history.wrongAnswers);

    

}



function createMistakesButtons(mistakesQuantity, mistakes) {     
   
  
  if (!mistakeButtons) {
    console.error('Элемент с ID "errors" не найден в DOM');
    return;
  }

  mistakeButtons.replaceChildren();
   
  for (let i = 0; i < mistakesQuantity; i++) {    

    const btn = document.createElement('button');
    btn.id = `erBtn${i}`;
    btn.value = i;
    btn.dataset.questionIndex = mistakes[i][0];
    btn.dataset.userOption = mistakes[i][1];
    btn.className = 'error_button';   
    btn.textContent = i + 1;  
    mistakeButtons.appendChild(btn);

  }
}



function showSelectedMistake(btnId) {    

  const targetBtn = document.getElementById(btnId);

 // const btnValue = targetBtn.value;  

 //const testLength = getCurrentTestLength

  const btns = document.querySelectorAll(".error_button");

  btns.forEach(btn => {
    
    btn.style.background = "var(--main-bg-color)";

  });

  targetBtn.style.background = "var(--error-btn-color)"; 

  const questionIndex = targetBtn.dataset.questionIndex;   

  const questionBlock = testBases[currentTest.id].testBody[questionIndex];   

  divTest.classList.remove('hidden') ;

  fillQuestionBlock(questionBlock, false);  

  highlightOptions(targetBtn);  

  lockOptions(".option_button");

 
}

function highlightOptions(targetBtn) {

  const userAnswer = targetBtn.dataset.userOption;

  document.getElementById('option0').style.border = 'var(--right-answer-border)';

  document.getElementById('option' + userAnswer).style.border = 'var(--wrong-answer-border)';

}


// function highlightOptions(targetBtn, questionBlock) {
  
//     const userAnswer = targetBtn.dataset.userOption;
//     const correctAnswer = questionBlock.correctAnswer; // Предполагаемое поле

//     // Сброс предыдущих выделений
//     document.querySelectorAll('.option').forEach(el => {
//         el.classList.remove('correct', 'wrong');
//     });

//     // Подсвечиваем правильный ответ
//     const correctEl = document.getElementById(`option${correctAnswer}`);
//     if (correctEl) {
//         correctEl.classList.add('correct');
//     }

//     // Подсвечиваем выбранный ответ
//     const userEl = document.getElementById(`option${userAnswer}`);
//     if (userEl && userAnswer !== correctAnswer) {
//         userEl.classList.add('wrong');
//     }
// }




function lockOptions(selector) {

  document.querySelectorAll(selector).forEach(node => {
    node.disabled = true;
  });
}


function getCurrentQustionBlock(questionIndex) {
  
  const questionBlock = testBases[currentTest.id].testBody[questionIndex];

  return questionBlock;

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

    

    if(state.currentIndex === 1 || !isAnswerDone) {


      alert("уровни")
    

      showLevels();    
      return;
    
    } 


    clearTestState();
    
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

  
  

})

button_next.addEventListener("click", function() {

 // updateQuestionBlock();

  //const data = testBases[testId].testBody[state.currentIndex];

  const questionBlock = getCurrentQustionBlock(state.currentIndex);

  fillQuestionBlock(questionBlock, true)

  document.getElementById('button_next').style.display = "none";

})



function saveTestHistory() {     

  localStorage.setItem(currentTest.id, JSON.stringify(state)); 

  //state.currentIndex++;

}

function clearTestState() {

  state.currentIndex = 0;
  state.wrongAnswers = [];
  state.isMistakes = false;

};



function check(btnId) {  

   let questionBlock = getCurrentQustionBlock(state.currentIndex);
  
  //обработка ошибок
  if(state.isMistakes) {   
    
     let qIndex = state.wrongAnswers[state.currentIndex][0];

     el = [qIndex, optionIndex]; 


    let idx = state.wrongAnswers.findIndex(item => item[0] == state.currentIndex);

    

    //не прав
    if(optionIndex != 0){

      

      // if(idx < 0) {
        
      //   if(optionIndex != 0){

      //     state.wrongAnswers.push(el)

      //   } else {

      //     state.wrongAnswers.splice(idx, 1, el)

      //   }

      
      
      state.wrongAnswers.splice(idx, 1, el)

      

      //state.currentIndex++;


    //прав
    }else{

       

       // state.wrongAnswers.splice(idx, 1);

      state.wrongAnswers.splice(state.currentIndex, 1);

      // if(state.currentIndex > 0) {

      //   state.currentIndex--;


      // }
      
      currentTestLength--;

      

      

      if(state.wrongAnswers.length <= 0) {

          

          //state.currentIndex = 0;

          saveTestHistory();    
      
          showResultsPage();

          showTestResult();   

         // saveTestHistory();
         

         

          return;

        }


       // state.currentIndex = 0;


    }

      //state.currentIndex++;

    //  saveTestHistory();


   
  
  } else { 

    const correctAnswer = questionBlock.answers[0];

    const userAnswer = document.getElementById(btnId).textContent;     

    if(userAnswer !== correctAnswer){        

      const userAnswerIndex = questionBlock.answers.indexOf(userAnswer);

      const el = [state.currentIndex, userAnswerIndex];

      state.wrongAnswers.push(el); 
  
    };

    saveTestHistory();

    state.currentIndex++;

  }

  if (state.currentIndex === currentTestLength ) {    
 
    showResultsPage();

    showTestResult();   ;

    state.isMistakes = false;

    return;

  } 


  // if (tglLearnMode.checked === true && optionIndex != rightOptionIndex) { 

  //   setTrainingMode(optionIndex);

  //   currentIndex++;

  //   return;

  // } 

  questionBlock = getCurrentQustionBlock(state.currentIndex);

  fillQuestionBlock(questionBlock, true);
 
}


function correctMistakes(){





}


function showMainPage() {

  const elementsToHide = [
    divLevels,
    divTest,
    navBlock,
    testResult,
    resultBlock, 
    counterBlock,
    mainPage    
  ];

  elementsToHide.forEach(element => {
    element.classList.add('hidden');
  });

  mainPage.classList.remove('hidden');

 

}

function showLevels() { 

  //alert('show lev')

  const elementsToHide = [
    
    btnHome,
    navBlock,    
    divTest,
    resultBlock,
    questionCounter
    

  ];

  const elementsToShow = [

    divLevels,
    btnMenu,
    headerBlock

  ];

  

   mistakeButtons.textContent = "";
   testTitle.textContent = "";

  

  elementsToHide.forEach(element => {
    element.classList.add('hidden');
  });

  elementsToShow.forEach(element => {
    element.classList.remove('hidden');
  });

  



 // btnHome.style.display = "none";
 // navBlock.style.display = "none";


 //divLevels.style.display = "block";
  // document.getElementById('mistakeButtons').innerHTML = "";
  // document.getElementById('test-title').innerHTML = "";
 // document.getElementById('results').style.display = "none";

  //divTest.style.display = "none";
 // btnMenu.style.display = "block";
 // headerBlock.style.display = "block";

  //document.getElementById('counter').style.display = "none";
 



}

function showTest() {

  document.getElementById('questions_counter').style.display = 'block';
  //divLevels.style.display = "none";

  divLevels.classList.add('hidden');

  document.getElementById('counter').style.display = "block";
}




  //if(event.target.className !== "test_button") return; 

  //currentTest.id = event.target.id;  
  


  document.addEventListener("click", function(event) {

    const id = event.target.id;

    const classNamed = event.target.className;

    if(classNamed == "test_button") {   
      
    
      if(id == "tempRemove") {

        clearHistory();

      } else {      

       // alert()

        currentTest.id = id;

        chooseTest(id, event.target.textContent);          
        
      }

    } 

    if (classNamed == "error_button") {     

      showSelectedMistake(id);

    }

    if (classNamed == "option_button") {

      check(id);

      isAnswerDone = true;

    }

  
  })


function getNextIndex(history) {
  
  if (!history) return 0;

  if (history.isMistakes) {
    return history.wrongAnswers[0][0];
  }
  
  return history.currentIndex;   
}

function getCurrentTestLength(testId, history){   

  if (!history || !history.isMistakes) {
    return testBases[testId].testBody.length;
  }

  if (history.isMistakes && history.wrongAnswers) {
    return history.wrongAnswers.length;
  }
}



function chooseTest(testId, testName) {  

  const history = getTestHistory(testId);   

  currentTestLength = getCurrentTestLength(testId, history);
 
  state.currentIndex = getNextIndex(history);
   
  // if (tglShuffle.checked) {

  //   shuffle(currentTest.test);

  //   currentTest.id += '$';

  // } else if (tglLearnMode.checked) {

  //   currentTest.id += '*';
  
  // }    
 
  showChosenTest(testName);   

  const questionBlock = getCurrentQustionBlock(state.currentIndex);

  fillQuestionBlock(questionBlock, true); 

}



function showResultsPage() {
  
  btnHome.style.display = "block";
  document.getElementById('button_next').style.display = "none";
  document.getElementById('results').style.display = 'block';
  //divTest.style.display = "none";

  divTest.classList.add('hidden');

  //document.getElementById('result').style.display = "block";
  testResult.style.display = "block";
  document.getElementById('counter').style.display = "none"; 
  btnHome.innerText = "На главную";

}

function showChosenTest(testName) {
  
  divTest.classList.remove('hidden');
  // document.getElementById('counter').innerHTML = "Вопрос: 1/" + currentTestLength;
  // document.getElementById('counter').style.display = "block";
  questionCounter.textContent = `Вопрос: 1/"${currentTestLength}`;
  questionCounter.style.display = "block";


  document.getElementById('questions_counter').style.display = 'block';


  divLevels.classList.add('hidden');


  navBlock.style.display = "block";



  document.getElementById('button_next').style.display = "none";

  btnHome.innerText = "Завершить";
  btnHome.style.display = "block";


  btnMenu.style.display = "none";
  document.getElementById('test-title').innerHTML = testName;
  headerBlock.style.display = "none";
 

}

//////////////////////////////////////////////////////////////////////list///////////////////

//const testTitle = document.getElementById('test-title');

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
  
