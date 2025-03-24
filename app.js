// Initializing all the variable and constants 
let user = 'O';
let AI = 'X';
let currentPlayer = undefined;
// Creating our scoresIndex, in order to keep the AI as the maximizing player.
let scoresIndex;
// Initializing our game board which will be used by the optimizer to find an optimal move
let board = [
    ['','',''],
    ['','',''],
    ['','','']
];
// Select our components from our HTML file.
const whoWillPlayFirst = document.querySelector(".firstOne");
const choose = document.querySelector(".choose");
const card = document.querySelector(".card");
const tiles = document.querySelectorAll(".tile");
const won = document.querySelector(".won");
const celebration = document.getElementById("celebration");
const winnerName = document.getElementById("winner-name");
// The "moves" variable will keep a track of how many moves that have been played. Though it is used only once just to make the AI play Random at first turn.
let moves = 0;


// The below loop assigns a coordinate ID to every tile on the board
for (let i = 0; i < board.length; i++)
{
    for (let j = 0; j < board[0].length; j++)
    {
        tiles[i * 3 + j].setAttribute("onclick", "triggerClick(this)");
        tiles[i * 3 + j].setAttribute("id", i+""+j);
    }
}

// The below function keeps checking if it's AI's turn or not. If yes, then it invokes the function for it's play.
setInterval(()=>{
    if (currentPlayer == AI)
    {
        playAI();
    }
}, 1);



// =============================================================
// =====================FUNCTIONS===============================
// =============================================================

// This function is invoked when the user chooses who will be the first one to make the move.
function firstOne(btn)
{
    if (btn.innerHTML == 'AI')
    {
        currentPlayer = AI;
    }else{
        currentPlayer = user;
    }
    // Changing the visuals
    whoWillPlayFirst.classList.remove("activate");
    card.classList.add("activate");
}

// This function is invoked when user chooses which symbol he/she wants to take.
// This function will reinitialize the symbol values of user and AI, that were defined above at the beginning of the code.
function choice(btn)
{
    user = btn.innerHTML;
    // We assign the values accordingly using switch case.
    switch (user) {
        case 'X':
            AI = 'O';
            // If the user chooses X, then AI will have O and then O will have to be a maximizer, so the Score index is set accordingly.
            scoresIndex = {
                X: -10,
                O: +10,
                TIE: 0
            }
            break;
        case 'O':
            AI = 'X';
            // If the user chooses O, then AI will have X and then X will have to be a maximizer, so the Score index is set accordingly.
            scoresIndex = {
                X: +10,
                O: -10,
                TIE: 0
            }
            break;
        default:
            // Incase something goes wrong.
            console.log("Something went wrong");
            break;
    }
    // Changing the visuals.
    choose.classList.remove('activate');
    whoWillPlayFirst.classList.add("activate");
}

// The below function takes the tile object as parameter and accordingly sets the symbols on the tiles.
function triggerClick(tile)
{
    // If it's user's turn
    if (currentPlayer == user)
    {
        // We Increment the value of "moves".
        moves++;
        tile.innerHTML = currentPlayer;
        // We add a class "disabled" to our tile so that there are no further pointer events on that tile.
        tile.classList.add("disabled");
        board[(tile.id)[0]][(tile.id)[1]] = currentPlayer;
        // Checking if anyone has won or not.
        let x = checkWinner();
        if (x == null)
        {
            // If no one has won and it's not a tie either then continue the game
            currentPlayer = AI;
        }else{
            if (x == "TIE")
            {
                // If it's a Tie, then print it and clear the currentPlayer value to avoid any mess.
                currentPlayer = null;
                setTimeout(() => {
                    displayWinner(x);
                }, 1000);
            }else{
                // If someone has won, then disable every tile and display the winner and clear the currentPlayer value.
                currentPlayer = null;
                disableEveryTile();
                setTimeout(() => {
                    displayWinner(x);
                }, 1000);
            }
        }
    }else{
        // If it's AI's turn
        // We Increment the value of "moves".
        moves++;
        // We add a special class that differentiates user with the AI as AI's symbol colour will be Yellow.
        tile.classList.add("AI");
        tile.innerHTML = currentPlayer;
        // We add a class "disabled" to our tile so that there are no further pointer events on that tile.
        tile.classList.add("disabled");
        board[(tile.id)[0]][(tile.id)[1]] = currentPlayer;
        // Checking if someone has won or not
        let x = checkWinner();
        if (x == null)
        {
            // If no one has won and it's not a tie either then continue the game
            currentPlayer = user;
        }else{
            if (x == "TIE")
            {
                // If it's a Tie, then print it and clear the currentPlayer value to avoid any mess.
                currentPlayer = null;
                setTimeout(() => {
                    displayWinner(x);
                }, 1000);
            }else{
                // If someone has won, then disable every tile and display the winner and clear the currentPlayer value.
                currentPlayer = null;
                disableEveryTile();
                setTimeout(() => {
                    displayWinner(x);
                }, 1000);
            }
        }
    }
}

