function setJSON(key, data) {
    if (typeof data != "string") {data = JSON.stringify(data);}
    localStorage.setItem(key, data);
}
function getJSON(key) {
    return JSON.parse(localStorage.getItem(key));
}

const dayCSS = document.getElementById('dayCSS'),
      nightCSS = document.getElementById('nightCSS');

const defDark = '--nav-shadow: #00000022;--text-color: #cfcfcf;--text-stark: #eceef2;--background: #202124;--foreground: #303134;--keyground: #141518;--sidebar-bg: #2d2f31;--sidebar-fg: #343739;--menubar-bg: #28292a;--menubar-fg: #2b2e32;--headbtn-bg: #252932;--headbtn-fg: #292e3a;--headbtn-br: #40434b;--green: #4caf50;--red: #f44336;--orange: #ffa726;--grey: #888888;',
      defLight = '--nav-shadow: #00000022;--text-color: #3c4043;--text-stark: #121212;--background: #ffffff;--foreground: #ededed;--keyground: #f8f8f8;--sidebar-bg: #f3f6fc;--sidebar-fg: #ebeef5;--menubar-bg: #f8fafd;--menubar-fg: #eff4fc;--headbtn-bg: #f3f6fc;--headbtn-fg: #eaf0fb;--headbtn-br: #d5d8dd;--green: #4caf50;--red: #f44336;--orange: #ffa726;--grey: #888888;',
      defAccent = '--accent-lite: #87cef5;--accent-half: #7398d9;--accent-deep: #5f63bd;';

let cusDark = defAccent + defDark,
    cusLight = defAccent + defLight;

