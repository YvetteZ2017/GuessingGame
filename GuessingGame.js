function generateWinningNumber (){
    return 1+Math.floor(Math.random()*100);
}

function shuffle (arr){
    var m=arr.length;
    var t, i;
    while(m){
        i=Math.floor(Math.random()*m--);
        t=arr[m];
        arr[m]=arr[i];
        arr[i]=t;
    }
    return arr;
}

function Game(){
    this.playersGuess=null;
    this.pastGuesses=[];
    this.winningNumber=generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess > this.winningNumber){
        return false;
    } else if(this.playersGuess < this.winningNumber){
        return true;
    }
}

Game.prototype.playersGuessSubmission = function(n){
    if (n<1 || n>100 || typeof n !== 'number'){
        throw 'That is an invalid guess.';
    } else{
        this.playersGuess=n;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function(){
    if (this.playersGuess==this.winningNumber){
        $('h1').text("You Win!");
        $('h3').text("Click on RESET to start a new game.");
        $('#submit','#hint').prop("disabled",true);
        return;
    } else if(this.pastGuesses.indexOf(this.playersGuess)!==-1){
        return 'You have already guessed that number.';
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);
        if(this.pastGuesses.length<5){
            var diff=this.difference();
            if(diff<10){
                return "You\'re burning up!";
            } else if(diff<25 && diff>=10){
                return 'You\'re lukewarm.';
            } else if(diff<50 && diff>=25){
                return "You\'re a bit chilly.";
            } else if(diff>=50){
                return "You\'re ice cold!";
            } 
        } else{
            $('h1').text("You Lose!");
            $('h3').text("Click on RESET to start a new game.");
            $('#submit','#hint').prop("disabled",true);
            return 'You Lose.';
        }
    }
}

var newGame = function(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var arr=[this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(arr);
}

function guess(game){
    var value=+$('#input').val();
    $('#input').val("");
    var str=game.playersGuessSubmission(value);
    $('h2').text(str);
    
}

$(document).ready(function(){
    var game = new Game();
    $('#submit').on('click',function(){
        guess(game);
    });
    $('#input').on('keypress',function(event){
        if(event.keyCode==13){
            guess(game);
        }
    })

    $('#reset').on('click',function(){
        game = new Game();
        $('h2').text('Take a Guess');
        $('h1').text('Guessing Game');
        $('h3').text('Guess a number between 1 and 100.')
        $('.guess').text('_');
    });

    $('#hint').on('click',function(){
        var hints=game.provideHint();
        $('h2').text("The number is among "+hints[0]+", "+hints[1]+", and "+hints[2]+".");
    })
})

