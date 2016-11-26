var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
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
    for (var i = 0; i < list.length; i++){
        temp = this._charactersById[list[i]];
        render = '<li data-chara-id="'+list[i]+'">'+temp.name+'(HP: <strong>'+temp.hp+'</strong>/'+temp.maxHp+', MP: <strong>'+temp.mp+'</strong>/'+temp.maxMp+') </li>';
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
    actionForm.style.display='inline';
    var choices = getChild(actionForm, 'choices');
    for (var obj in this.options.current._group){
      var renderCh =  '<li><label><input type="radio" name="option" value="'+obj+'"> '+obj+'</label></li>';
      choices.innerHTML += renderCh;
    }
});
function getChild (obj, className){
    var found = false;
    var i = 0;
    while (i < obj.childNodes.length && !found){
    var choices = obj.firstChild;
    if (choices.className && choices.className == className)found = true;
    else choices = choices.nextSibling;
    i++;
    }
    return choices;
}

battle.on('info', function (data) {
 console.log('INFO', data);
    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var choice = (actionForm.elements['options']).value;
        console.log(choice);
        battle.options.select(choice);
       // <input type="radio" name="option" value="attack" required>
        // TODO: select the action chosen by the player
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        // TODO: hide this menu
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        // TODO: hide this menu
        // TODO: go to select target menu
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
};
