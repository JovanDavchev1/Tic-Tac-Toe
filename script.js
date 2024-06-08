let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let currentPlayer = 'circle';
let gameOver = false;
let winner = null; // Neue Variable für den Gewinner

function init() {
    render();
}

function createCircleSVG() {
    const svg = `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#00B0EF" stroke-width="10" fill="none" stroke-dasharray="283" stroke-dashoffset="283">
                <animate attributeName="stroke-dashoffset" from="283" to="0" dur="0.125s" fill="freeze" />
            </circle>
        </svg>
    `;
    return svg;
}

function createCrossSVG() {
    const svg = `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="15" y1="15" x2="85" y2="85" stroke="#ffc000" stroke-width="10" stroke-linecap="round">
                <animate attributeName="stroke-dasharray" from="0, 100" to="100, 0" dur="0.125s" fill="freeze" />
            </line>
            <line x1="85" y1="15" x2="15" y2="85" stroke="#ffc000" stroke-width="10" stroke-linecap="round">
                <animate attributeName="stroke-dasharray" from="0, 100" to="100, 0" dur="0.125s" fill="freeze" />
            </line>
        </svg>
    `;
    return svg;
}

function handleClick(index) {
    if (fields[index] === null && !gameOver) {
        fields[index] = currentPlayer;
        const cell = document.getElementById(`cell-${index}`);
        if (currentPlayer === 'circle') {
            cell.innerHTML = createCircleSVG();
            currentPlayer = 'cross';
        } else {
            cell.innerHTML = createCrossSVG();
            currentPlayer = 'circle';
        }
        cell.onclick = null; // Remove the onclick handler

        if (checkWinner()) {
            gameOver = true;
        }
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            winner = fields[a]; // Setze den Gewinner
            drawWinningLine(combination);
            return true;
        }
    }
    return false;
}

function drawWinningLine(combination) {
    const content = document.getElementById('content');
    const lineSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    lineSVG.setAttribute("class", "winning-line");

    const [start, middle, end] = combination;

    const startX = getX(start);
    const startY = getY(start);
    const endX = getX(end);
    const endY = getY(end);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX + "px");
    line.setAttribute("y1", startY + "px");
    line.setAttribute("x2", endX + "px");
    line.setAttribute("y2", endY + "px");
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "5");

    lineSVG.appendChild(line);
    content.appendChild(lineSVG);
}

function getX(index) {
    const cell = document.getElementById(`cell-${index}`);
    const rect = cell.getBoundingClientRect();
    return rect.left - content.getBoundingClientRect().left + rect.width / 2;
}

function getY(index) {
    const cell = document.getElementById(`cell-${index}`);
    const rect = cell.getBoundingClientRect();
    return rect.top - content.getBoundingClientRect().top + rect.height / 2;
}


function render() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    let html = '<table>';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = createCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = createCrossSVG();
            }
            html += `<td id="cell-${index}" onclick="handleClick(${index})">${symbol}</td>`;
        }
        html += '</tr>';
    }

    html += '</table>';
    content.innerHTML = html;
}

function restartGame() {
    // Zurücksetzen des fields-Arrays
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];

    // Zurücksetzen des Gewinners
    winner = null;
    
    // Zurücksetzen des Spielendes
    gameOver = false;

    // Neuzeichnen des Spielfelds
    render();

    // Wiederherstellen der onclick-Handler für alle Zellen
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.onclick = function() {
            const index = parseInt(cell.id.split('-')[1]);
            handleClick(index);
        };
    });
}

// Initialize the game
init();
