
const playSound = (fileName)=>{
    (new Audio(`./sounds/${fileName}.mp3`)).play();
};

const blinkButton=(color)=>{
    $(`.btn.${color}`).fadeOut('slow').fadeIn('slow');
    playSound(color);
};

const pressButton = (color)=>{
    const btn = $(`.btn.${color}`);
    btn.addClass('pressed');
    playSound(color);
    setTimeout(()=>{
        btn.removeClass('pressed');
    }, 100);
};

const game = {
    gameOn: false,
    level: 0,
    colors: ['green', 'red', 'yellow', 'blue'],
    gameSequence: [],
    playerSequence:[],
    endOfSequence:function(){
        return this.gameSequence.length === this.playerSequence.length;
    },
    incrementLevel: function(){
        this.level +=1;
        $('#level-title').text(`Level ${this.level}`);
    },
    addPlayerColor:function(color){
        this.playerSequence.push(color);
        //this.incrementLevel();
    },
    nextColor: function(){
        const len = this.colors.length;
        const ind = Math.floor(Math.random()*len);
        const nextColor = this.colors[ind];
        this.gameSequence.push(nextColor);
        this.incrementLevel();
        blinkButton(nextColor);
        
    },
    resetPlayerSequence: function(){
        this.playerSequence.length = 0;
    },
    resetGameSequence: function(){
        this.gameSequence.length = 0;
    },
    resetGame: function(){
        this.gameOn = false;
        this.resetGameSequence();
        this.resetPlayerSequence();
        this.level = 0;
        $('#level-title').text(`You lose, press any key to play again`);
    },
    startGame: function(){
        this.gameOn = true;
        this.nextColor();
        $('#level-title').text(`Level ${this.level}`);
    },
    check: function(){
        const {playerSequence, gameSequence} = this;
        const ind = playerSequence.length-1;
        //const ind = this.level - 1;
        return playerSequence[ind] === gameSequence[ind];
    }
};

$(document).on('keydown', ()=>{
    game.startGame();
})

$('.btn').on('click', (evnt)=>{
    if (game.gameOn){
        const color = evnt.target.id;
        pressButton(color);
        game.addPlayerColor(color);
        if (game.check()) {
            if (game.endOfSequence()){
                setTimeout(()=>{
                    game.nextColor();
                    game.resetPlayerSequence();
                }, 500);         
            }
        }else{
            $('body').addClass('game-over');
            playSound('wrong');
            setTimeout(()=>{
                $('body').removeClass('game-over');
            },100);
            game.resetGame();
        }
    }
    
})