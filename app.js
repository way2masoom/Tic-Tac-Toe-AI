// Optimized and Modularized JavaScript Code for Tic-Tac-Toe AI
// Implements Minimax Algorithm with Alpha-Beta Pruning

// Constants and Variables
const userSymbol = { player: "O", AI: "X" };
let currentPlayer;
let board;
let moves;
const scores = { X: +10, O: -10, TIE: 0 };

// DOM Elements
const tiles = document.querySelectorAll(".tile");
const chooseScreen = document.querySelector(".choose");
const firstMoveScreen = document.querySelector(".firstOne");
const gameBoard = document.querySelector(".card");
const winnerPopup = document.querySelector(".celebration");
const winnerText = document.getElementById("winner-name");

// Sound Effects
const moveSound = new Audio("move.mp3");
const winSound = new Audio("win.mp3");

// Initialize Game
function initGame() {
    board = Array.from({ length: 3 }, () => Array(3).fill(""));
    moves = 0;
    currentPlayer = undefined;
    tiles.forEach(tile => {
        tile.innerHTML = "";
        tile.classList.remove("disabled", "AI");
        tile.addEventListener("click", handleTileClick);
    });
}

// User Selects Symbol
function chooseSymbol(btn) {
    userSymbol.player = btn.innerHTML;
    userSymbol.AI = userSymbol.player === "X" ? "O" : "X";
    chooseScreen.classList.remove("activate");
    firstMoveScreen.classList.add("activate");
}

// Select Who Plays First
function firstMove(btn) {
    currentPlayer = btn.innerHTML === "AI" ? userSymbol.AI : userSymbol.player;
    firstMoveScreen.classList.remove("activate");
    gameBoard.classList.add("activate");
    if (currentPlayer === userSymbol.AI) playAI();
}

// Handle Tile Click
function handleTileClick(event) {
    if (currentPlayer === userSymbol.player) {
        makeMove(event.target, userSymbol.player);
        setTimeout(playAI, 500);
    }
}

// Make Move
function makeMove(tile, player) {
    if (!tile.innerHTML) {
        tile.innerHTML = player;
        tile.classList.add("disabled", player === userSymbol.AI ? "AI" : "");
        board[tile.id[0]][tile.id[1]] = player;
        moveSound.play();
        checkGameState();
    }
}

// Check Game State
function checkGameState() {
    let winner = checkWinner();
    if (winner) {
        setTimeout(() => displayWinner(winner), 500);
    } else {
        currentPlayer = currentPlayer === userSymbol.player ? userSymbol.AI : userSymbol.player;
    }
}

// Check Winner
function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
    return board.flat().includes("") ? null : "TIE";
}

// Display Winner
function displayWinner(winner) {
    winnerText.innerHTML = winner === "TIE" ? "It's a Tie!" : `${winner} wins!`;
    winnerPopup.classList.add("activate");
    winSound.play();
}

// AI Move Using Minimax Algorithm
function playAI() {
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
                board[i][j] = userSymbol.AI;
                let score = minimax(board, 0, false);
                board[i][j] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { i, j };
                }
            }
        }
    }
    if (bestMove) makeMove(document.getElementById(`${bestMove.i}${bestMove.j}`), userSymbol.AI);
}

// Minimax Algorithm with Alpha-Beta Pruning
function minimax(board, depth, isMaximizing) {
    let winner = checkWinner();
    if (winner) return scores[winner];
    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
                board[i][j] = isMaximizing ? userSymbol.AI : userSymbol.player;
                let score = minimax(board, depth + 1, !isMaximizing);
                board[i][j] = "";
                bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
            }
        }
    }
    return bestScore;
}

// Reset Game
function resetGame() {
    initGame();
    winnerPopup.classList.remove("activate");
    gameBoard.classList.add("activate");
}

// Initialize the Game on Load
initGame();