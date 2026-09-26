'use strict';

//const { createElement } = require("react");


let currentFontSize = 20; 

function increaseFontSize() { 
  

  const newFontSize = currentFontSize + 1; 
  setFontSize(newFontSize);

}

function decreaseFontSize() { 
  const newFontSize = currentFontSize - 1;
  setFontSize(newFontSize);

}

function defaultFontSize() {  
  setFontSize(20)
}


function setFontSize(fontSize) {

  const MIN_FONT_SIZE = 17;
  const MAX_FONT_SIZE = 23;

  if (fontSize > MAX_FONT_SIZE || fontSize < MIN_FONT_SIZE) return;

  // if(fontSize > 23 || fontSize < 17) return;  

  docBody.style.setProperty("--btn-font-size", `${fontSize}px`);
 
  lbFontSizeSample.style.fontSize = `${fontSize}px`;

  currentFontSize = fontSize;
}


btnIncreaseFontSize.addEventListener('click', increaseFontSize);

btnDecreaseFontSize.addEventListener('click', decreaseFontSize);

btnDefaultFontSize.addEventListener('click', defaultFontSize);



btnMenu.addEventListener("click",() => toggleSettingsPage());

// const handleMenuClick = () => {

//   //toggleSettingsPage();

//  // removeButtons();

//   //createDefaultTestsSelector();

//  //console.log("main")

//   toggleSettingsPage();
  
// };






btnRemoveHistory.addEventListener("click",  clearHistory);

btnRemoveCache.addEventListener("click",  clearCache);

btnRemoveSettings.addEventListener("click",  removeSettings);

btnShowHelp.addEventListener("click",  showHelpPage);

//btnSaveSelectedTests.addEventListener("click",  saveSelectedTests);

btnShowProfilePage.addEventListener('click', () => toggleProfilePage());

//btnGoBack.addEventListener("click",  () => toggleProfilePage());

btnGoBack.addEventListener('click', function() {
  toggleProfilePage();
  divDefaultTestSelectionBlock.classList.add('hidden'); // скрываем визуально
});


btnMainOpenProfilePage.addEventListener('click', function() {
  toggleProfilePage();
  divDefaultTestSelectionBlock.classList.add('hidden'); // скрываем визуально
});


function ShowMainOpenProfilePageButton() {

  // const btn = document.getElementById('settings-page-button');
  if (btnMainOpenProfilePage) {
    divDefaultTestSelectionBlock.classList.remove('hidden');
  }
}



function clearCache(){   

  caches.open('offline-cache-v1').then(cache => {
    cache.keys().then(keys => {
      keys.forEach(request => {
        cache.delete(request);
      });
    });
  });
}

function clearHistory() {  

  for(let i = 0; i < localStorage.length; i++){
    
    if(localStorage.key(i) === "settings") continue

    localStorage.removeItem(localStorage.key(i));

  }

}

// function saveSelectedTests(){

//   const checkedCheckBoxes = getSelectedValues(divChooseProfiles);    

//   if(!checkedCheckBoxes.length ) {

//     console.log('Не выбрано')

//   }else{

//     const settings = JSON.parse(JSON.stringify(defaultSettings));

//     let testsList = [];


//     checkedCheckBoxes.forEach(element => {

//       testsList.push(element)

//       //console.log(element)
      
//     });

//     settings.selectedTests = testsList;

//     saveSettings(settings);


//     console.log(settings.selectedTests[0])



//   }

// }

window.addEventListener('load', () => {

  checkSettingsAndApply();
  

  // const settings = localStorage.getItem('settings');
  // let savedSettings = null;

  // // 2. Безопасный парсинг
  // if (settings) {
  //   try {
  //     savedSettings = JSON.parse(settings);
  //     console.log('Настройки загружены из localStorage');
  //   } catch (e) {
  //     console.error('Ошибка парсинга настроек, сбрасываем на дефолт', e);
  //     savedSettings = null;
  //   }
  // }

  // // 3. Единая логика применения настроек
  // if (savedSettings && Array.isArray(savedSettings.selectedTests)) {
  //   if (savedSettings.selectedTests.length === 0) {
  //     createDefaultTestsSelector();
  //   } else {
  //     createTestsSelector(savedSettings.selectedTests);
  //   }
  //   setSettings(savedSettings);
  // } else {
  //   // Нет настроек или они битые — применяем дефолт
  //   setSettings(defaultSettings);
  //   saveSettings(defaultSettings); // сохраняем дефолт, чтобы дальше было с чем работать
  //   createDefaultTestsSelector();
  // }

  showMainPage();
});


function updateSettingsButtonVisibility(isVisible) {
  // const btn = document.getElementById('settings-page-button');
  // if (!btn) return;

  if (isVisible) {
    btnMenu.classList.remove('hidden');
  } else {
    btnMenu.classList.add('hidden');
  }
}


