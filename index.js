document.addEventListener('DOMContentLoaded', onReady);

let constIndex = 0;
let withVotes = false;
let options = document.getElementById('input');

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
};
let memory = window.localStorage.getObj('memory');


function onReady(e) {
    createInputRow();
    createInputRow();
    let votesCheckbox = document.getElementById('useVotes');
    votesCheckbox.checked = withVotes;
    votesCheckbox.addEventListener('click', toggleVotes);
    document.getElementById('choose').addEventListener('click', createAnswerAndSpitOut);
    generateInMemoryList();
    applyVoteSetting();
    document.getElementById('addRow').addEventListener('click', createInputRow)


}

function createInputRowWithValue(option) {

    constIndex += 1;

    let container = document.createElement("li");
    container.className = 'inputRowContainer';
    container.id = constIndex;

    const optionField = document.createElement('input');
    optionField.setAttribute('type', 'text');
    optionField.setAttribute('placeholder', 'Location or food option');
    optionField.value = option;


    const votes = document.createElement('input');
    votes.setAttribute('type', 'number');
    votes.setAttribute('min', '00');
    votes.setAttribute('value', '1');
    votes.classList.add('voteNumber');
    if (!withVotes) {
        votes.classList.add('hidden')
    }

    const removeButton = document.createElement('input');
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('data-id', constIndex);
    removeButton.setAttribute('value', 'X');
    removeButton.addEventListener('click', removeOptionRowEventListener);


    container.appendChild(optionField);

    container.appendChild(votes);
    container.appendChild(removeButton);

    options.appendChild(container);
    container.addEventListener('keyup', keyHandler);
    optionField.focus();


}

function createInputRow() {
    createInputRowWithValue('')
}

function keyHandler(e) {
    // console.log(e.keyCode)

    if (e.keyCode === 13 && parseInt(e.target.parentElement.id) == options.children[options.children.length - 1].id) {
        //  console.log(e.target.parentElement.id  == options.children[options.children.length - 1].id )
        e.target.removeEventListener('keyup', keyHandler, true);
        if (!isLastRowEmpty()) {
            createInputRow()
        }
    }

}

function toggleVotes() {
    withVotes = !withVotes;
    applyVoteSetting()
}

function applyVoteSetting() {
    let elements = document.getElementsByClassName('voteNumber');
    if (withVotes) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('hidden');
            elements[i].value = 1
        }
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add('hidden');
            elements[i].value = 1
        }
    }
}

function createAnswerAndSpitOut() {
    let weightedList = [];
    let emptyOptions = false;

    Array.from(options.children).forEach(element => {
        const optionText = element.children[0].value;
        const wheight = element.children[1].value;
        if (optionText && options.children.length > 1) {
            saveOption(optionText);
            for (let i = 0; i < wheight; i++) {
                weightedList.push(optionText)
            }
        } else {
            emptyOptions = true;
        }
    });
    //console.log(weightedList)

    if(emptyOptions){
        document.getElementById('output').innerText = 'Please provide some options';
        document.getElementById('outputSentence').classList.add('hidden');

    } else {
        document.getElementById('output').innerText = weightedList[Math.floor(Math.random() * weightedList.length)];
        document.getElementById('outputSentence').classList.remove('hidden');
    }
}

function generateInMemoryList() {
    const memoryList = document.getElementById('memoryList');
    memoryList.innerHTML = '';
    if (!memory) {
        memory = {
            options: []
        };
        window.localStorage.setObj('memory', memory)
    }
    memory.options.forEach(option => {
        addMemoryItem(option);
    })

}

function saveOption(option) {
    if (!memory.options.includes(option)) {
        console.log('Saved to memory');
        memory.options.push(option);
        window.localStorage.setObj('memory', memory)

    }
    generateInMemoryList()


}

function addToOptionList(e) {
    if (!optionListContains(e.target.getAttribute('data-option'))) {
        if (checkEmptyRow() >= 0) {
            options.children[checkEmptyRow()].children[0].value = e.target.getAttribute('data-option');
        } else {
            createInputRowWithValue(e.target.getAttribute('data-option'));
        }
    }
}

function addMemoryItem(option) {
    const memoryList = document.getElementById('memoryList');
    const memoryItem = document.createElement('li');
    const memoryText = document.createElement('span');
    memoryText.innerText = option;

    const memoryAddButton = document.createElement('input');
    memoryAddButton.setAttribute('type', 'button');
    memoryAddButton.setAttribute('data-option', option);
    memoryAddButton.addEventListener('click', addToOptionList);
    memoryAddButton.value = 'use';

    const memoryRemoveButton = document.createElement('input');
    memoryRemoveButton.setAttribute('type', 'button');
    memoryRemoveButton.setAttribute('data-option', option);
    memoryRemoveButton.addEventListener('click', removeFromMemoryList);
    memoryRemoveButton.value = 'remove';

    memoryItem.appendChild(memoryText);
    memoryItem.appendChild(memoryAddButton);
    memoryItem.appendChild(memoryRemoveButton);

    memoryList.appendChild(memoryItem);
}

function removeFromMemoryList(e) {

    const option = e.target.getAttribute('data-option');

    if (memory.options.includes(option)) {
        memory.options = memory.options.filter(element => element != option);
        window.localStorage.setObj('memory', memory);
        console.log('removing ' + option)
    }
    generateInMemoryList()
}

function removeOptionRow(id) {
    options.removeChild(document.getElementById(id))

}

function removeOptionRowEventListener(e) {

    removeOptionRow(e.target.getAttribute('data-id'));
    if (options.children.length == 0) {
        createInputRow()
    }
}

function checkEmptyRow() {
    for (let i = 0; i < options.children.length; i++){
        if (options.children[i].children[0].value == ''){
            return i;
        }
    }

    return -1;
}

function isLastRowEmpty() {
    let answer;
    try {
        answer = options.children[options.children.length - 1].children[0].value == ''
    } catch {
        answer = false
    }
    return answer
}

function optionListContains(option) {
    for (let i = 0; i < options.children.length; i++) {
        let value = options.children[i].children[0].value;
        //console.log(value)
        if (value == option) {
            return true
        }


    }
    return false
}