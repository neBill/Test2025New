const lev5Toggle = document.getElementById('lev5');
const lev6Toggle = document.getElementById('lev6');
const themeToggle =  document.getElementById('theme'); 
const shuffleToggle = document.getElementById('shuffle');
const learnmodeToggle = document.getElementById('learn_mode');
const divDropdownMenu = document.getElementById("drop-down-menu");

const divHelp = document.getElementById("help_block");

const divTestsButtons = document.getElementById('levels');






'use strict';

function chageFontSize(buttonId){  

  const bodyStyles = window.getComputedStyle(document.body);

  const oldSize = bodyStyles.getPropertyValue('--btn-font-size'); //get

  let newSize = 20;    

  if(buttonId == "font-increase"){  

    newSize = (parseFloat(oldSize) + 1).toFixed(2);       
  }

  if(buttonId == "font-decrease"){

    newSize = (parseFloat(oldSize) - 1).toFixed(2);
  }   

  if(newSize <= 23 && newSize >= 17){

    document.body.style.setProperty("--btn-font-size", `${newSize}px`);//set

    document.getElementById('fontsize').style.fontSize = `${newSize}`;

    localStorage.setItem('size', newSize);
  }
}




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
  
  if(localStorage.getItem('settings')) {   

    setSettings(JSON.parse(localStorage.getItem('settings')));   
        
  } else {
    
    setSettings(defaultSettings);
    
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


function toggleDropdownMenu() {

  if(isDefaultSettings) {

    setSettings(defaultSettings);

    isDefaultSettings = false;

  }   

  divDropdownMenu.style.display = window.getComputedStyle(divDropdownMenu).display === "none" ? 'block' : 'none';

  if(divDropdownMenu.style.display === "none"){

    saveSettings();

    removeButtons();

    createTestButtons();

  }



}

function setDefaultSettings() {

   isDefaultSettings = true;

}


function hideHelpPage() {

  divHelp.style.display = "none";  

}

function showHelpPage() {

  divHelp.style.display = "block"; 

  toggleDropdownMenu();

}


function setSettings(settings){    

  themeToggle.checked = settings.isDarkTheme; 
  
  shuffleToggle.checked = settings.isShuffle;

  learnmodeToggle.checked = settings.isLearn;  

  defaultRank = settings.defRank;
 
  isLearnMode = settings.isLearn;

  isShuffle = settings.isShuffle;

  isDarkTheme = settings.isDarkTheme;

  let theme;

  settings.isDarkTheme == true  ? theme = 'dark-theme' : theme = 'light-theme';  

  document.body.className = theme;

  setRankToggles(defaultRank)

}

function saveSettings(){  

  const togglesState = {
  
    isLearn : learnmodeToggle.checked,
    isShuffle : shuffleToggle.checked,
    isDarkTheme : themeToggle.checked,
    defRank : defaultRank,
  }

  setSettings(togglesState);

  localStorage.setItem("settings", JSON.stringify(togglesState));
}



function setRankToggles(rank){

  // if(rank === 'rank6') {

  //   lev6Toggle.checked = true;
  //   lev5Toggle.checked = false;    

  // }else{

  //   lev5Toggle.checked = true;
  //   lev6Toggle.checked = false;
    
  // }   

  lev6Toggle.checked = rank === 'rank6';
  lev5Toggle.checked = rank !== 'rank6';

  defaultRank = rank;



}

const defaultSettings = {

  islearnMode : false,
  isShuffle : false,
  isDarkTheme : false,
  defRank : 'rank6', 

}

