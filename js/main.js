var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}

function getRandomParty(party){
    var rnd= Math.floor(Math.random() *(5 - 1) + 1);
    var rnd2;
    var array = [];
    if (party === 'heroes'){
      for (var i= 0; i<rnd; i++) {
        rnd2 = Math.floor(Math.random() *(3 - 1) + 1);
         rnd2 === 1 ? array[i] = RPG.entities.characters.heroTank : array[i] = RPG.entities.characters.heroWizard;
      }
    }
    else {
        for (var i= 0; i<rnd; i++) {
         rnd2 = Math.floor(Math.random() *(4 - 1) + 1);
         switch (rnd2){
            case 1:
              array[i] = RPG.entities.characters.monsterSlime;
              break;
            case 2:
               array[i] = RPG.entities.characters.monsterBat;
               break;
            case 3: 
               array[i] = RPG.entities.characters.monsterSkeleton;
               break;
            }
        }
    }
    return array;
}
battle.setup({
    heroes: {
        members: getRandomParty('heroes'),
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: getRandomParty('monsters'),
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);
     
    // TODO: render the characters
    var list = Object.keys(this._charactersById);
    var listChara = document.querySelectorAll('.character-list');
    var hChara = listChara[0];
    var mChara = listChara [1];
    var render;
    var temp;
    hChara.innerHTML = '';
    mChara.innerHTML = '';
    for (var i = 0; i < list.length; i++){
        temp = this._charactersById[list[i]];
        if (temp.hp < 1) render = '<li data-chara-id="'+list[i]+'" class = "dead">'+temp.name+'(HP: <strong>'+temp.hp+'</strong>/'+temp.maxHp+', MP: <strong>'+temp.mp+'</strong>/'+temp.maxMp+') </li>';
        else render = '<li data-chara-id="'+list[i]+'">'+temp.name+'(HP: <strong>'+temp.hp+'</strong>/'+temp.maxHp+', MP: <strong>'+temp.mp+'</strong>/'+temp.maxMp+') </li>';
       if (temp.party === 'heroes'){
         hChara.innerHTML += render;
       }
       else {
        mChara.innerHTML += render;
       }
    }
    // TODO: highlight current character
    var active = document.querySelector('[data-chara-id="'+data.activeCharacterId+'"]');
    active.classList.add("active");

    // TODO: show battle actions form
    writeForm(actionForm);
});

function writeForm (form){
    form.style.display='block';
    var choices = getChild(form, 'choices');
    choices.innerHTML='';
    var renderCh = null;
    var color = "black";
    for (var obj in battle.options.current._group){
        if (form === targetForm){
            if (battle._charactersById[obj].party === "monsters") color = "green";
            else color = "red";
        }
      renderCh =  '<li><label><font color = '+color+'><input type="radio" name="option" value="'+obj+'" required> '+obj+'</font></label></li>';
      choices.innerHTML += renderCh;
    }
    var found = false;
    var i = 0;
    var button;
    //Encuentra el botón del formulario
    while (i < form.childNodes.length && !found){
        if(form.childNodes[i].hasChildNodes() && form.childNodes[i].firstChild.getAttribute("type") === "submit"){
         found = true;
         button = form.childNodes[i].firstChild;
        }
        i++;
    }

    if (renderCh === null) button.disabled = true;
    else button.disabled = false;
}
function getChild (obj, className){
    var found = false;
    var i = 0;
    var choices = obj.firstChild;
    while (i < obj.childNodes.length && !found){
    if (choices.className && choices.className == className)found = true;
    else choices = choices.nextSibling;
    i++;
    }
    return choices;
}

battle.on('info', function (data) {
 console.log('INFO', data);
    // TODO: display turn info in the #battle-info panel
    var render;
    var effectsTxt = prettifyEffect(data.effect || {});
    var name = this._charactersById[data.activeCharacterId].name;
    var targetName = this._charactersById[data.targetId].name;
    switch (data.action){
        case 'attack': 
            if (data.success)render = '<strong>'+name +'</strong> attacked <strong>'+ targetName+ '</strong> and caused '+effectsTxt;
            else render = '<strong>'+name+'</strong> missed the attack ';
            break;
        case 'defend':
            render = '<strong>'+ name+'</strong> defense raises to '+ data.newDefense;
            break;
        case 'cast':
            if(data.success) render = '<strong>'+name+'</strong> casted <i>'+ data.scrollName + '</i> on <strong>'+ targetName+ '</strong> and caused '+effectsTxt;
            else render = '<strong>'+name+'</strong> failed the cast ';
            break;
    }
    document.getElementById("battle-info").innerHTML = render;
});

battle.on('end', function (data) {
    console.log('END', data);
    // TODO: re-render the parties so the death of the last character gets reflected
    var list = Object.keys(this._charactersById);
    var listChara = document.querySelectorAll('.character-list');
    var hChara = listChara[0];
    var mChara = listChara [1];
    var render;
    var temp;
    hChara.innerHTML = '';
    mChara.innerHTML = '';
    for (var i = 0; i < list.length; i++){
        temp = this._charactersById[list[i]];
        if (temp.hp < 1) render = '<li data-chara-id="'+list[i]+'" class = "dead">'+temp.name+'(HP: <strong>'+temp.hp+'</strong>/'+temp.maxHp+', MP: <strong>'+temp.mp+'</strong>/'+temp.maxMp+') </li>';
        else render = '<li data-chara-id="'+list[i]+'">'+temp.name+'(HP: <strong>'+temp.hp+'</strong>/'+temp.maxHp+', MP: <strong>'+temp.mp+'</strong>/'+temp.maxMp+') </li>';
       if (temp.party === 'heroes'){
         hChara.innerHTML += render;
       }
       else {
        mChara.innerHTML += render;
       }
    }
    // TODO: display 'end of battle' message, showing who won
    document.getElementById("battle-info").innerHTML = 'Battle is over! Winners were: <strong>'+data.winner+'</strong>';
    document.querySelector('form[name=end]').style.display = "inline";
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
         // TODO: select the action chosen by the player
        var choice = actionForm.elements['option'].value;
        battle.options.select(choice);
        // TODO: hide this menu
        actionForm.style.display='none';
        // TODO: go to either select target menu, or to the select spell menu
        var aux;
        if (choice !== 'defend'){

        choice === 'attack' ? aux = targetForm : aux = spellForm;
         writeForm(aux);
        }
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var choice = targetForm.elements['option'].value;
        battle.options.select(choice);
        // TODO: hide this menu
         targetForm.style.display='none';
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display='none';
        // TODO: go to select action menu
        writeForm(actionForm);
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
         var choice = spellForm.elements['option'].value;
         battle.options.select(choice);
        // TODO: hide this menu
         spellForm.style.display='none';
        // TODO: go to select target menu
        writeForm(targetForm);
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display='none';
        spellForm.style.display='none';
        // TODO: go to select action menu
        writeForm(actionForm);
    });

    battle.start();
};
