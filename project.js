
// importing the a package to take input from the user
const prompt = require("prompt-sync")();

// Size and design of Slot machine

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
    A:2,
    B:4,
    C:6,
    D:8
}

const SYMBOL_VALUES = {
    A:5,
    B:4,
    C:3,
    D:2
}

// To deposit an amount

const deposit = () =>{
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ")
        //string to float, if entered is a string then returns NaN
        const numberDepositAmount = parseFloat(depositAmount);
        if (isNaN(numberDepositAmount) || numberDepositAmount<=0){
            console.log("Invalid deposit amount, try again")
        }
        else{
            return numberDepositAmount;
        }
    }
}

//Number of lines to bet on

const getNumberOfLines = () =>{
    while(true){
        const lines = prompt("Enter the number of lines to bet on (1-3): ")
        const numberOfLines = parseInt(lines);
        if (isNaN(numberOfLines) || numberOfLines<=0 || numberOfLines>3){
            console.log("Invalid number of lines, try again")
        }
        else{
            return numberOfLines;
        }
    }
}

// Amount the user can bet on (based on balance and lines)

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ")
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet<=0 || numberBet>balance/lines){
            console.log("Invalid bet amount, try again")
        }
        else{
            return numberBet;
        }
    }
}

// spinning the Slot machine

const spin = () => {
    const symbols = [];
    for (const [symbol,count] of Object.entries(SYMBOL_COUNT)){
        for (let i = 0; i< count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i<COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols]; //copying symbols to reelSymbols since we want all symbols for each column
        for (let j =0;j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); //To generate a number in range of the list reelSymbols => choosing from available symbols
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); //removing index so we dont select it again
        }
    }
    return reels;
}

// Transposing the reels to represent in column manner

const transpose = (reels) =>{
    const rows = [];
    for (let i = 0; i<ROWS; i++){
        rows.push([]);
        for (let j = 0; j<COLS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows
}

// Printing the rows column wise

const printRows = (rows) =>{
    for (const row of rows){
        let rowstring = "";
        for (const [i, symbol] in row.entries()){
            rowstring += symbol;
            if (i != row.length - 1){
                rowstring += " | ";
            }
        }
        console.log(rowstring)
    }    
}

// Getting the winning amount

const getWinnings = (rows, bet, lines) =>{
    let winnings = 0;

    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if (allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings
}

// Main function of the game

const game = () =>{
    let balance = deposit();

    while(true){
        console.log("You have a balance of $ " + balance)
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings
        console.log("You won, " + winnings.toString());
        if (balance <= 0) {
            console.log("You ran out of money!!");
            break;
        }
        const playAgain = prompt("Do you want to play again? (y/n)")
        if (playAgain != "y") break;
    }
}

game();