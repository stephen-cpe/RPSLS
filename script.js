var dndSupported;    // true if drag and drop supported
var dndEls = new Array();
var draggingElement;

function detectDragAndDrop() {
    if ('draggable' in document.createElement('span')) return true;
    return false;
}

// DnD support
function handleDragStart(e) {
    var rpsType = getRPSType(this);
    draggingElement = this;
    draggingElement.className = 'moving';
    statusMessage('Drag ' + rpsType);
    this.style.opacity = '0.4';
    e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); // set the drag image
}

function handleDragEnd(e) {
    this.style.opacity = '1.0';
    draggingElement.className = undefined;
    draggingElement = undefined;
}

function handleDragOver(e) {
    if(e.preventDefault) e.preventDefault(); // Required for dragover
    return false;
}

function handleDragEnter(e) {
    if(this !== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement) + ' over ' + getRPSType(this));
}

function handleDragLeave(e) {
    // No action needed
}

function handleDrop(e) {
    if(e.stopPropagation) e.stopPropagation(); // Fixed typo
    if(e.preventDefault) e.preventDefault();
    if(this.id === draggingElement.id) return;
    else isWinner(this, draggingElement);
}

// Utility functions
function isWinner(under, over) {
    var underType = getRPSType(under);
    var overType = getRPSType(over);
    if(overType == 'Rock' && (underType == 'Lizard' || underType == 'Scissors')) {
        statusMessage(overType + "<span class='blue'> crushes </span>"  + underType);
        swapRPS(under, over);
    } else if(overType == 'Paper' && underType == 'Rock') {
        statusMessage(overType + " <span class='blue'>covers</span> "+ underType);
        swapRPS(under, over);
    } else if(overType == 'Paper' && underType == 'Spock') {
        statusMessage(overType + "<span class='blue'> disproves </span>"  + underType);
        swapRPS(under, over);
    } else if(overType == 'Scissors' && underType == 'Paper') {
        statusMessage(overType + "<span class='blue'> cuts </span>"  + underType);
        swapRPS(under, over);
    } else if(overType == 'Scissors' && underType == 'Lizard') {
        statusMessage(overType + "<span class='blue'> decapitates </span>"  + underType);
        swapRPS(under, over);
    } else if(overType == 'Lizard' && underType == 'Paper') {
        statusMessage(overType + "<span class='blue'> eats </span>"  + underType);
        swapRPS(under, over);
    } else if(overType == 'Lizard' && underType == 'Spock') {
        statusMessage(overType + "<span class='blue'> poisons </span>" + underType);
        swapRPS(under, over);
    } else if(overType == 'Spock' && underType == 'Rock') {
        statusMessage(overType + "<span class='blue'> vaporizes </span>" + underType);
        swapRPS(under, over);
    } else if(overType == 'Spock' && underType == 'Scissors') {
        statusMessage(overType + "<span class='blue'> smashes </span>"  + underType);
        swapRPS(under, over);
    } else {
        statusMessage(overType + "<span class='red'> does not beat </span>" + underType);
    }
}

function getRPSFooter(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
    }
    return undefined;
}

function getRPSImg(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
    }
    return undefined;
}

function getRPSType(e) {
    var footer = getRPSFooter(e);
    if(footer) return footer.innerHTML;
    else return undefined;
}

function swapRPS(a, b) {
    var holding = Object();

    holding.img = getRPSImg(a);
    holding.src = holding.img.src;
    holding.footer = getRPSFooter(a);
    holding.type = holding.footer.innerHTML;
    
    holding.img.src = getRPSImg(b).src;
    holding.footer.innerHTML = getRPSType(b);

    getRPSImg(b).src = holding.src;
    getRPSFooter(b).innerHTML = holding.type;
}

// Utility functions
var elStatus;
function element(id) { return document.getElementById(id); }

function statusMessage(s) {
    if(!elStatus) elStatus = element('statusMessage');
    if(!elStatus) return;
    if(s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

// App lifetime support
function init() {
    if((dndSupported = detectDragAndDrop())) {
        statusMessage('Using HTML5 Drag and Drop');
        dndEls.push(element('rps1'), element('rps2'), element('rps3'),element('rps4'),element('rps5'));
        for(var i = 0; i < dndEls.length; i++) {
            dndEls[i].addEventListener('dragstart', handleDragStart, false);
            dndEls[i].addEventListener('dragend', handleDragEnd, false);
            dndEls[i].addEventListener('dragover', handleDragOver, false);
            dndEls[i].addEventListener('dragenter', handleDragEnter, false);
            dndEls[i].addEventListener('dragleave', handleDragLeave, false);
            dndEls[i].addEventListener('drop', handleDrop, false);
        }
    } else {
        statusMessage('This browser does not support Drag and Drop');
    }
}

window.onload = init;