var inputArea,
    historyContent, currentVal,
    previousValue,
    expression = '',
    regexPlusOrMinus = /[\/\*\%]/,
    symbol = /[+-/*%/]/,
    historyVar = new Map();

document.addEventListener('DOMContentLoaded', () => {
    inputArea = document.getElementById('inputArea');
    historyContent = document.getElementById('historyContent');
    setDefaultContent()
})

function setDefaultContent(flag = false) {
    if (!inputArea) {
        console.error('inputArea is not defined');
        return;
    }
    inputArea.value = '0';
    expression = '';
}

/** function on any on button click  with mouse*/
function onScreenButtonClick(val, type) {
    if (invalid(val)) {
        return;
    }
    expression += `${val}`
    updateCurrentAndPreviousValues(val);
    inputArea.value = expression;
    switch (type) {
        case 'equals':
            calculateValue();
            break;
    }
}

function invalid(str) {
    /** don't allow = at the start point */
    if (!(currentVal && previousValue) && str === '=') {
        return true;
    }

    /** don't allow = immedatly after the symbol like +,-,/,% */
    if (isSymbol(expression.charAt(expression.length - 1)) && str === '=') {
        return true;
    }

    if (!expression && regexPlusOrMinus.test(str)) {
        return true;
    }

    if ((!expression || expression == '0') && (str == '0' || str == '00')) {
        return true;
    }

    /** don't allow consiqutive +,-,/ or %*/
    if (isSymbol(expression.charAt(expression.length - 1)) && isSymbol(str)) {
        expression = expression.slice(0, -1) + str;
        inputArea.value = expression;
        return true;
    }


}

function isSymbol(str) {
    return symbol.test(str);
}


function calculateValue() {
    const cal = eval(expression.replace('=', ''));
    inputArea.value = cal;
    historyVar.set(expression, cal);
    const keysIterator = Array.from(historyVar.keys()).reverse();
    clearHistory()
    for (const key of keysIterator) {
        updateHistory(key)
    }
    expression = '';
}


function clearHistory() {
    while (historyContent.lastElementChild) {
        historyContent.removeChild(historyContent.lastElementChild);
    }
}


function updateHistory(key) {
    const val = historyVar.get(key)
    const parentEle = document.createElement('div');
    const childOne = document.createElement('div');

    childOne.innerHTML = `<span>${key}${val}</span>`;

    parentEle.classList.add('parentEle')
    parentEle.appendChild(childOne);

    parentEle.addEventListener("click", clickHistory)
    historyContent.appendChild(parentEle);
    const hr = document.createElement('hr');
    historyContent.appendChild(hr);
}

function clickHistory($event) {
    const temp = $event.target.innerText.split('=').map(str => str.replace(/\n/g, ''));
    const result = temp[1];
    expression = result;
    inputArea.value = result;
    $event.stopPropagation();
}

function updateCurrentAndPreviousValues(val) {
    if (currentVal !== null || currentVal !== undefined) {
        previousValue = currentVal;
        currentVal = val;
        return;
    }
    currentVal = val;
}
