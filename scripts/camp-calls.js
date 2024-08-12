/* New JS functions are added here. Modifications are made in original files. */

// changeLayout(value) changeKeyboard(value)
// Change Selected in Selector
function changeSelected(target, parent) {
    if (parent === 'layout') {
        changeLayout(target.getAttribute('data-value'));
    } else if (parent === 'keyboard') {
        changeKeyboard(target.getAttribute('data-value'));
    }
}

// Update selector text and local value
function updateSelectors() {
    let lVal = layout.getAttribute('data-value'),
        kVal = keyboard.getAttribute('data-value');
    
    layout.querySelector('span').innerText = document.querySelector(`li[data-value=${lVal}]`).innerText;
    keyboard.querySelector('span').innerText = document.querySelector(`li[data-value=${kVal}]`).innerText;
}
updateSelectors();

// Close all lists first
function closeSelectors() {
    let lists = document.querySelectorAll('#selectors list');

    for (let x = 0; x < lists.length; x++) {
        if (!lists[x].classList.contains('close')) {
            lists[x].classList.add('close');
            setTimeout(function() {
                lists[x].classList.add('hide');
            }, 100);
        }
    }
}

// Allow drop down of selectors
function toggleSelectors(key) {
    let list = document.querySelector(`#${key} list`);

    if (list.classList.contains('close')) {
        closeSelectors();
        list.classList.remove('hide');
        setTimeout(function() {
            list.classList.remove('close');
        }, 10);
    } else {
        list.classList.add('close');
        setTimeout(function() {
            list.classList.add('hide');
        }, 100);
    }
}

// Listen to mousedown on selectors
document.addEventListener('mousedown', function(event) {
    if (event.button !== 0) {return;}

    let target = event.target,
        selArray = ['layout','keyboard'];
    
    for (let x = 0; x < selArray.length; x++) {
        if (document.getElementById(selArray[x]) === target || document.getElementById(selArray[x]).contains(target)) {
            window.selectorDown = selArray[x];
        }
    }
});

// Listen to mouseup on selectors and trigger click if target matches mousedown event
document.addEventListener('mouseup', function(event) {
    if (event.button !== 0) {return;}

    let target = event.target,
        selArray = ['layout','keyboard'];

    for (let x = 0; x < selArray.length; x++) {
        if (window.selectorDown === selArray[x] && document.getElementById(selArray[x]).contains(target)) {
            toggleSelectors(selArray[x]);
            if (target.tagName.match(/^li$/i)) {
                changeSelected(target, selArray[x]);
            }
            return;
        }
    }

    // Also closes dropdowns if clicked elsewhere
    closeSelectors();
});

// Clicking the backdrop is the same as clicking discard in the keyboard edit dialogue
document.querySelector('#sub backdrop').addEventListener('click', function() {
    discardButton.click();
});

// Simulate proper hover for the Custom Enter Key
document.addEventListener('mouseover', function(event) {
    if (localStorage.currentKeyboard !== 'iso') {return;}

    let enterKeys = document.querySelectorAll('#customEnterTop, #customEnterBottom');
    
    if (event.target.id.match(/^customEnter/)) {
        enterKeys[0].classList.add('pseudoHover');
        enterKeys[1].classList.add('pseudoHover');
    } else {
        enterKeys[0].classList.remove('pseudoHover');
        enterKeys[1].classList.remove('pseudoHover');
    }
});

document.addEventListener('click', function(event) {
    let target = event.target,
        faPref = document.querySelector('.menu-nav .fa-preferences'),
        faTheme = document.querySelector('.menu-nav .fa-theme'),
        faClose = document.querySelector('.menu-nav .fa-close'),
        mbody = document.querySelector('menubar mbody');

    if (target == faPref || target == faPref.parentNode) {
        mbody.classList.remove('accentuate');
        mbody.classList.add('configure');
        faTheme.parentNode.classList.remove('active');
        faPref.parentNode.classList.add('active');
    }
    if (target == faTheme || target == faTheme.parentNode) {
        mbody.classList.remove('configure');
        mbody.classList.add('accentuate');
        faPref.parentNode.classList.remove('active');
        faTheme.parentNode.classList.add('active');
    }
    if (target == faClose || target == faClose.parentNode) {
        closeMenu();
    }
});


document.addEventListener('click', function(event) {
    let target = event.target,
        limitLi = document.querySelector('li.limit');

    if (target === limitLi || limitLi.contains(target)) {
        limitLi.querySelector('input:not(.dispose)').focus();
    }
});

// Keyboard Mapping Toggle State
document.addEventListener('click', function(event) {
    let target = event.target,
        keymapping = document.getElementById('keymapping');
    
    if (target === keymapping || keymapping.contains(target)) {
        if (localStorage.getItem('keyRemapping') === 'true') {
            localStorage.setItem('keyRemapping', false);
            keymapping.setAttribute('data-value','off');
        } else {
            localStorage.setItem('keyRemapping', true);
            keymapping.setAttribute('data-value','on');
        }
    }
});

// Function that saves custom layout to localstorage
function storeCustomLayout() {
    setJSON('customLevelDictionary', levelDictionaries['custom']);
    setJSON('customLayoutMap', layoutMaps['custom']);
}

// Automatically restore custom layout if available in localstorage
(function() {
    if (!localStorage.customLevelDictionary || !localStorage.customLayoutMap) {
        return;
    }

    levelDictionaries['custom'] = getJSON('customLevelDictionary');
    layoutMaps['custom'] = getJSON('customLayoutMap');
})();

// Reload page when clicked on Colemak Camp logo
document.addEventListener('click', function(e) {
    let logo = document.querySelector('header left');

    if (e.target == logo || logo.contains(e.target)) {
        window.location.reload(true);
    }
});