var SnakeGame = function() {

    this.FIELD_SIZE_X = 20;

    this.FIELD_SIZE_Y      = 20;
    this.SNAKE_SPEED       = 200;
    this.NEW_FOOD_TIME     = 5000;
    this.NEW_OBSTACLE_TIME = 4000;
    this.counter           = 0;

    this.isGameRunning = false;
    this.snakeTimer;
    this.obstacleTimer;
    this.snake     = [];
    this.obstacles = [];
    this.direction = 'x-';
    
    var _self = this;

    function buildGameField() {
        var gameTable = document.createElement( 'table' );
        gameTable.classList.add( 'game-table' );

        for (var i = 0; i < _self.FIELD_SIZE_X; i++) {
            var row = document.createElement( 'tr' );
            row.classList.add( 'game-table-row' );

            for (var j = 0; j < _self.FIELD_SIZE_Y; j++) {
                var cell = document.createElement( 'td' );
                cell.classList.add( 'game-table-cell' );
                cell.classList.add( 'cell-' + i + "-" + j );

                row.appendChild( cell );
            }
            gameTable.appendChild( row );
        }

        document.getElementById( 'snake-field' ).appendChild( gameTable );
    }

    function respawn() {
        var startCoordX = Math.floor( _self.FIELD_SIZE_X / 2 );
        var startCoordY = Math.floor( _self.FIELD_SIZE_Y / 2 );

        var snakeHead
                = document.getElementsByClassName( 'cell-' + startCoordX + '-' + startCoordY )[ 0 ];
        snakeHead.classList.add( 'snake-unit' );

        var snakeTail
                = document.getElementsByClassName( 'cell-' + (startCoordX - 1) + '-' + startCoordY )[ 0 ];

        snakeTail.classList.add( 'snake-unit' );

        _self.snake = [];

        _self.snake.push( snakeHead );
        _self.snake.push( snakeTail );
    }

    function move() {
        var snakeHeadClasses = _self.snake[ _self.snake.length - 1 ].classList;

        var newUnit;
        var snakeCoords = snakeHeadClasses[ 1 ].split( '-' );
        var coordX      = parseInt( snakeCoords[ 1 ] );
        var coordY      = parseInt( snakeCoords[ 2 ] );

        switch (_self.direction) {
            case 'x-':
                (coordX == 0) && (coordX = _self.FIELD_SIZE_X);
                newUnit = document.getElementsByClassName( 'cell-' + (coordX - 1) + '-' + coordY )[ 0 ];
                break;
            case 'x+':
                (coordX == _self.FIELD_SIZE_X - 1) && (coordX = -1);
                newUnit = document.getElementsByClassName( 'cell-' + (coordX + 1) + '-' + coordY )[ 0 ];
                break;
            case 'y-':
                (coordY == 0) && (coordY = _self.FIELD_SIZE_Y);
                newUnit = document.getElementsByClassName( 'cell-' + coordX + '-' + (coordY - 1) )[ 0 ];
                break;
            case 'y+':
                (coordY == _self.FIELD_SIZE_Y - 1) && (coordY = -1);
                newUnit = document.getElementsByClassName( 'cell-' + coordX + '-' + (coordY + 1) )[ 0 ];
                break;
        }

        if ( newUnit !== undefined && !newUnit.classList.contains( 'snake-unit' ) && !newUnit.classList.contains( 'obstacle-unit' ) ) {
            newUnit.classList.add( 'snake-unit' );
            _self.snake.push( newUnit );

            if ( !newUnit.classList.contains( 'food-unit' ) ) {
                var removed = _self.snake.splice( 0, 1 )[ 0 ];
                removed.classList.remove( 'snake-unit' );
            } else {
                newUnit.classList.remove( 'food-unit' );
                document.getElementById( 'counter' ).innerText = ++_self.counter;

                createFood();
            }
        } else {
            finishGame();
        }
    }

    function createFood() {
        var foodCreated = false;

        while (!foodCreated) {
            var foodX = Math.floor( Math.random() * _self.FIELD_SIZE_X );
            var foodY = Math.floor( Math.random() * _self.FIELD_SIZE_Y );

            var foodCell = document.getElementsByClassName( 'cell-' + foodX + '-' + foodY )[ 0 ];

            if ( !foodCell.classList.contains( 'snake-unit' ) ) {
                foodCell.classList.add( 'food-unit' );
                foodCreated = true;
            }
        }
    }

    function createObstacle() {

        var obstacleCreated = false;

        while (!obstacleCreated) {
            var obstacleX = Math.floor( Math.random() * _self.FIELD_SIZE_X );
            var obstacleY = Math.floor( Math.random() * _self.FIELD_SIZE_Y );

            var obstacle = document.getElementsByClassName( 'cell-' + obstacleX + '-' + obstacleY )[ 0 ];

            if ( !obstacle.classList.contains( 'snake-unit' ) ) {
                obstacle.classList.add( 'obstacle-unit' );
                _self.obstacles.push( obstacle );
                obstacleCreated = true;

                //  Удалить через заданное время
                setTimeout( function() {
                    _self.obstacles.shift().classList.remove( 'obstacle-unit' );
                }, _self.NEW_OBSTACLE_TIME + 2000 );
            }
        }
    }

    function finishGame() {
        clearInterval( _self.snakeTimer );
        clearInterval( _self.obstacleTimer );
        _self.isGameRunning = false;

        alert( 'GAME OVER' );
    }

    function init() {

        var startButton = document.getElementById( 'snake-start' );

        startButton.addEventListener( 'click', function() {
                _self.isGameRunning = true;
                respawn();

                _self.snakeTimer    = setInterval( move, _self.SNAKE_SPEED );
                _self.obstacleTimer = setInterval( createObstacle, _self.NEW_OBSTACLE_TIME );
                setTimeout( createFood, _self.NEW_FOOD_TIME );
            }
        );

        var renewButton = document.getElementById( 'snake-renew' );

        renewButton.addEventListener( 'click', function() {
            location.reload();
        } );

        addEventListener( 'keydown', function( event ) {
            switch (event.keyCode) {
                case 37:
                    if ( _self.direction != 'y+' ) {
                        _self.direction = 'y-';
                    }
                    break;
                case 38:
                    if ( _self.direction != 'x+' ) {
                        _self.direction = 'x-';
                    }
                    break;
                case 39:
                    if ( _self.direction != 'y-' ) {
                        _self.direction = 'y+';
                    }
                    break;
                case 40:
                    if ( _self.direction != 'x-' ) {
                        _self.direction = 'x+';
                    }
                    break;
            }
        } );

        buildGameField();
    }

    return {
        init: init
    }
};

game = new SnakeGame();

window.onload = game.init;
