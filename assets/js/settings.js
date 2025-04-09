'use strict';

const lev5Toggle = document.getElementById('lev5');
const lev6Toggle = document.getElementById('lev6');
const themeToggle =  document.getElementById('theme'); 
const shuffleToggle = document.getElementById('shuffle');
const learnmodeToggle = document.getElementById('learn_mode');
const divDropdownMenu = document.getElementById("drop-down-menu");
const divHelp = document.getElementById("help_block");
const divTestsButtons = document.getElementById('levels');
const btnIncreaseFontSize = document.getElementById('font-increase');
const btnDecreaseFontSize = document.getElementById('font-decrease');
const btnDefaultFontSize = document.getElementById('font-default');
const fontSizeSample = document.getElementById('fontsizeSample');



let currentFontSize;

//let isDarkTheme = false;

// if (buttonClass == "font-size-change") {

//   chageFontSize(buttonId);
// }

function increaseFontSize() {

  // const bodyStyles = window.getComputedStyle(document.body);

  // const currentFontSize = bodyStyles.getPropertyValue('--btn-font-size'); //get

  //const newFontSize = (parseFloat(currentFontSize) + 1).toFixed(2); 
  const newFontSize = currentFontSize + 1; 

  setFontSize(newFontSize);

}

function decreaseFontSize() {

  // const bodyStyles = window.getComputedStyle(document.body);

  // const currentFontSize = bodyStyles.getPropertyValue('--btn-font-size'); //get   

  //const newFontSize = (parseFloat(currentFontSize) - 1).toFixed(2);

  const newFontSize = currentFontSize - 1;

  setFontSize(newFontSize);

}

function defaultFontSize() {

  //const bodyStyles = window.getComputedStyle(document.body);

  //const currentFontSize = bodyStyles.getPropertyValue('--btn-font-size'); //get

  setFontSize(20)

}


function setFontSize(fontSize) {


  //alert(fontSize)

  if(fontSize > 23 || fontSize < 17) return;

  //const bodyStyles = window.getComputedStyle(document.body);

  //const currentFontSize = bodyStyles.getPropertyValue('--btn-font-size'); //get

  document.body.style.setProperty("--btn-font-size", `${fontSize}px`);

  // document.getElementById('fontsize').style.fontSize = `${fontSize}`;
  fontSizeSample.style.fontSize = `${fontSize}`;

  currentFontSize = fontSize;

  //localStorage.setItem('size', newSize);


}




btnIncreaseFontSize.addEventListener('click', increaseFontSize);

btnDecreaseFontSize.addEventListener('click', decreaseFontSize);

btnDefaultFontSize.addEventListener('click', defaultFontSize);



// function chageFontSize(buttonId){  

//   // const bodyStyles = window.getComputedStyle(document.body);

//   // const oldSize = bodyStyles.getPropertyValue('--btn-font-size'); //get

//   // let newSize = 20;    

//   if(buttonId == "font-increase"){  

//     newSize = (parseFloat(oldSize) + 1).toFixed(2);       
//   }

//   if(buttonId == "font-decrease"){

//     newSize = (parseFloat(oldSize) - 1).toFixed(2);
//   }   

//   if(newSize <= 23 && newSize >= 17){

//     document.body.style.setProperty("--btn-font-size", `${newSize}px`);//set

//     document.getElementById('fontsize').style.fontSize = `${newSize}`;

//     localStorage.setItem('size', newSize);
//   }
// }