function updateStyles() {
    nightCSS.innerHTML = `
    html, html[accent-dark='default'],
    li[data-accent='default'] {${defAccent}}
    html[accent-dark='github'],
    li[data-accent='github'] {
        --accent-lite: #00c5ff;
        --accent-half: #0093ff;
        --accent-deep: #0061cd;
    }
    html[accent-dark='duckduckgo'],
    li[data-accent='duckduckgo'] {
        --accent-lite: #ffcc33;
        --accent-half: #de5833;
        --accent-deep: #772f1b;
    }
    html[accent-dark='bravesearch'],
    li[data-accent='bravesearch'] {
        --accent-lite: #e95e3c;
        --accent-half: #d02480;
        --accent-deep: #8b10c6;
    }

    html, html[theme-dark='default'] {${defDark}}
    html[theme-dark='github'] {
        --nav-shadow: #00000022;
        --text-color: #c9d1d9;
        --text-stark: #ecf4ff;
        --background: #010409;
        --foreground: #161b22;
        --keyground: #000002;
        --sidebar-bg: #151a21;
        --sidebar-fg: #21262d;
        --menubar-bg: #0d1117;
        --menubar-fg: #1c2026;
        --headbtn-bg: #161b22;
        --headbtn-fg: #282f36;
        --headbtn-br: #30363d;
        --green: #4caf50;
        --red: #f44336;
        --orange: #ffa726;
        --grey: #888888;
    }
    html[theme-dark='duckduckgo'] {
        --nav-shadow: #00000022;
        --text-color: #cccccc;
        --text-stark: #eeeeee;
        --background: #161616;
        --foreground: #282828;
        --keyground: #121212;
        --sidebar-bg: #282828;
        --sidebar-fg: #353535;
        --menubar-bg: #1c1c1c;
        --menubar-fg: #282828;
        --headbtn-bg: #282828;
        --headbtn-fg: #333333;
        --headbtn-br: #454545;
        --green: #4caf50;
        --red: #f44336;
        --orange: #ffa726;
        --grey: #888888;
    }
    html[theme-dark='bravesearch'] {
        --nav-shadow: #00000022;
        --text-color: #dbdee2;
        --text-stark: #ffffff;
        --background: #17191e;
        --foreground: #1e2028;
        --keyground: #121419;
        --sidebar-bg: #1e2028;
        --sidebar-fg: #282b33;
        --menubar-bg: #1a1c23;
        --menubar-fg: #21232d;
        --headbtn-bg: #242731;
        --headbtn-fg: #30343d;
        --headbtn-br: #6a6d79;
        --green: #4caf50;
        --red: #f44336;
        --orange: #ffa726;
        --grey: #888888;
    }
    html[theme-dark='custom'] {${cusDark}}
    `;

    dayCSS.innerHTML = `
    html, html[accent-light='default'],
    li[data-accent='default'] {${defAccent}}
    html[accent-light='github'],
    li[data-accent='github'] {
        --accent-lite: #00c5ff;
        --accent-half: #0093ff;
        --accent-deep: #0061cd;
    }
    html[accent-light='duckduckgo'],
    li[data-accent='duckduckgo'] {
        --accent-lite: #ffcc33;
        --accent-half: #de5833;
        --accent-deep: #772f1b;
    }
    html[accent-dark='bravesearch'],
    li[data-accent='bravesearch'] {
        --accent-lite: #e95e3c;
        --accent-half: #d02480;
        --accent-deep: #8b10c6;
    }

    html, html[theme-light='default'] {${defLight}}
    html[theme-light='github'] {
        --nav-shadow: #00000022;
        --text-color: #1f2328;
        --text-stark: #000000;
        --background: #ffffff;
        --foreground: #f6f8fa;
        --keyground: #f8f8f8;
        --sidebar-bg: #eceef0;
        --sidebar-fg: #e2e4e6;
        --menubar-bg: #f6f8fa;
        --menubar-fg: #e9ebee;
        --headbtn-bg: #f6f8fa;
        --headbtn-fg: #e8ebef;
        --headbtn-br: #d0d7de;
        --green: #4caf50;
        --red: #f44336;
        --orange: #ffa726;
        --grey: #888888;
    }
    html[theme-light='duckduckgo'] {
        --nav-shadow: #00000022;
        --text-color: #444444;
        --text-stark: #222222;
        --background: #fafafa;
        --foreground: #f0f0f0;
        --keyground: #f0f0f0;
        --sidebar-bg: #f0f0f0;
        --sidebar-fg: #e0e0e0;
        --menubar-bg: #f5f5f5;
        --menubar-fg: #e5e5e5;
        --headbtn-bg: #f0f0f0;
        --headbtn-fg: #e0e0e0;
        --headbtn-br: #d9d9d9;
        --green: #4caf50;
        --red: #f44336;
        --orange: #ffa726;
        --grey: #888888;
    }
    html[theme-light='bravesearch'] {
        --nav-shadow: #00000022;
        --text-color: #3f4855;
        --text-stark: #15181c;
        --background: #ffffff;
        --foreground: #f2f4f7;
        --keyground: #f2f4f7;
        --sidebar-bg: #f2f4f7;
        --sidebar-fg: #e4e6f3;
        --menubar-bg: #f9fafd;
        --menubar-fg: #ebedfa;
        --headbtn-bg: #f2f4f7;
        --headbtn-fg: #e3e5ea;
        --headbtn-br: #caccd4;
        --green: #4caf50;
        --red: #f44336;
        --orange: #ffa726;
        --grey: #888888;
    }
    html[theme-light='custom'] {${cusLight}}
    `;

    themeClick();
    setAppearance();
}
updateStyles();

function forceAuto(key) {
    localStorage.setItem('theme','auto');
    dayCSS.setAttribute('media','(prefers-color-scheme: light)');
    dayCSS.setAttribute('type','text/css');
    nightCSS.setAttribute('media','(prefers-color-scheme: no-preference), (prefers-color-scheme: dark)');
    nightCSS.setAttribute('type','text/css');
    if (key && key !== '') {
        key.classList.add('auto');
    }
}
function forceDay(key) {
    localStorage.setItem('theme','day');
    dayCSS.removeAttribute('media');
    dayCSS.setAttribute('type','text/css');
    nightCSS.removeAttribute('media');
    nightCSS.setAttribute('type','null');
    if (key && key !== '') {
        key.classList.add('day');
    }
}
function forceNight(key) {
    localStorage.setItem('theme','night');
    dayCSS.removeAttribute('media');
    dayCSS.setAttribute('type','null');
    nightCSS.removeAttribute('media');
    nightCSS.setAttribute('type','text/css');
    if (key && key !== '') {
        key.classList.add('night');
    }
}

