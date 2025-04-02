let balance = 500;
let dealer = 0;
let player = 0;
let dealerHasAce = false;
let playerHasAce = false;
let doubleBet = false;
let cards=["A",2,3,4,5,6,7,8,9,10,"J","Q","K"];

window.onload = function() { //When page loads
    dealerHand = document.getElementById("dealer");
    playerHand = document.getElementById("player");
    betButton = document.getElementById("bet");
    hitButton = document.getElementById("hit");
    standButton = document.getElementById("stand");
    splitButton = document.getElementById("split");
    doubleButton = document.getElementById("double");
    message = document.getElementById("message");
    message.innerHTML = "";
    dealerH = document.getElementById("dealerH");
    playerH = document.getElementById("playerH");
    updateBalance();
}

function updateBalance() { //Updates balance
    const balanceValue = document.getElementById("balance");
    balanceValue.innerHTML = "Balance: " + balance + "€";
    betButton.style.display = "block";
    hitButton.style.display = "none";
    standButton.style.display = "none";
    splitButton.style.display = "none";
    doubleButton.style.display = "none";
}

function bet() { //Betting
    if(balance >= 50){
        balance = balance - 50;
        updateBalance();
        startRound();
    }
    else alert("Not enough money!");
}

function startRound() { //Dealing first cards
    message.innerHTML = "";
    dealerH.innerHTML = "";
    playerH.innerHTML = "";
    betButton.style.display = "none";
    dealerHand.innerHTML = "Dealer's Hand: ";
    playerHand.innerHTML = "Your Hand: ";
    dealer = 0;
    player = 0;
    dealerHasAce = false;
    playerHasAce = false;
    for(let i=0;i<3;i++)
    {
        let card = Math.floor(Math.random() * 13);
        if(i==2){
            dealerHand.innerHTML = dealerHand.innerHTML + cards[card] + " ";
            if(card==0) dealerHasAce = true;
            if(card>9) dealer += 10;
            else dealer += card+1;
        }
        else {
            playerHand.innerHTML = playerHand.innerHTML + cards[card] + " ";
            if(card==0) playerHasAce = true;
            if(card>9) player += 10;
            else player += card+1;
        }
    }
    if(dealerHasAce) dealerH.innerHTML ="("+ dealer + "/" + Number(dealer+10)+")";
    else dealerH.innerHTML = "("+dealer+")";
    if(playerHasAce) playerH.innerHTML ="("+ player + "/" + Number(player+10)+")";
    else playerH.innerHTML = "("+player+")";
    if((Number(player + 10) == 21 && playerHasAce)) {
        blackjack();
        playerH.innerHTML = "(21)";
    }
    else
    {
        hitButton.style.display = "inline";
        standButton.style.display = "inline";
        splitButton.style.display = "none";
        doubleButton.style.display = "none";
    }
}

function hit() { //Hit
    playerHasAce = false;
    let card = Math.floor(Math.random() * 13);
    if(card==0) playerHasAce = true;
    if(card>9) player += 10;
    else player += card+1;
    playerHand.innerHTML = playerHand.innerHTML + cards[card] + " ";
    if(playerHasAce && Number(player+10)<=21) playerH.innerHTML ="("+ player + "/" + Number(player+10)+")";
    else playerH.innerHTML = "("+player+")";
    if(player>21) lose();
}

function stand() { //Stand
    if(playerHasAce) {
        player+=10;
        playerHasAce = false;
        playerH.innerHTML = "("+player+")";
    }
    if(dealer>=17) {
        dealerH.innerHTML = "("+dealer+")";
        if(player<dealer && dealer<=21) lose();
        else if (player==dealer) draw();
        else win();
    }
    else setTimeout(drawCard,1500);
}

function drawCard() { //Dealer draws card
    let card = Math.floor(Math.random() * 13);
    if(card==0) dealerHasAce = true;
    if(card>9) dealer += 10;
    else dealer += card+1;
    dealerHand.innerHTML = dealerHand.innerHTML + cards[card] + " ";
    if(dealerHasAce && Number(dealer+10)<=21 && Number(dealer+10)>=17) dealer+=10;
    if(dealerHasAce && Number(dealer+10)<=17) dealerH.innerHTML ="("+ dealer + "/" + Number(dealer+10)+")";
    else dealerH.innerHTML = "("+dealer+")";
    dealerHasAce = false;
    stand();
}

function blackjack() { //Win round by blackjack
    message.innerHTML = "You won by blackjack!";
    balance +=150;
    updateBalance();
}

function win() { //Win round
    message.innerHTML = "You won!";
    if(doubleBet) balance +=200;
    else balance +=100;
    updateBalance();
}

function lose() { //Lose round
    message.innerHTML = "You lost.";
    updateBalance();
}

function draw() { //Draw round
    message.innerHTML = "You drew.";
    if(doubleBet) balance +=100;
    else balance +=50;
    updateBalance();
}