// This function checks if the characters have same values and are not empty 
function matchChecker(a, b, c)
{
    return a == b && b == c && a != '';
}


// This function checks if someone has won the game
function checkWinner()
{
    // Initialize the winner as null which will indicate that no one has won.
    let winner = null;
    // Horizontal
    for (let i = 0; i < 3; i++)
    {
        if (matchChecker(board[i][0], board[i][1], board[i][2]))
        {
            winner = board[i][0];
        }
    }
    // Vertical
    for (let i = 0; i < 3; i++)
    {
        if (matchChecker(board[0][i], board[1][i], board[2][i]))
        {
            winner = board[0][i];
        }
    }
    // Diagonal
    if (matchChecker(board[0][0], board[1][1], board[2][2]))
    {
        winner = board[0][0];
    }
    if (matchChecker(board[0][2], board[1][1], board[2][0]))
    {
        winner = board[0][2];
    }
    // Checking if there are any empty spots left on the board 
    let emptySpots = 0;
    for (let i = 0; i < board.length; i++)
    {
        for (let j = 0; j < board[0].length; j++)
        {
            if (board[i][j] == '')
            {
                emptySpots++;
            }
        }
    }

    if (winner == null && emptySpots == 0)
    {
        return 'TIE';
    }
    if (winner != null)
    {
        return winner;
    }else{
        return null;
    }
}

// The below function, takes a winner parameter and displays the winner.
function displayWinner(winner)
{
    // Changing visuals
    card.classList.remove("activate");
    const wonTitle = document.querySelector(".won-title");
    // Manipulating text according to who has won the game
    if (winner == AI)
    {
        wonTitle.innerHTML = "AI wins!";
    }else{
        if (winner == 'TIE')
        {
            wonTitle.innerHTML = "IT'S A TIE!";
        }else{
            wonTitle.innerHTML = "You win!";
        }
    }
    // Changing visuals
    won.classList.add("activate");
    celebration.classList.add("activate");
    winnerName.innerHTML = winner == 'TIE' ? "It's a Tie!" : `${winner} wins!`;
}

// The below function makes every tile unclickable.
function disableEveryTile()
{
    for (let i = 0; i < board.length; i++)
    {
        for (let j = 0; j < board[0].length; j++)
        {
            if (!(tiles[i * 3 + j].classList.contains("disabled")))
            {
                tiles[i * 3 + j].classList.add("disabled");
            }
        }
    }
}

// The below function resets the page in case the user wants a replay
function reset()
{
    window.location.reload();
}

// ======================================================================
// ======================================================================
// ==============THIS IS THE BRAIN STRUCTURE OF AI=======================
// ======================================================================
// ======================================================================

// THIS CODE IMPLEMENTS THE MINIMAX ALGORITHM WITH ALPHA-BETA PRUNING...

// The below function makes a move on behalf of the AI
function playAI()
{
    // If it's the first turn of AI then set its symbol at any place at random.
    if (moves == 0) {
        let random = Math.floor((Math.random() * 9));
        let tile = document.getElementById(Math.floor(random / 3) + "" + random % 3);
        triggerClick(tile);
    } else {
        // Applying the minimax algorithm to make a move...
        let maxEval = -Infinity;
        let optimalMove;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] == '') {
                    board[i][j] = AI;
                    let score = minimax(board, 0, -Infinity, +Infinity, false);
                    board[i][j] = '';
                    if (score > maxEval) {
                        maxEval = score;
                        optimalMove = { i, j };
                    }
                }
            }
        }

        if (optimalMove) {
            let tile = document.getElementById(optimalMove.i + "" + optimalMove.j);
            triggerClick(tile);
        } else {
            console.error("No optimal move found");
        }
    }
}

function minimax(board, depth, alpha, beta, maximizingPlayer)
{
    let result = checkWinner();
    if (result != null)
    {
        let score = scoresIndex[result];
        return score;
    }
    if (maximizingPlayer)
    {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++)
        {
            for (let j = 0; j < board[0].length; j++)
            {
                if (board [i][j] == '')
                {
                    board [i][j] = AI;
                    let score = minimax(board, depth + 1, alpha, beta, false);
                    board [i][j] = '';
                    maxEval = Math.max(score, maxEval);
                    alpha = Math.max(score, alpha);
                    if (beta <= alpha)
                    {
                        break;
                    }
                }
            }
        }
        return maxEval;
    }else{
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++)
        {
            for (let j = 0; j < board[0].length; j++)
            {
                if (board [i][j] == '')
                {
                    board [i][j] = user;
                    let score = minimax(board, depth + 1, alpha, beta, true);
                    board [i][j] = '';
                    minEval = Math.min(score, minEval);
                    beta = Math.min(beta, score);
                    if (beta <= alpha)
                    {
                        break;
                    }
                }
            }
        }
        return minEval;
    }
}