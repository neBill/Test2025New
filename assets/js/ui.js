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

//const testSuccess = "<br>Тест успешно пройден!<br>Результат - 100%";
//let mistakes = {};
let currentTestLength;
//let curQuestionNumber;

const divNavigation = document.getElementById('navigation-block');
const divLevels = document.getElementById('levels-buttons-block');
const divTestButtons = document.getElementById('test-buttons-block');
const btnMenu = document.getElementById('button-menu');
const headerBlock = document.getElementById('header-block');
const listBlock = document.getElementById('list-block');
const tglLearnMode = document.getElementById('learn-mode-toggle');
const tglShuffle = document.getElementById('shuffle'); 
const questionElement = document.getElementById('question');
const questionsCounter = document.getElementById('questions-counter');
const pTestResult = document.getElementById('test-result');
const divTestResult = document.getElementById('test-result-block');
//const mistakeButtons = document.getElementById('mistakeButtons');  
const lev5Toggle = document.getElementById('lev5');
const lev6Toggle = document.getElementById('lev6');

const shuffleToggle = document.getElementById('shuffle');
// const learnModeToggle = document.getElementById('learn_mode');
const divDropdownMenu = document.getElementById("dropdown-menu-block");
const divMenuButton = document.getElementById("menu-button-block");

const divNext = document.getElementById("button-next-block");
const divHome = document.getElementById('button-home-block');

const btnNext = document.getElementById("button-next");
const btnHome = document.getElementById('button-home');

const divHelp = document.getElementById("help-block");
const btnIncreaseFontSize = document.getElementById('font-increase');
const btnDecreaseFontSize = document.getElementById('font-decrease');
const btnDefaultFontSize = document.getElementById('font-default');
const fontSizeSample = document.getElementById('font-size-sample');
const themeToggle =  document.getElementById('theme'); 

//const mainPage = document.getElementById('main_page');

const questionsCounterBlock = document.getElementById('questions-counter-block');

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

  questionsCounter.textContent = `Вопрос: ${state.currentIndex + 1}/${currentTestLength}`; 

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
   

    const mistakesQuantity = history.wrongAnswers.length;

    const questionQuantity = history.currentIndex + 1;
  

    const testState = questionQuantity === currentTestLength ? 'завершен' : 'остановлен';



    // if (mistakesQuantity === 0 && testState === 'завершен') {
    if (testState === 'завершен') {

      //тест пройден без ошибок
      if(mistakesQuantity === 0) {

        //document.getElementById('result').innerHTML = testSuccess;

        pTestResult.textContent = "Тест успешно пройден! Результат - 100%";

        state.isMistakes = false;


        localStorage.removeItem(currentTest.id);
        return;

      } else {//есть ошибки

      

        state.isMistakes = true;

        state.currentIndex = 0;

        saveTestHistory();


      }


    }

    const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, mistakesQuantity);


    const mistakesHeader = mistakesQuantity > 0 ? 'Ваши ошибки:' : '';



    //const result = `${testInfo}Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;


    const testInfo = [
      
      `Тест ${testState}`,
      `Пройдено вопросов: ${questionQuantity} из ${currentTestLength}`,
      `Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)`,
      `${mistakesHeader}`

    ]

    divTestResult.innerHTML = '';
    
    testInfo.forEach(text => {

      const line = document.createElement('p');
      line.textContent = text;
      line.className = "p-result";     
      divTestResult.appendChild(line);

    })
    

    

    // const mistakesHeader = mistakesQuantity > 0 ? '<br>Ваши ошибки:<br>' : '';



    // const result = `${testInfo}Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;
    

   

   

    // const testInfo = `<br>Тест ${testState}<br>Пройдено вопросов: ${questionQuantity} из ${currentTestLength}<br>`;

    

    // const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, mistakesQuantity);

    // const mistakesHeader = mistakesQuantity > 0 ? '<br>Ваши ошибки:<br>' : '';



    // const result = `${testInfo}Правильных ответов: ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)${mistakesHeader}`;

    //document.getElementById('result').innerHTML = resultHTML;

   // pTestResult.textContent = result;

   
    // const quNumber = history.

    //alert()

    createMistakesButtons(mistakesQuantity, history.wrongAnswers);

    

}