function themeClick(key) {
    if (key) {
        key.classList.remove('auto','day','night');
    } else {
        key = '';
    }
    if (localStorage.theme === 'night') {
        forceNight(key);
    } else if (localStorage.theme === 'day') {
        forceDay(key);
    } else {
        forceAuto(key);
    }
}

function setAppearance(key) {
    if (!localStorage.daymode) {
        localStorage.daymode = 'default';
    }
    if (!localStorage.nightmode) {
        localStorage.nightmode = 'default';
    }
    if (!localStorage.daytone) {
        localStorage.daytone = 'default';
    }
    if (!localStorage.nighttone) {
        localStorage.nighttone = 'default';
    }

    let dde = document.documentElement;
    dde.setAttribute('theme-light',localStorage.daymode);
    dde.setAttribute('theme-dark',localStorage.nightmode);
    dde.setAttribute('accent-light',localStorage.daytone);
    dde.setAttribute('accent-dark',localStorage.nighttone);

    if (key && key !== '') {
        let objs = document.querySelectorAll('.appearance li[class*="active"]');

        for (let x = 0; x < objs.length; x++) {
            objs[x].classList.remove('active-day', 'active-night');
        }

        function setActivity(typ, cue, val) {
            let obj = document.querySelector(`.appearance li[data-${typ}='${cue}']`);
    
            obj.classList.add(`active-${val}`);
        }
        setActivity('theme', localStorage.daymode, 'day');
        setActivity('theme', localStorage.nightmode, 'night');
        if (localStorage.daymode !== 'custom') {
            setActivity('accent', localStorage.daytone, 'day');
        }
        if (localStorage.nightmode !== 'custom') {
            setActivity('accent', localStorage.nighttone, 'night');
        }
    }
}

// Theme Toggle
document.addEventListener('click', function(event) {
    let target = event.target,
        themeBTN = document.querySelector('ul.config li.theme');
    
    if (target == themeBTN || themeBTN.contains(target)) {
        if (localStorage.theme === 'night') {
            localStorage.theme = 'auto';
        } else if (localStorage.theme === 'day') {
            localStorage.theme = 'night';
        } else {
            localStorage.theme = 'day';
        }

        themeClick(themeBTN);
    }
});

// Theme Selection
document.addEventListener('click', function(event) {
    let target = event.target;

    function taccent(key) {
        return key.getAttribute('data-accent');
    }
    function ttheme(key) {
        return key.getAttribute('data-theme');
    }

    if (!document.querySelector('.appearance').contains(target)) {return;}
    if (!target.tagName.match(/li/i) && !target.parentNode.tagName.match(/li/i)) {return;}

    if (target.tagName.match(/li/i)) {
        console.log('activate both');
        if (taccent(target) !== null) {
            localStorage.daytone = taccent(target);
            localStorage.nighttone = taccent(target);
        }
        if (ttheme(target) !== null) {
            localStorage.daymode = ttheme(target);
            localStorage.nightmode = ttheme(target);
        }
    }

    if (target.classList.contains('fa-dot') || target.tagName.match(/span/i)) {
        console.log('activate both');
        if (taccent(target.parentNode) !== null) {
            localStorage.daytone = taccent(target.parentNode);
            localStorage.nighttone = taccent(target.parentNode);
        }
        if (ttheme(target.parentNode) !== null) {
            localStorage.daymode = ttheme(target.parentNode);
            localStorage.nightmode = ttheme(target.parentNode);
        }
    }

    if (target.classList.contains('fa-day')) {
        console.log('activate day');
        if (taccent(target.parentNode) !== null) {
            localStorage.daytone = taccent(target.parentNode);
        }
        if (ttheme(target.parentNode) !== null) {
            localStorage.daymode = ttheme(target.parentNode);
        }
    }

    if (target.classList.contains('fa-night')) {
        console.log('activate night');
        if (taccent(target.parentNode) !== null) {
            localStorage.nighttone = taccent(target.parentNode);
        }
        if (ttheme(target.parentNode) !== null) {
            localStorage.nightmode = ttheme(target.parentNode);
        }
    }

    setAppearance('ready');
});

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
    themeClick(document.querySelector('ul.config li.theme'));
    setAppearance('ready');
});