function clearCaches(){   

  caches.open('s-app-v1').then(cache => {
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


window.addEventListener("load", ()=>{  

  //set saved  settings
  if(localStorage.getItem('settings')) {   

    setSettings(JSON.parse(localStorage.getItem('settings')));  
        
  } else {

    //set end save default settings
    setSettings(defaultSettings);  
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
    
  }    
 
  createTestButtons();
  
});

//лечение выхода из приложения при нажании кнопки назад в андроид
window.addEventListener('load', function() {

    window.history.pushState({}, '')
});
  
window.addEventListener('popstate', function() {
   
    btnHome.click();
    
    window.history.pushState({}, '')
});



lev5Toggle.addEventListener('change', function() {   

  setRankToggles('rank5')
  
});

lev6Toggle.addEventListener('change', function() {  

  setRankToggles('rank6')
  
});


const testsList = {
   
  rank5 : { 
    st5_1 : [test_5s_block_1, "5p Стандарт 1"],
    st5_2 : [test_5s_block_2, "5p Стандарт 2"],
    ex5 : [test_5ex, "5р эксперт"],
    ot_1 : [test_ot_block_1, "Охрана труда 1"],
    ot_2 : [test_ot_block_2, "Охрана труда 2"],
    ot5_2025 : [test_otrp, "ОT 2025"],
  },    
    
  rank6 : {      
    st6_1 : [test_6s_block_1, "6p Стандарт 1"],
    st6_2 : [test_6s_block_2, "6p Стандарт 2"],
    st6_3 : [test_6s_block_3, "6p Стандарт 3"],
    st6_4 : [test_6s_block_4, "6p Стандарт 4"],
    ex6 : [test_6e_block_1, "6р Эксперт"],
    ot_1 : [test_ot_block_1, "Охрана труда 1"],
    ot_2 : [test_ot_block_2, "Охрана труда 2"],
    ot6_2025 : [test_otrp, "ОT 2025"],
    tmp : [temp, "TEMP"],  
  },

}


function createTestButtons(){ 
  
  Object.keys(testsList[defaultRank]).forEach(key => {

    const testButton = document.createElement('button');

    testButton.id = key;

    testButton.className = "test_button";

    testButton.textContent = testsList[defaultRank][key][1]

    divTestsButtons.appendChild(testButton);

  });

}

function removeButtons() {
    
  divTestsButtons.innerHTML = '';
  
}


function showHideMenu() {

  const visibility = window.getComputedStyle(divDropdownMenu).display;  

  divDropdownMenu.style.display = visibility === "none" ? 'block' : 'none';
  
  if(divDropdownMenu.style.display === "none") {   

    const currentSettings = {

      isLearn : learnmodeToggle.checked,
      isShuffle : shuffleToggle.checked,
      isDarkTheme : themeToggle.checked,
      defRank : defaultRank,
      fontSize : currentFontSize,
      
    }

    const isSettings = localStorage.getItem("settings");

    const settings = isSettings ? currentSettings : defaultSettings

    setSettings(settings)

    saveSettings(settings);    

    removeButtons();

    createTestButtons();

  }

}

function removeSettings() {
  
  localStorage.removeItem("settings");

}


function hideHelpPage() {

  divHelp.style.display = "none";  

}

function showHelpPage() {

  divHelp.style.display = "block"; 

  showHideMenu();

}


// function setSettings(settings){    

//   //alert(settings.isDarkTheme)

//   themeToggle.checked = settings.isDarkTheme; 
  
//   shuffleToggle.checked = settings.isShuffle;

//   learnmodeToggle.checked = settings.isLearn;  

//   defaultRank = settings.defRank;
 
//   isLearnMode = settings.isLearn;

//   isShuffle = settings.isShuffle;

//   isDarkTheme = settings.isDarkTheme;

//   currentFontSize = settings.fontSize;

//   let theme;

//   settings.isDarkTheme == true  ? theme = 'dark-theme' : theme = 'light-theme';  

//   document.body.className = theme;

//   setRankToggles(defaultRank)

// }

function saveSettings(togglesState){   

  localStorage.setItem("settings", JSON.stringify(togglesState));

}


function setSettings(settings) {

  themeToggle.checked = settings.isDarkTheme; 
  
  shuffleToggle.checked = settings.isShuffle;

  learnmodeToggle.checked = settings.isLearn;  

  defaultRank = settings.defRank;

  currentFontSize = settings.fontSize;

  document.body.style.setProperty("--btn-font-size", `${settings.fontSize}px`);

  let theme;

  themeToggle.checked == true  ? theme = 'dark-theme' : theme = 'light-theme';  

  document.body.className = theme;

}


function setRankToggles(rank){  

  lev6Toggle.checked = rank === 'rank6';
  lev5Toggle.checked = rank !== 'rank6';
  defaultRank = rank;
}

const defaultSettings = {

  islearnMode : false,
  isShuffle : false,
  isDarkTheme : false,
  defRank : 'rank6', 
  fontSize : 20,
  
}