function createMistakesButtons(mistakesQuantity, mistakes) {     
   
  
  const mistakeButtons = document.createElement('p');
   
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

  divTestResult.appendChild(mistakeButtons);


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

  divTestResult.classList.remove('hidden');

  divTestButtons.classList.remove('hidden');

  //alert(questionBlock)

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


//переход на главную страницу, нажата кнопка На главную или Завершить
btnHome.addEventListener("click", function(event) {

    //showLevels();


  const buttonText = event.target.textContent

  if (buttonText == "Завершить") {
    

    if(state.currentIndex === 1 || !isAnswerDone) {

      showMainPage();      
      
      return;
    
    } 


    clearTestState();
    
    showResultsPage();

    

    showTestResult();



    

  }

  if (buttonText == "На главную") { 

    isAnswerDone = false;

    showMainPage();

  }

   



  if(tglShuffle.checked) {

    localStorage.removeItem(currentTest.id);

    currentTest.id = '';

  }

  
  

})

btnNext.addEventListener("click", function() {

 // updateQuestionBlock();

  //const data = testBases[testId].testBody[state.currentIndex];

  const questionBlock = getCurrentQustionBlock(state.currentIndex);

  fillQuestionBlock(questionBlock, true)

  btnNext.classList.add('hidden');

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

  //alert()

  const elementsToHide = [
    
    divTestButtons,
    divNavigation,
    divTestResult,
    //resultBlock, 
    questionsCounterBlock,
    divHelp,
    listBlock,
    divDropdownMenu,
    
      
  ];

  const elementsToShow = [
    
    divMenuButton,
    divLevels
    
  ];

  hideElements(elementsToHide);

  showElements(elementsToShow); 

  removeButtons();

  createLevelsButtons(); 

  testTitle.textContent = "";

}

// function showLevels() { 

//   //alert('show lev')

//   const elementsToHide = [
    
    
//     navBlock,    
//     divTest,
//     resultBlock,
//     questionsCounterBlock,
    
    

//   ];

//   const elementsToShow = [

//     divLevels,
//     divMenuButton,
//     headerBlock

//   ];

//   hideElements(elementsToHide);

//   showElements(elementsToShow);

  

//    mistakeButtons.textContent = "";
//    testTitle.textContent = "";

  
// }


// function showTest() {

//   questionsCounterBlock.classList.remove('hidden');

  

//   divLevels.classList.add('hidden');

  



// }




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
    
    //alert()

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

  const elementsToHide =[

    divTestButtons,
    questionsCounter

  ]

  const elementsToShow =[

   
    divHome,
    divTestResult

  ]


  hideElements(elementsToHide);

  showElements(elementsToShow);

  btnHome.textContent = "На главную";

}


function hideElements(elementsArray){

  elementsArray.forEach(element => {
      element.classList.add('hidden');
  });

   
}

function showElements(elementsArray){  

  elementsArray.forEach(element => {
    element.classList.remove('hidden');
  });

}



function showChosenTest(testName) {

  const elementsToHide = [

    divLevels,
    divMenuButton,
    
    divNext

  ]

  const elementsToShow = [  

    divTestButtons,
    questionsCounter,
    questionsCounterBlock,
    divNavigation,
    divHome
    

  ]

  hideElements(elementsToHide);

  showElements(elementsToShow);

  questionsCounter.textContent = `Вопрос: 1/"${currentTestLength}`;
  testTitle.textContent = testName;
  btnHome.textContent = "Завершить";
 

}

//////////////////////////////////////////////////////////////////////list///////////////////



testTitle.addEventListener("click", list)

function list() {

  //alert()



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
 



  listBlock.classList.remove('hidden');

  questions = []

}  
  

const btnHideList = document.getElementById('btn-hide-list')

btnHideList.addEventListener("click", hideListBlock)

function hideListBlock() {

  
  listBlock.classList.add('hidden');

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
  
