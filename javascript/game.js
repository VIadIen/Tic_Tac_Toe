let code = Math.floor(Math.random() * 8999) + 1000;
let ws = new WebSocket("ws://127.0.0.1:8000/tic-tac/" + 6694 + "/")
let player = null
let currentPlayer = null

// function load(status) {
//     if (status === 1) {
//         let code = Math.floor(Math.random() * 8999) + 1000;
//         var ws = new WebSocket("ws://127.0.0.1:8000/tic-tac/" + code + "/")
//     } else {
//         var ws = new WebSocket("ws://127.0.0.1:8000/tic-tac/" + status + "/")
//     }
// }


swaper = {
    "X": "O",
    "O": "X"
}

function cellClick(id) {
    if (player === currentPlayer) {
        ws.send(JSON.stringify({player: player, cell: id}));
    } else {
        alert('Сейчас не ваш ход')
    }
}

function updateCell(id, sign) {
    if (document.getElementById(id).dataset.stat === 'true') {
        if (sign === 'X') {
            document.getElementById(id).style.backgroundImage = "url('../static/cross.png')";
            document.getElementById(id).style.backgroundSize = 'cover';
            document.getElementById(id).style.animation = "cross 1s";
        } else {
            document.getElementById(id).style.backgroundImage = "url('../static/zero.png')";
            document.getElementById(id).style.backgroundSize = 'cover';
            document.getElementById(id).style.animation = "zero 1s";
        }
        document.getElementById(id).classList.toggle('inv')
        document.getElementById(id).dataset.stat = 'false'
    } else {
        alert('Выберите другую клетку')
    }
}

function toggleplayer() {
    currentPlayer = swaper[currentPlayer]
}

function winLine(vector, player) {
    let a = vector.slice(0, 1)
    let b = vector.slice(1)
    document.getElementById('text').innerText = player + ' ВЫИГРАЛ'
    if (a === '0' && b === '2') {
        document.getElementById('win_line').src = '../static/line_hor.png'
        document.getElementById('win_line').style.maxHeight = '2%'
        document.getElementById('win_line').style.maxWidth = '100%'
        document.getElementById('win_line').style.marginTop = '15%'
        document.getElementById('win_line').style.animation = 'horLine 1s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '3' && b === '5') {
        document.getElementById('win_line').src = '../static/line_hor.png'
        document.getElementById('win_line').style.maxHeight = '2%'
        document.getElementById('win_line').style.maxWidth = '100%'
        document.getElementById('win').style.alignItems = 'center'
        document.getElementById('win_line').style.animation = 'horLine 1s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '6' && b === '8') {
        document.getElementById('win_line').src = '../static/line_hor.png'
        document.getElementById('win_line').style.marginTop = '81%'
        document.getElementById('win_line').style.maxHeight = '2%'
        document.getElementById('win_line').style.maxWidth = '100%'
        document.getElementById('win_line').style.animation = 'horLine 1s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '0' && b === '6') {
        document.getElementById('win_line').src = '../static/line_vert.png'
        document.getElementById('win_line').style.marginLeft = '15%'
        document.getElementById('win_line').style.animation = 'vertLine 1s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '1' && b === '7') {
        document.getElementById('win_line').src = '../static/line_vert.png'
        document.getElementById('win_line').style.marginLeft = '48%'
        document.getElementById('win_line').style.animation = 'vertLine 1s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '2' && b === '8') {
        document.getElementById('win_line').src = '../static/line_vert.png'
        document.getElementById('win_line').style.marginLeft = '81%'
        document.getElementById('win_line').style.animation = 'vertLine 1s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '8' && b === '0') {
        document.getElementById('win_line').src = '../static/line_lup_rown.png'
        document.getElementById('win_line').style.animation = 'lupRown 2s'
        document.getElementById('win').style.zIndex = '1'
    }
    if (a === '6' && b === '2') {
        document.getElementById('win_line').src = '../static/line_rup_lown.png'
        document.getElementById('win_line').style.animation = 'rupLown 1s'
        document.getElementById('win').style.zIndex = '1'
    }
}

function draw() {
    document.getElementById('text').innerText = "Победила дружба"
}

ws.onmessage = function (e) {
    response = JSON.parse(e.data)
    console.log("On message", response);
    if (response.init) {
        document.getElementById("text").innerText = "Вы играете за " + response.player
        if (response.message !== "Waiting for another player") {
            player = response.player
        }
        currentPlayer = 'X'
    } else {
        if (response.message === 'move') {
            updateCell(response.cell, response.player)
            toggleplayer()
        } else if (response.message === 'draw') {
            updateCell(response.cell, response.player)
            draw()
            ws.close(1000)
        } else if (response.message.slice(0, 3) === 'won') {
            updateCell(response.cell, response.player)
            winLine(response.message.slice(3, 5), response.player)
            ws.close(1000)
        } else {
            console.log(response);
        }
    }
}

ws.onclose = function () {
    console.log('Close')
}

