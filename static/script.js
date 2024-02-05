const blocks = document.querySelectorAll('.block') // игровые блоки
let etalonBlockSequence = []; // эталонная последовательность блоков
let isReady = false; // true - действия игрока, false - действия алгоритма, действия игрока заблокированы
let stepGame = 0; // шаг игры/очки пользователя
let clickCounter = 0; // счетчик кликов (для валидации)
let level = 1; // уровень сложности, 1 lvl - 400мс интервал, 200мс подсветка блока, 2 lvl - 300мс интервал, 150мс подсветка блока
let recurseStep = 0 // шаг рекурсии

let buttonBoard1 = document.getElementById('button-board-1')
let buttonBoard2 = document.getElementById('button-board-2')
let buttonBoard3 = document.getElementById('button-board-3')
let buttonBoard4 = document.getElementById('button-board-4')


// точка входа, меню игры
function awaitPlayer(){
    // прослушиватель кликов игрока на игровых блоках
    blocks.forEach((block)=>{
        block.addEventListener('click', ()=>{
            playerActions(block)
        })
    })
    // прослушиватель кликов игрока на основной кнопке меню
    buttonBoard2.addEventListener('click', ()=>{
        // начать новую игру
        if (buttonBoard2.innerText == 'Начать игру' || buttonBoard2.innerText == 'Начать новую'){
            buttonBoard1.innerText = ''
            buttonBoard2.innerText = 'Завершить игру'
            // вызов меню выбора сложности
            setDelay()
            return
        // клик на завершение игры 
        } else if(buttonBoard2.innerText == 'Завершить игру') {
            // вызов функции завершения игры 
            endGame()
            return
        }
        return
    })
}

// меню уровня сложности
function setDelay(){
    // счетчик кликов меню уровня сложности (обнуление)
    let setDelayCounter = 0
    console.log('set delay')
    // вывод меню сложности игроку
    buttonBoard1.innerText = 'Выберите уровень сложности'
    buttonBoard2.innerText = ''
    buttonBoard3.innerText = '1'
    buttonBoard4.innerText = '2'
    // обрабочтик клика игрока на кнопке 1 уровня сложности
    buttonBoard3.addEventListener ('click', ()=>{
        level = 1
        window.delayActive = 200
        window.delayIntervalBlock = 400
        buttonBoard1.innerText = ''
        buttonBoard2.innerText = 'Завершить игру'
        buttonBoard3.innerText = ''
        buttonBoard4.innerText = ''
        // исключение двойного клика (вызова)
        if (setDelayCounter ==0) {
            newGame()
        }
        setDelayCounter++
        return
    }) 
    // обрабочтик клика игрока на кнопке 1 уровня сложности
    buttonBoard4.addEventListener ('click', ()=>{
        level = 2
        window.delayActive = 150
        window.delayIntervalBlock = 300
        buttonBoard1.innerText = ''
        buttonBoard2.innerText = 'Завершить игру'
        buttonBoard3.innerText = ''
        buttonBoard4.innerText = ''
        // исключение двойного клика (вызова)
        if (setDelayCounter ==0) {
            newGame()
        }
        setDelayCounter++
        return
    })
    return
}

// запуск инициализации игры с задержкой, только после выбора уровня сложности
// повторно вызывается при новой игре
function newGame(){
    console.log('newGame')
    if (level == 1 || level == 2) {
        setTimeout(() => {
            initGame();
        }, 500);
    }
}

// звершение игры, обнуление переменных для новой игры
function endGame(){
    setTimeout(() => {
        (new Audio('static/sounds/lose.wav')).play()
    }, 400);
    level = 0
    etalonBlockSequence = []
    playerBlockSequence = []
    stepGame = 0
    isReady = false
    console.log('endGame')
    buttonBoard1.innerText = 'Игра окончена'
    buttonBoard2.innerText = 'Начать новую'
}