function checkSettingsAndApply() {

  const settings = localStorage.getItem('settings');
  let savedSettings = null;

  // 2. Безопасный парсинг
  if (settings) {
    try {
      savedSettings = JSON.parse(settings);
      console.log('Настройки загружены из localStorage');
    } catch (e) {
      console.error('Ошибка парсинга настроек, сбрасываем на дефолт', e);
      savedSettings = null;
    }
  }

  // 3. Единая логика применения настроек
  if (savedSettings && Array.isArray(savedSettings.selectedTests)) {
    if (savedSettings.selectedTests.length === 0) {
      //createDefaultTestsSelector();
      ShowMainOpenProfilePageButton();


    } else {
      createTestsSelector(savedSettings.selectedTests);
    }
    setSettings(savedSettings);
  } else {
    // Нет настроек или они битые — применяем дефолт
    setSettings(defaultSettings);
    saveSettings(defaultSettings); // сохраняем дефолт, чтобы дальше было с чем работать

    //createDefaultTestsSelector();
    ShowMainOpenProfilePageButton();
  }

}



// window.addEventListener("load", ()=>{  

 

//   removeButtons(); 


//  const isSettings = localStorage.getItem('settings');

//  let savedSettings;

  
//   if(isSettings) {   

//     console.log('настройки есть');

//     savedSettings = JSON.parse(localStorage.getItem('settings'));

//     if(savedSettings.selectedTests.length === 0){

//       createDefaultTestsSelector();      

//     }else{

//       createTestsSelector(savedSettings.selectedTests);     

//     }
    
    
//     setSettings(savedSettings);  

        
//   } else {

    
//     setSettings(defaultSettings); 

//     saveSettings(defaultSettings);

//     createDefaultTestsSelector();
    
//   }    
  

//   showMainPage();
  
// });

//лечение выхода из приложения при нажании кнопки назад в андроид
window.addEventListener('load', function() {
    window.history.pushState({}, '')
});
  
window.addEventListener('popstate', function() {   
    btnHome.click();    
    window.history.pushState({}, '')
});



// tglLevel5.addEventListener('change', function() {   
//   setRankToggles('rank5')  
// });

// tglLevel6.addEventListener('change', function() {  
//   setRankToggles('rank6')  
// });


// const testsList = {
   
//   rank5 : { 
//     st5_1 : [test_5s_block_1, "5p Стандарт 1"],
//     st5_2 : [test_5s_block_2, "5p Стандарт 2"],
//     ex5 : [test_5ex, "5р эксперт"],
//     ot_1 : [test_ot_block_1, "Охрана труда 1"],
//     ot_2 : [test_ot_block_2, "Охрана труда 2"],
//     ot5_2025 : [test_otrp, "ОT 2025"],
//   },    
    
//   rank6 : {      
//     st6_1 : [test_6s_block_1, "6p Стандарт 1"],
//     st6_2 : [test_6s_block_2, "6p Стандарт 2"],
//     st6_3 : [test_6s_block_3, "6p Стандарт 3"],
//     st6_4 : [test_6s_block_4, "6p Стандарт 4"],
//     ex6 : [test_6e_block_1, "6р Эксперт"],
//     ot_1 : [test_ot_block_1, "Охрана труда 1"],
//     ot_2 : [test_ot_block_2, "Охрана труда 2"],
//     ot6_2025 : [test_otrp, "ОT 2025"],
//     tmp : [temp, "TEMP"],  
//   },

// }

// function createDefaultTestsSelector() { 

//   const button = document.createElement('button'); 
//   button.className = 'test-button';
//   button.textContent = 'Выбрать тесты'; 
//   button.id = 'testProfileSelectorButton'

//   button.addEventListener('click', function() {   

//     toggleProfilePage(); 
//     this.classList.add('hidden'); // скрываем визуально

//   });

//   divTestsSelector.appendChild(button);  
// }


function createTestsSelector(selectedTests){  



  selectedTests.forEach((item) => { 

    //console.log(testBases)

    const text = testBases[item].testTitle

    const id = testBases[item].testId

    const testButton = createTestButton(id, text);
   
    testButton.addEventListener('click', testButtonClick);

    divTestsSelector.appendChild(testButton);   

 });

  // Object.keys(testsBases).forEach(key => {   
    
  //   const testButton = createTestButton(key, testsBases[key].testTitle);

  //   //button.addEventListener('click', testButtonClick); 

  //   divTestsSelector.appendChild(testButton);

  // });

  
 
  // testButtonsContainer.classList.add('hidden');
}

// function createTestButton(id, textContent, clickFunction){
function createTestButton(id, textContent){

 // console.log(id)

  const button = document.createElement('button');   
  button.id = id;
  button.className = "test-button";     
  button.textContent = textContent;
 // button.addEventListener('click', clickFunction);  
  return button;

}

