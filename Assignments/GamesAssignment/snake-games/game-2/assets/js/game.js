var snake, apple, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var Game = {

    preload : function() {
        
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('1','./assets/images/1.png');
        game.load.image('2','./assets/images/2.png');
        game.load.image('3','./assets/images/3.png');
        
    },

    create : function() {

        

        snake = [];                     
        apple = {};                     
        squareSize = 15;                
        score = 0;                      
        speed = 0;                      
        updateDelay = 0;                
        direction = 'right';            
        new_direction = null;           
        addNew = false;                 

        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#9999ff';

        // Generate the initial snake stack. Our snake will be 10 elements long.
        for(var i = 0; i < 10; i++){
            snake[i] = game.add.sprite(150+i*squareSize, 150, 'snake');  // Parameters are (X coordinate, Y coordinate, image)
        }


        
        this.generateWords();

        // Add Text to top of game.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // Score.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Speed.
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

    },

    update: function() {

        if (cursors.right.isDown && direction!='left'){
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction!='right'){
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction!='down'){
            new_direction = 'up';
        }
        else if (cursors.down.isDown && direction!='up'){
            new_direction = 'down';
        }

        
        speed = Math.min(10, Math.floor(score/5));
        speedTextValue.text = '' + speed;
        updateDelay++;

        if (updateDelay % (10 - speed) == 0) {

            var firstCell = snake[snake.length - 1],
            lastCell = snake.shift(),
            oldLastCellx = lastCell.x,
            oldLastCelly = lastCell.y;

            if(new_direction){
                direction = new_direction;
                new_direction = null;
            }

            if(direction == 'right'){

                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'left'){
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if(direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }

            snake.push(lastCell);
            firstCell = lastCell;

            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            this.wordCollision();

            this.selfCollision(firstCell);

            this.wallCollision(firstCell);
            }

        
    },

    generateWords: function(){

        var randomX, randomY, randomA, randomB, randomC, randomD, loopflag1, loopflag2;
        randomX = Math.floor(Math.random() * 40 ) * squareSize;
        randomY = Math.floor(Math.random() * 30 ) * squareSize;
        randomA = Math.floor(Math.random() * 40 ) * squareSize;
        randomB = Math.floor(Math.random() * 30 ) * squareSize;
        randomC = Math.floor(Math.random() * 40 ) * squareSize;
        randomD = Math.floor(Math.random() * 30 ) * squareSize;
        
        while(randomA == randomX && randomB == randomY){
            randomA = Math.floor(Math.random() * 40 ) * squareSize;
            randomB = Math.floor(Math.random() * 30 ) * squareSize;
        } 
        while((randomA == randomX && randomB == randomY) || (randomA == randomX && randomB == randomY)){
            randomC = Math.floor(Math.random() * 40 ) * squareSize;
            randomD = Math.floor(Math.random() * 30 ) * squareSize;
        }

        
        var langjsonurl = './assets/json/rhyming.json';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var text = xmlhttp.responseText;
                var jsonobj = $.parseJSON(text);
                
                
                var numb = Math.floor(Math.random() * 9 );
                
                document.getElementById('question').innerHTML = '<h3>'+jsonobj[String(numb)]['word']+'</h3>';

                var question = jsonobj[String(numb)];
                
                var qtext='';  
                var corrind = Math.floor(Math.random()*3),wrind1=0, wrind2=0;
                
                var i;
                for( i=1;i<4;i++){
                    if(i!= corrind && wrind1 ==0){
                    wrind1 = i;
                    }
                    if(i != corrind && i!= wrind1 && wrind2 ==0){
                        wrind2 =i;
                    }
                }
                var correctword, wrongword1, wrongword2;
                

                if(corrind == 1){
                    window.correctword = game.add.image(randomX, randomY, '1');
                    
                    window.sessionStorage.setItem('correctwordx',window.correctword.x);
                    window.sessionStorage.setItem('correctwordy',window.correctword.y);
                    
                    qtext+= "1. "+question['correctword']+"   ";
                }
                else if(wrind1 ==1){
                    window.wrongword1 = game.add.image(randomA,randomB,'1');
                    qtext+= "1. "+question['wrong1']+"   ";    
                }
                else if(wrind2 == 1){
                    window.wrongword2 = game.add.image(randomC,randomD,'1');
                    qtext+= "1. "+question['wrong2']+"   ";
                }

                if(corrind == 2){
                    window.correctword = game.add.image(randomX, randomY, '2');
                    
                    window.sessionStorage.setItem('correctwordx',window.correctword.x);
                    window.sessionStorage.setItem('correctwordy',window.correctword.y);
                    
                    qtext+= "2. "+question['correctword']+"   ";
                }
                else if(wrind1 == 2){
                    qtext+= "2. "+question['wrong1']+"   ";  
                    window.wrongword1 = game.add.image(randomA,randomB,'2');  
                }
                else if(wrind2 == 2){
                    qtext+= "2. "+question['wrong2']+"   ";
                    window.wrongword2 = game.add.image(randomC,randomD,'2');
                }

                if(corrind == 3){
                    window.correctword = game.add.image(randomX, randomY, '3');
                        window.sessionStorage.setItem('correctwordx',window.correctword.x);
                        window.sessionStorage.setItem('correctwordy',window.correctword.y);
                        qtext+= "3. "+question['correctword']+"   ";
                }
                else if(wrind1 == 3){
                    qtext+= "3. "+question['wrong1']+"   ";  
                    window.wrongword1 = game.add.image(randomA,randomB,'3');  
                }
                else if(wrind2 == 3){
                    qtext+= "3. "+question['wrong2']+"   ";
                    window.wrongword2 = game.add.image(randomC,randomD,'3');
                }
                
           
                document.getElementById('content-wrapper').innerHTML = '<p>'+jsonobj['game_description']+'</p>';
                document.getElementById('question').innerHTML+= '<p>'+qtext+'</p>';    

           }
        }
        xmlhttp.open("GET", langjsonurl, true);
        xmlhttp.send(); 
        
    },

    wordCollision: function() {

        for(var i = 0; i < snake.length; i++){
           
            correctwordx = window.sessionStorage.getItem('correctwordx');
            correctwordy = window.sessionStorage.getItem("correctwordy");
       
            if(snake[i].x == correctwordx && snake[i].y == correctwordy){
                window.correctword.destroy();
                window.wrongword1.destroy();
                window.wrongword2.destroy();
                addNew = true;
                score++;
                this.generateWords();
                scoreTextValue.text = score.toString();
            }
        }

    },

    selfCollision: function(head) {
        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){

            
                game.state.start('Game_Over');
            }
        }

    },

    wallCollision: function(head) {
        if(head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0){
            game.state.start('Game_Over');
        }

    }
  };  

   
  