// (пере)инициализация игры, повторно вызывается при следующем шаге
// обнуление переменных для нового шага
function initGame(){
    console.log('initGame')
    buttonBoard1.innerText = 'Запомните'
    // блокируем действия игрока
    isReady = false
    recurseStep = 0
    clickCounter = 0
    // Отображение шага игры/очков игрока на экранах scope-display
    // scope-num - картинки с цифрами, отрисовываются поверх картинок десплеев scope-display
    // если шаг игры < 10 отображать ведущий ноль
    if (stepGame<10) {
        $("#scope-num-1").attr('src',`static/images/0.svg`)
        $("#scope-num-2").attr('src',`static/images/${stepGame}.svg`)
    } else {
        $("#scope-num-1").attr('src',`static/images/${Array.from(stepGame.toString())[0]}.svg`)
        $("#scope-num-2").attr('src',`static/images/${Array.from(stepGame.toString())[1]}.svg`)
    }
    // добавляем в эталонную последовталеность блоков случайный блок
    etalonBlockSequence.push(blocks[Math.floor((Math.random()*blocks.length))])
    // запускаем алгоритм активации последовательности блоков
    activateBlockSequnce()
}


// алгоритм активации последовательности блоков
function activateBlockSequnce(){
    console.log('runActivateBlockSequnce')
    // активируем блок (шаг рекурсии == индексу активируемого блока)
    activateBlock(etalonBlockSequence[recurseStep])
    // если остались неактивированные блоки в эталонной последовательности
    // входим в рекурсию, увеличивая счетчик рекурсии
    recurseStep++
    if (recurseStep < etalonBlockSequence.length) {
        setTimeout(() => {
            activateBlockSequnce()
        }, delayIntervalBlock);
        
    } else{
        // выход из рекурсии если активирован последний блок
        // разрешаем игроку взаимодействие
        isReady = true
        console.log('close runAlgorithmBlockSequnce')
        buttonBoard1.innerText = 'Повторите'
        return
    }
}

// валидация срабатывает на каждом клике игрока
function validateClick(block){
    isReady = false
    console.log('validateClick')
    console.log(block)
    console.log(etalonBlockSequence[clickCounter-1])
    // на момент валидации clickCounter будет +1, поэтому [clickCounter-1]
    if (block == etalonBlockSequence[clickCounter-1]) {
        console.log('valid click')
        isReady = true
        return true
    } else {
        console.log('not valid click')
        return false
    }
}

function activateBlock(block){
    console.log('activateBlock')
    console.log(block)
    // активация блока 
    $(block).addClass('is-active')
    // звук активации блока
    if ($(block).hasClass('yellow')) {
        (new Audio('static/sounds/1.wav')).play()
    }
    if ($(block).hasClass('red')) {
        (new Audio('static/sounds/2.wav')).play()
    }
    if ($(block).hasClass('blue')) {
        (new Audio('static/sounds/3.wav')).play()
    }
    if ($(block).hasClass('green')) {
        (new Audio('static/sounds/4.wav')).play()
    }
    // каждый активированный блок, деактивируется через delayActive мс
    setTimeout(() => {
        deactivateBlock(block)
    }, delayActive);
}

function deactivateBlock(block){
    console.log('deactivateBlock')
    $(block).removeClass('is-active')
}

function playerActions(block){
    console.log('playerActions')
    // если игроку разрешено взаиомдействие 
    if (isReady) {
        // обработка клика
        clickCounter++
        activateBlock(block)
        
        let isValidClick = Boolean
        isValidClick = validateClick(block)
        // если клик не валидный - завершить игру
        if (!isValidClick) {
            endGame()
            return false
        }
        // если счетчик кликов равен количеству блоков в эталонной последовательности
        // вызвать c задержкой initGame 
        if (clickCounter == etalonBlockSequence.length) {
            setTimeout(() => {
                stepGame++
                initGame()
            }, 1000);
        }
    }
}

$(document).ready(awaitPlayer());

