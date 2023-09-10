var snake={};
var gameID;
var blitzID;

class Queue {
    constructor(item){
        this.items = {0:item}
        this.frontIndex=0;
        this.backIndex=1;
    }
    add(item){
        this.items[this.backIndex] = item;
        this.backIndex++;
    }
    delete(){
        delete this.items[this.frontIndex];
        this.frontIndex++;
    }
}

function makeGridBtnPress(){
    document.getElementById('length').innerHTML = '1';
    const listOfItems = document.getElementsByClassName('item');
    for(let item of listOfItems){
        item.style.opacity = 0.5;
    }
    const listOfStarts = document.getElementsByClassName('start');
    for(let start of listOfStarts){
        start.style.opacity = 1;
    }
    makeGrid(parseInt(document.getElementById('gridValue').value));
}

function makeSmallGrid(smallHeight,smallWidth){
    const smallGrid = document.createElement('div');
    smallGrid.style.width = smallWidth
    smallGrid.style.height = smallHeight;
    smallGrid.style.borderColor = 'white';
    smallGrid.style.backgroundColor = 'black';
    smallGrid.style.borderStyle = 'inset';
    smallGrid.style.boxSizing = 'border-box';

    return smallGrid;
}

function makeGrid(length){
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const smallHeight = (100/length).toString()+'%';
    const smallWidth = (100/length).toString()+'%';
    let i=0;
    while(i<length){
        let j=0;
        while(j<length){
            const smallGrid = makeSmallGrid(smallHeight,smallWidth);
            const id = i.toString()+'-'+j.toString();
            smallGrid.setAttribute('id',id);
            grid.appendChild(smallGrid);
            j++;
        }
        i++;
    }
}

function genRandomCoordinate(length){
    length = parseInt(length);
    const values = Object.values(snake.blocks.items);
    const newSet = new Set(values);
    let newBlock;
    do{
        newBlock = Math.floor(Math.random()*(length))+'-'+Math.floor(Math.random()*(length));
    } while(newSet.has(newBlock));
    return newBlock;
}

function checkOverlap(){
    const values = Object.values(snake.blocks.items);
    const newSet = new Set(values);
    if(newSet.has(snake.head_row+'-'+snake.head_column))
        return -1;
    else
        return 0;
}

function start(){
    const blitz = document.getElementById('blitz').value;
    const speed = parseFloat(document.getElementById('speed').value);
    document.getElementById('length').style.display = 'block';
    const length = document.getElementById('gridValue').value;
    let food;

    function newFood(){
        food = genRandomCoordinate(length);
        document.getElementById(food).style.backgroundColor = 'blue';
    }

    snake = {
        length:1,
        head_row:'0',
        head_column:'0',
        direction:'right',
        blocks:new Queue('0-0')
    };

    if(blitz === 'OFF')
        newFood();
    if(blitz !== 'OFF'){
        var blitzCall = function (){
            clearInterval(blitzID);
            newFood();
            blitzID = setInterval(()=>{
                document.getElementById(food).style.backgroundColor = 'black';
                newFood();
            },5000);
        }
        blitzCall();
    }
    document.addEventListener('keydown',(event)=>{
        if(event.key === 'ArrowUp')
            snake.direction = 'up';
        else if(event.key === 'ArrowDown')
            snake.direction = 'down';
        else if(event.key === 'ArrowRight')
            snake.direction = 'right';
        else if(event.key === 'ArrowLeft')
            snake.direction = 'left';
    });
    gameID = setInterval(()=>{
        document.getElementById(snake.head_row+'-'+snake.head_column).style.backgroundColor = 'red';

        const current = snake.head_row+'-'+snake.head_column;
        const timeOutID = setTimeout(()=>{
            document.getElementById(current).style.backgroundColor = 'black';
        },snake.length*500/speed);

        if(snake.direction === 'right' && snake.head_column < length-1)
            snake.head_column = (parseInt(snake.head_column) +1).toString();
        else if(snake.direction === 'left' && snake.head_column > 0)
            snake.head_column = (parseInt(snake.head_column) -1).toString();
        else if(snake.direction === 'up' && snake.head_row > 0)
            snake.head_row = (parseInt(snake.head_row) -1).toString();
        else if(snake.direction === 'down' && snake.head_row < length-1)
            snake.head_row = (parseInt(snake.head_row) +1).toString();
        else{
            if(snake.direction === 'right' && snake.head_column >= length-1){
                if(snake.head_row >= length-1){
                    snake.head_row = (parseInt(snake.head_row) -1).toString();
                    snake.direction = 'up';
                }
                else{
                    snake.head_row = (parseInt(snake.head_row) +1).toString();
                    snake.direction = 'down';    
                }
            }
            else if(snake.direction === 'left' && snake.head_column <= 0){
                if(snake.head_row <= 0){
                    snake.head_row = (parseInt(snake.head_row) +1).toString();
                    snake.direction = 'down';
                }
                else{
                    snake.head_row = (parseInt(snake.head_row) -1).toString();
                    snake.direction= 'up';
                }
            }
            else if(snake.direction === 'up' && snake.head_row <= 0){
                if(snake.head_column >= length-1){
                    snake.head_column = (parseInt(snake.head_column)-1).toString();
                    snake.direction= 'left';}
                else{
                    snake.head_column = (parseInt(snake.head_column)+1).toString();
                    snake.direction = 'right';
                }
            }
            else if(snake.direction === 'down' && snake.head_row >= length-1){
                if(snake.head_column <= 0){
                    snake.head_column = (parseInt(snake.head_column)+1).toString();
                    snake.direction = 'right';
                }
                else{
                    snake.head_column = (parseInt(snake.head_column)-1).toString();
                    snake.direction = 'left';
                }
            }
            else{
                console.log('WTF!');
                stop();
            }
        }
        if(checkOverlap() === -1){
            console.log('OVERLAP!');
            stop();
        }
        if((snake.head_row+'-'+snake.head_column) === food){
            if(blitz === 'OFF')
                newFood();
            else
                blitzCall();
            snake.length = snake.length+1;
            document.getElementById('length').innerHTML = snake.length;
            snake.blocks.add((snake.head_row+'-'+snake.head_column));
        } else {
            snake.blocks.add((snake.head_row+'-'+snake.head_column));
            snake.blocks.delete();
        }
    },500/speed);
}

function stop(){
    clearInterval(gameID);
    clearInterval(blitzID);
    const listOfItems = document.getElementsByClassName('item');
    for(let item of listOfItems){
        item.style.opacity = 1;
    }
    const listOfStarts = document.getElementsByClassName('start');
    for(let start of listOfStarts){
        start.style.opacity = 0.5;
    }
}