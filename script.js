let balance = 500;
let dealer = 0;
let player = 0;
let second = 0;
let dealerHasAce = false;
let playerHasAce = false;
let secondHasAce = false;
let doubleBet = false;
let canSplit = false;
let didSplit = false;
let cards=["A",2,3,4,5,6,7,8,9,10,"J","Q","K"];
let card1,card2;
let splitHand = 1;
let cardsNumber = 312;
let frequency = Array.from({ length: 4 }, () => Array(13).fill(6));
let endRound = false;

window.onload = function() { //When page loads
    dealerHand = document.getElementById("dealer");
    playerHand = document.getElementById("player");
    betButton = document.getElementById("bet");
    hitButton = document.getElementById("hit");
    standButton = document.getElementById("stand");
    splitButton = document.getElementById("split");
    doubleButton = document.getElementById("double");
    hitSplitButton = document.getElementById("hitSplit");
    standSplitButton = document.getElementById("standSplit");
    message = document.getElementById("message");
    message.innerHTML = "";
    dealerH = document.getElementById("dealerH");
    playerH = document.getElementById("playerH");
    secondHand = document.getElementById("second");
    secondH = document.getElementById("secondH");
    reshuffle = document.getElementById("reshuffle");
    updateBalance();
    for(let i=0;i<53;i++) {
        var image = new Image();
        image.src = `./cards/${i}.png`;
    }
}
    
function updateBalance() { //Updates balance
    const balanceValue = document.getElementById("balance");
    balanceValue.innerHTML = "Balance: " + balance + "€";
    betButton.style.display = "inline";
    hitButton.style.display = "none";
    standButton.style.display = "none";
    splitButton.style.display = "none";
    doubleButton.style.display = "none";
    hitSplitButton.style.display = "none";
    standSplitButton.style.display = "none";
    reshuffle.style.display = "none";
    if(cardsNumber < 75 && endRound==true) {
        reshuffle.style.display = "block";
        setTimeout(doReshuffle,1500);
    }
}

function bet() { //Betting
    if(balance >= 50){
        balance -= 50;
        updateBalance();
        startRound();
    }
    else alert("Not enough money!");
}

function selectCard(hand) {
    let found = false;
    let card = 0;
    let suit = 0;
    while(found==false) {
        card = Math.floor(Math.random() * 13);
        suit = Math.floor(Math.random() * 4);
        if(frequency[suit][card] > 0) {
            frequency[suit][card]--;
            cardsNumber--;
            found=true;
        }
    }
    const cardContainer = document.getElementById("card-container-"+hand);
    let img = document.createElement("img");
    img.src = `./cards/${suit*13+card}.png`;
    img.classList.add("w-21", "h-27");
    cardContainer.appendChild(img);
    return card;
}

function doReshuffle() {
    frequency.forEach(row => row.fill(6));
    reshuffle.style.display = "none";
    cardsNumber = 312;
}

function startRound() { //Dealing first cards
    endRound = false;
    message.innerHTML = "";
    dealerH.innerHTML = "";
    playerH.innerHTML = "";
    secondH.innerHTML = "";
    betButton.style.display = "none";
    dealerHand.innerHTML = "Dealer's Hand: ";
    playerHand.innerHTML = "Your Hand: ";
    secondHand.innerHTML = "";
    dealer = 0;
    player = 0;
    second = 0;
    splitHand = 1;
    dealerHasAce = false;
    playerHasAce = false;
    secondHasAce = false;
    doubleBet = false;
    canSplit = false;
    didSplit = false;
    for(let i=1;i<4;i++) {
        const cardContainer = document.getElementById("card-container-"+i);
        cardContainer.innerHTML = '';
    }
    for(let i=0;i<3;i++)
    {
        let card;
        if(i==2){
            card = selectCard(1);
            if(card==0) dealerHasAce = true;
            if(card>9) dealer += 10;
            else dealer += card+1;
        }
        else {
            card = selectCard(2);
            if(card==0) playerHasAce = true;
            if(card>9) player += 10;
            else player += card+1;
        }
        if(i==0) card1=card;
        if(i==1) card2=card;
    }
    if (card1==card2) canSplit = true;
    if(dealerHasAce) dealerH.innerHTML ="("+ dealer + "/" + Number(dealer+10)+")";
    else dealerH.innerHTML = "("+dealer+")";
    if(playerHasAce) playerH.innerHTML ="("+ player + "/" + Number(player+10)+")";
    else playerH.innerHTML = "("+player+")";
    if((Number(player + 10) == 21 && playerHasAce)) {
        playerH.innerHTML = "(21)";
        blackjack();
    }
    else
    {
        hitButton.style.display = "inline";
        standButton.style.display = "inline";
        splitButton.style.display = "none";
        doubleButton.style.display = "inline";
    }
    if(canSplit) splitButton.style.display = "inline";
}

function hit() { //Hit
    doubleButton.style.display = "none";
    splitButton.style.display = "none";
    playerHasAce = false;
    let card = selectCard(2);
    if(card==0) playerHasAce = true;
    if(card>9) player += 10;
    else player += card+1;
    if(playerHasAce && Number(player+10)<=21) playerH.innerHTML ="("+ player + "/" + Number(player+10)+")";
    else playerH.innerHTML = "("+player+")";
    if(player>21 && didSplit==false) lose();
}