const toggleProfilePage = () => {
  const isProfileHidden = divProfilePage.classList.contains('hidden');
  let isVisible;

  // Переключаем явно: если был скрыт — показываем, и наоборот
  if (isProfileHidden) {
    divProfilePage.classList.remove('hidden');
    divMainSettings.classList.add('hidden');
    //btnMenu.classList.add('hidden');
    // updateSettingsButtonVisibility(false);
    isVisible = false;

    createProfilesList();

  } else {
    divProfilePage.classList.add('hidden');
    divMainSettings.classList.remove('hidden');
    //btnMenu.classList.remove('hidden');

    // updateSettingsButtonVisibility(true);
    isVisible = true;

   
  }

  updateSettingsButtonVisibility(isVisible);
};






// btnShowProfilePage.addEventListener('click', () => togglePage(true));




// function hideProfilePage() {

//    const elementsToHide = [
//     divProfilePage     
//   ]

//   const elementsToShow = [ 
//     divMainSettings,      
//     btnMenu, 
//   ]

//   showHidePages(elementsToShow, elementsToHide);

// }

// function showProfilePage() {

//    const elementsToHide = [       
//     divMainSettings,      
//     btnMenu    
//   ]

//   const elementsToShow = [ 
//    divProfilePage
//   ]
  
 

//   showHidePages(elementsToShow, elementsToHide);

// }

function showMainPage() {

  const elementsToHide = [
    
    testButtonsContainer,
    navigationContainer,
    testResultsContainer,
    questionsCounter,
    helpSection,
    listPageContainer,
    divMainSettings,
    divProfilePage   
      
  ];

  const elementsToShow = [    
    
    divTestsSelector,
    //btnMenu

    
  ];

  updateSettingsButtonVisibility(true)

  // hideElements(elementsToHide);

  // showElements(elementsToShow); 

  showHidePages(elementsToShow, elementsToHide);

  //removeButtons();  

  //createLevelsButtons(testBases); 

  pTestTitle.textContent = "";

  

}

function showResultsPage() {  

  const elementsToHide =[
    testButtonsContainer,
    pQuestionsCounter
  ]

  const elementsToShow =[   
    divHome,
    testResultsContainer
  ]


  // hideElements(elementsToHide);
  // showElements(elementsToShow);

  showHidePages(elementsToShow, elementsToHide);

  btnHome.textContent = "На главную";
  btnHome.value = "mainpage";

}

  

function showChosenTest(testName, counterText) {
  const elementsToHide = [
    divTestsSelector,
    // divMenuButton,    
    divNext,
    //btnMenu
  ]



  const elementsToShow = [ 
    testButtonsContainer,
    pQuestionsCounter,
    questionsCounter,
    navigationContainer,
    divHome   
  ]

  // hideElements(elementsToHide);
  // showElements(elementsToShow);  

  showHidePages(elementsToShow, elementsToHide);

  updateSettingsButtonVisibility(false)

  

  //showHidePages();

  //console.log('тест выбран');
 

  renderQuestionCounter(counterText);

  pTestTitle.textContent = testName;
  btnHome.textContent = "Завершить";
  btnHome.value = "complite";

  // console.log('меню скрыто')
}


function showHidePages(arrayToShow, arrayToHide){
 
  arrayToShow.forEach(element => {
      element.classList.remove('hidden');
  });
   arrayToHide.forEach(element => {
      element.classList.add('hidden');
  });


   
}



function createProfilesList(){

  

  while (divChooseProfiles.firstChild) {
    divChooseProfiles.removeChild(divChooseProfiles.firstChild);
  }

  // testBases.forEach(key => {
  Object.keys(testBases).forEach(key => {
    // Создаём контейнер для чекбокса и подписи
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '10px';

    // Создаём сам чекбокс
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = testBases[key].testTitle;
    checkbox.dataset.feature = testBases[key].testId;

    const id = testBases[key].testId.toString()
    

    // Сразу вешаем слушатель на этот конкретный input
    checkbox.addEventListener('change', checkboxChange)
      // {
      // const value = checkbox.checked;
      // console.log('Изменение:', key, value);

      // Сохранение
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');

    //console.log(testBases[key].testId)

    let checkedState = settings.selectedTests.indexOf(id);

    //console.log(checkedState)

    if(checkedState != -1){

      checkbox.checked = true;

    }

      // settings[key] = value;
      // localStorage.setItem('myAppSettings', JSON.stringify(settings));

      
    //});

    //console.log(testBases[key].testId)

    // Добавляем текст подписи
    const text = document.createTextNode(testBases[key].testTitle);

    // Собираем элементы вместе
    label.appendChild(checkbox);
    label.appendChild(text);
    divChooseProfiles.appendChild(label);
  });


}


