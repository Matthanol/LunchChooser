document.addEventListener('DOMContentLoaded', onReady);

let constIndex = 0
let withVotes = false;
let options = []
let memory;
Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}



function onReady(e) {
    createInputRow()
    let votesCheckbox = document.getElementById('useVotes');
    votesCheckbox.checked = withVotes;
    votesCheckbox.addEventListener('click', toggleVotes);
    document.getElementById('choose').addEventListener('click', createAnswerAndSpitOut);
    generateInMemoryList();
    applyVoteSetting()
    

}

function createInputRowWithValue(option) {

    constIndex += 1

    let container = document.createElement("li")
    container.className = 'inputRowContainer'

    const optionField = document.createElement('input');
    optionField.setAttribute('type', 'text');
    optionField.setAttribute('placeholder', 'Location or food option')
    optionField.value = option
    optionField.id = constIndex

    const votes = document.createElement('input');
    votes.setAttribute('type', 'number')
    votes.setAttribute('min', '00')
    votes.setAttribute('value', '1')
    votes.classList.add('voteNumber')
    if (!withVotes) {
        votes.classList.add('hidden')
    }


    container.appendChild(optionField)

    container.appendChild(votes);

    document.getElementById('input').appendChild(container);
    container.addEventListener('keyup', keyHandler);
    optionField.focus();
    options.push(container)


}

function createInputRow() {
    createInputRowWithValue('')
}

function keyHandler(e) {
    // console.log(e.keyCode)
    if (e.keyCode === 13 && parseInt(e.target.id) == constIndex) {
        e.target.removeEventListener('keyup', keyHandler, true)
        if (!isLastRowEmpty()) {
            createInputRow()
        }
    }

}

function toggleVotes() {
    withVotes = !withVotes
    applyVoteSetting()
}

function applyVoteSetting() {
    let elements = document.getElementsByClassName('voteNumber')
    if (withVotes) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('hidden')
            elements[i].value = 1
        };
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add('hidden')
            elements[i].value = 1
        };
    }
}

function createAnswerAndSpitOut() {
    if (options.length > 1) {
        let weightedList = [];
        options.forEach(element => {
            const optionText = element.childNodes[0].value;
            const wheight = element.childNodes[1].value
            if (optionText.length > 0) {
                saveOption(optionText);
                for (let i = 0; i < wheight; i++) {

                    weightedList.push(optionText)


                }
            }
        });
        //console.log(weightedList)

        document.getElementById('output').innerText = weightedList[Math.floor(Math.random() * weightedList.length)]
        document.getElementById('outputSentence').classList.remove('hidden')

    } else(
        document.getElementById('output').innerText = 'Please provide some options'
    )

}

function generateInMemoryList() {
    const memoryList = document.getElementById('memoryList');
    memoryList.innerHTML = ''
    memory = window.localStorage.getObj('memory');
    if (!memory) {
        memory = {
            options: []
        }
        window.localStorage.setObj('memory', memory)
    }
    memory.options.forEach(option => {
        const memoryItem = document.createElement('li');
        const memoryText = document.createElement('span');
        memoryText.innerText = option;

        const memoryAddButton = document.createElement('input')
        memoryAddButton.setAttribute('type', 'button')
        memoryAddButton.setAttribute('data-option', option)
        memoryAddButton.addEventListener('click', addToOptionList)
        memoryAddButton.value = 'use'

        const memoryRemoveButton = document.createElement('input')
        memoryRemoveButton.setAttribute('type', 'button')
        memoryRemoveButton.setAttribute('data-option', option)
        memoryRemoveButton.addEventListener('click', removeFromMemoryList)
        memoryRemoveButton.value = 'remove'

        memoryItem.appendChild(memoryText);
        memoryItem.appendChild(memoryAddButton);
        memoryItem.appendChild(memoryRemoveButton)

        memoryList.appendChild(memoryItem);
    })

}

function saveOption(option) {
    if (!memory.options.includes(option)) {
        console.log('Saved to memory')
        memory.options.push(option)
        window.localStorage.setObj('memory', memory)

    }
    generateInMemoryList()


}

function addToOptionList(e) {
    if (isLastRowEmpty()) {
        removeOptionRow(constIndex)
    }
    createInputRowWithValue(e.target.getAttribute('data-option'))


}

function removeFromMemoryList(e) {

    const option = e.target.getAttribute('data-option');

    if (memory.options.includes(option)) {
        memory.options = memory.options.filter(element => element != option)
        window.localStorage.setObj('memory', memory)
        console.log('removing ' + option)
    }
    generateInMemoryList()
}

function removeOptionRow(i) {
    const elementToRemove = document.getElementById(i).parentElement;
    elementToRemove.parentElement.removeChild(elementToRemove)

}

function isLastRowEmpty() {
    return document.getElementById(constIndex).value == ''
}