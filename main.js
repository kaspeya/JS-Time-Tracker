let data = [];
let contentDiv = document.getElementById("content");
let button = document.getElementById("myButton");
let input = document.getElementById("myInput");

setInterval(function() {
    let currentTime = new Date();
    updateDivs()
}, 1000);

function resetTimersAndListeners() {
    data.forEach(item => {
        if(item.timerActive) {
            clearInterval(item.timerID)}
    });

    let innerDivs = document.querySelectorAll('.innerDiv');
    innerDivs.forEach((div) => {
        let clone = div.cloneNode(true);
        div.parentNode.replaceChild(clone, div)
    });
}

function updateDivs() {
    resetTimersAndListeners();
    contentDiv.innerHTML = "";
    let currentValue = new Date(); // ms

    data.forEach(item => {
        let parentDiv = document.createElement("div");
        parentDiv.innerHTML = `
        <div class="innerDiv">
          <div>
            ${item.text}
          </div>
          <div class="time">
            ${item.timerActive ? formatTimer(item.startValue, currentValue) : formatDuration(item.startValue, item.endValue)}
          </div>
      </div>`;
        contentDiv.appendChild(parentDiv)
    });

    let innerDivs = document.querySelectorAll('.innerDiv');

    innerDivs.forEach((div, index) => {
        let innerText = div.querySelector('.innerText');
        let itemData = data[index];

        div.addEventListener('click', function() {
            if (itemData.timerActive) {
                itemData.endValue = new Date()
                if (getMinutes(itemData.startValue, itemData.endValue) > 0) {
                    itemData.timerActive = false
                } else {
                    alert('Задачи длительностью менее 1 минуты не сохраняются!')
                }
            }
        })
    });
}

function formatTimer(startValue, endValue) {
    let timeInSeconds = Math.floor((endValue - startValue) / 1000);
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    seconds = (seconds < 10 ? '0' : '') + seconds;
    return `${minutes}:${seconds}`
}

function getMinutes(startValue, endValue) {
    let timeInSeconds = Math.floor((endValue - startValue) / 1000);
    return Math.floor((timeInSeconds % 3600) / 60);
}

function formatDuration(startValue, endValue) {
    let duration = Math.floor(endValue - startValue)
    let timeInSeconds = Math.floor(duration / 1000);
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds % 3600) / 60);
    if(hours === 0) return `${minutes} м`;
    else return `${hours} ч ${minutes} м`
}


function addListItem() {
    let inputValue = input.value;
    if (!inputValue){
        alert("Введите название задачи")
        return
    }
    let newObject = {
        text: inputValue,
        startValue: new Date(), //
        endValue: undefined,
        timerActive: true,
    };
    data.unshift(newObject);
    input.value = "";
    updateDivs();
}

button.addEventListener("click", addListItem);
input.addEventListener("keypress", (event) => {
    if (event.code === 'Enter') {
        addListItem()
    }
});

updateDivs();