function checkboxChange(e) {
  const el = e.target;
  const id = el.dataset.feature;
  const isChecked = el.checked;

 // console.log('Чекбокс:', id, 'Значение:', isChecked);

  // Получаем настройки, по умолчанию — пустой объект
  let settings = JSON.parse(localStorage.getItem('settings') || '{}');

  // Гарантируем, что selectedTests — это массив
  if (!Array.isArray(settings.selectedTests)) {
    settings.selectedTests = [];
  }

  if (isChecked) {
    // Добавляем только если ещё нет (защита от дублей)
    if (!settings.selectedTests.includes(id)) {
      settings.selectedTests.push(id);
    }
  } else {
    const index = settings.selectedTests.indexOf(id);
    if (index !== -1) {
      settings.selectedTests.splice(index, 1);
    }
    // Если index === -1 — значит, элемента не было, ничего не делаем
  }

  localStorage.setItem('settings', JSON.stringify(settings));

  settings = JSON.parse(localStorage.getItem('settings') || '{}');



  if(settings.selectedTests.length === 0){

    //показать кнопку выбора тестов

    console.log('тесты отсутствуют, чекбокс выбран')

    //createDefaultTestsSelector();

    ShowMainOpenProfilePageButton();


  }else{

    //показать кнопки выбранных тестов

    //document.getElementById('testProfileSelectorButton').remove();

    //deleteButton()

    console.log('тесты в наличии')

    createTestsSelector(settings.selectedTests);
    

  }

  


}



function getSelectedValues(container) {
  //nst container = document.getElementById(containerId);
  const checkedCheckboxes = container.querySelectorAll('input[type="checkbox"]:checked');
  const selectedValues = Array.from(checkedCheckboxes).map(cb => cb.value);
  return selectedValues;
}



function removeButtons() {    
  divTestsSelector.innerHTML = '';  
}

function showSettingsPage() {
  divMainSettings.classList.remove('hidden');
  divTestsSelector.classList.add('hidden');
  divDefaultTestSelectionBlock.classList.add('hidden');
}

function hideSettingsPage() {
  divMainSettings.classList.add('hidden');
  divTestsSelector.classList.remove('hidden'); 
  //divDefaultTestSelectionBlock.classList.add('hidden'); 
 
  
  removeButtons();
  checkSettingsAndApply();
}

const toggleSettingsPage = () => {

  const isSettingsHidden = divMainSettings.classList.contains('hidden');
  if (isSettingsHidden) {
    showSettingsPage();
  } else {
    hideSettingsPage();
  }
};





function removeSettings() {  
  localStorage.removeItem("settings");  
  setSettings(defaultSettings);


}


function hideHelpPage() {
  helpSection.classList.add('hidden'); 
}

function showHelpPage() {
  helpSection.classList.remove('hidden'); 
  showHideMenu();
}


function saveSettings(settings){  

  // const settings = {

  //   isLearnMode : tglLearnMode.checked, 
  //   isDarkTheme : tglTheme.checked,   
  //   fontSize : currentFontSize,
  //   selectedTests : []

  // }  

  localStorage.setItem('settings', JSON.stringify(settings));
}

function updateTheme(isDark) {
  tglTheme.checked = isDark;

  //console.log(isDark)
  docBody.className = isDark ? 'dark-theme' : 'light-theme';
}

function updateLearnMode(isLearn) {
  tglLearnMode.checked = isLearn;
}

function updateFontSize(size) {
  currentFontSize = size;
  docBody.style.setProperty('--btn-font-size', `${size}px`);
}

function setSettings(settings) {

  //console.log(settings.isDarkTheme)

  if (!tglTheme || !tglLearnMode || !docBody) return;

  //console.log(settings)



  updateTheme(settings.isDarkTheme);
  updateLearnMode(settings.isLearnMode);
  updateFontSize(settings.fontSize);
  //createTestsSelector(selectedTests, )
}


// function setSettings(settings) {

//   tglTheme.checked = settings.isDarkTheme;  
//   tglLearnMode.checked = settings.isLearnMode;   
//   currentFontSize = settings.fontSize; 

//   docBody.style.setProperty("--btn-font-size", `${settings.fontSize}px`);
//   let theme;
//   tglTheme.checked === true  ? theme = 'dark-theme' : theme = 'light-theme';  
  
//   docBody.className = theme;

// }


// function setRankToggles(rank){  

//   tglLevel6.checked = rank === 'rank6';
//   tglLevel5.checked = rank !== 'rank6';
//   defaultRank = rank;

//   // const isRank6 = rank === 'rank6';
//   // lev6Toggle.checked = isRank6;
//   // lev5Toggle.checked = !isRank6;
//   // defaultRank = rank;

// }

const defaultSettings = {
  isLearnMode : false, 
  isDarkTheme : false,   
  fontSize : 20,
  selectedTests : []
}