function stand() { //Stand
    hitButton.style.display = "none";
    standButton.style.display = "none";
    splitButton.style.display = "none";
    doubleButton.style.display = "none";
    hitSplitButton.style.display = "none";
    standSplitButton.style.display = "none";
    if(playerHasAce) {
        player+=10;
        playerHasAce = false;
        playerH.innerHTML = "("+player+")";
    }
    if(dealer>=17) {
        dealerH.innerHTML = "("+dealer+")";
        if(didSplit == false) {
            if(player<dealer && dealer<=21) lose();
            else if (player==dealer) draw();
            else win();
        }
        else {
            let handsWon = 0;
            let handsLost = 0;
            if(player>dealer || dealer>21) handsWon++;
            else if (player<dealer && dealer<=21) handsLost++;
            if(second>dealer || dealer>21) handsWon++;
            else if (second<dealer && dealer<=21) handsLost++;
            splitWin(handsWon,handsLost);
        }
    }
    else setTimeout(drawCard,1500);
}

function double() { //Double
    if(balance >= 50){
        balance -= 50;
        updateBalance();
        betButton.style.display = "none";
        hitButton.style.display = "none";
        standButton.style.display = "none";
        splitButton.style.display = "none";
        doubleButton.style.display = "none";
        doubleBet = true;
        hit();
        if(player<=21) stand();
    }
    else alert("Not enough money!");
}

function split() { //Split
    if(balance < 50) alert("Not enough money!");
    else {
        balance -= 50;
        updateBalance();
        const cardContainer = document.getElementById("card-container-2");
        const cardContainer2 = document.getElementById("card-container-3");
        const cardToSplit = cardContainer.removeChild(cardContainer.lastChild); 
        cardContainer2.appendChild(cardToSplit);
        betButton.style.display = "none";
        hitSplitButton.style.display = "inline";
        standSplitButton.style.display = "inline";
        hitSplitButton.innerHTML = "Hit 1st";
        standSplitButton.innerHTML = "Stand 1st";
        didSplit = true;
        player = player/2;
        second = player;
        if(playerHasAce) secondHasAce == true;
        if(playerHasAce) playerH.innerHTML ="("+ player + "/" + Number(player+10)+")";
        else playerH.innerHTML = "("+player+")";
        secondHand.innerHTML = "2nd Hand: ";
        if(playerHasAce) secondH.innerHTML ="("+ second + "/" + Number(second+10)+")";
        else secondH.innerHTML = "("+second+")";
    }
}

function hitSplit() { //Hit on Split
    if(splitHand==1) {
        hit();
        if(player>21) standSplit();
    }
    else {
        secondHasAce = false;
        let card = selectCard(3);
        if(card==0) secondHasAce = true;
        if(card>9) second += 10;
        else second += card+1;
        if(secondHasAce && Number(second+10)<=21) secondH.innerHTML ="("+ second + "/" + Number(second+10)+")";
        else secondH.innerHTML = "("+second+")";
        if(second>21) stand();
    }
}

function standSplit() { //Stand on Split
    if(splitHand==1) {
        splitHand=2;
        hitSplitButton.innerHTML = "Hit 2nd";
        standSplitButton.innerHTML = "Stand 2nd";
        if(playerHasAce) {
            player+=10;
            playerHasAce = false;
            playerH.innerHTML = "("+player+")";
        }
    }
    else {
        if(secondHasAce) {
            second+=10;
            secondHasAce = false;
            secondH.innerHTML = "("+second+")";
        }
        hitSplitButton.style.display = "none";
        standSplitButton.style.display = "none";
        stand();
    }
}

function drawCard() { //Dealer draws card
    let card = selectCard(1);
    if(card==0) dealerHasAce = true;
    if(card>9) dealer += 10;
    else dealer += card+1;
    if(dealerHasAce && Number(dealer+10)<=21 && Number(dealer+10)>=17) dealer+=10;
    if(dealerHasAce && Number(dealer+10)<=17) dealerH.innerHTML ="("+ dealer + "/" + Number(dealer+10)+")";
    else dealerH.innerHTML = "("+dealer+")";
    dealerHasAce = false;
    stand();
}

function blackjack() { //Win round by blackjack
    endRound = true;
    message.innerHTML = "You won by blackjack!";
    balance +=150;
    updateBalance();
}

function win() { //Win round
    endRound = true;
    message.innerHTML = "You won!";
    if(doubleBet) balance +=200;
    else balance +=100;
    updateBalance();
}

function lose() { //Lose round
    endRound = true;
    message.innerHTML = "You lost.";
    updateBalance();
}

function draw() { //Draw round
    endRound = true;
    message.innerHTML = "You drew.";
    if(doubleBet) balance +=100;
    else balance +=50;
    updateBalance();
}

function splitWin(handsWon,handsLost) {
    endRound = true;
    if((handsWon+handsLost)==0) {
        message.innerHTML = "You drew both.";
        balance +=100;
        updateBalance();
    }
    else if((handsWon+handsLost)==1) {
        if(handsLost==0)
        {
            message.innerHTML = "You won one and drew one.";
            balance +=150;
            updateBalance();
        }
        else {
            message.innerHTML = "You lost one and drew one.";
            balance +=50;
            updateBalance();
        }
    }
    else {
        if(handsWon==2)
            {
                message.innerHTML = "You won both.";
                balance +=200;
                updateBalance();
            }
            else if(handsLost==2) {
                message.innerHTML = "You lost both.";
                updateBalance();
            }
            else {
                message.innerHTML = "You won one and lost one.";
                balance +=100;
                updateBalance();
            }
    }
}
