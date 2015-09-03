$(document).ready(function(){
	boardHeight = 40; // set standard board size
	walls = true; // walls are enabled by default
	renderBoard(); // create board
	newGame(); // initialize a new game

	wallsOnOff('#wallsOn', '3px dotted black', true);
	wallsOnOff('#wallsOff', '3px solid black', false); // walls on or off
	
	boardSize('#s', 300, 30);
	boardSize('#m', 400, 40);
	boardSize('#l', 500, 50); // different board sizes
	
	highScoreList(); // run through current highscore list to be able to determine if user's score is high enough to enter highscore list (get numberFive value) and get highest score to display in header (numberOne value)
	$('#highScoreList').hide(); // no need to display the actual list at this stage

	$('#highScore').on('click', function() { // display latest highscore list if clicked the highscore in header
		highScoreList();
	});

	$(this).off().on('keydown', function(e) {
		switch(e.which){
			case 13: // enter
				enterTrigger('#start');
				enterTrigger('#retry');
				enterTrigger('#highScoreList');
				enterTrigger('#submit')
				break;

			case 32: // spacebar
				if ($('#startMenu').is(':hidden')) { // disable ability to pause game if game is not started (startMenu must be hidden)
					if (ticker == null) { // if already paused, start game
						$('#pause').hide(); // hide pause message
						return startGame(); // continue game
					} else { 
						$('#pause').show('scale', 400); // show pause message
						return pauseGame(); // pause game
					}
				}
				break;
			
			case 37: // left arrow
			case 38: // up arrow
			case 39: // right arrow
			case 40: // down arrow
				getNewDirection(e.which);
				break;
		}
	});
});

// create game board. dependent on renderFruitCell-function
function renderBoard() {
	var cells = '', // start as empty
		rows = []; // define rows as an array
	
	for (i=0; i<boardHeight; i++) { // create as many table cells as the board should be high
		cells += '<td></td>';
	}

	for (i=0; i<boardHeight; i++) { // create as many table rows as the board should be high and insert the cells
		rows.push('<tr>'+cells+'</tr>');
	}
	
	if ($('table').length) { // if table already exists
		$('table').html(rows); // insert rows
	} else { // if table does not exist
		$('body').append('<table>'+rows.join('\n')+'</table>'); // create table with the rows
	}

	renderFruitCell(); // create new fruit cell
}

// generate random number with limits
function getRandomNumber(limit) {
	return parseInt(Math.random() * limit % limit);
}

// generate random place, "coordinates", for fruit and create the new fruit. dependent on getRandomNumber-function
function renderFruitCell() {
	fruitCell = [getRandomNumber($('tr').length), getRandomNumber($('tr:eq(0)>td').length)]; // get random place for new fruitcell

	$('td').removeClass('fruitCell'); // remove former fruitcell
	
	$('tr').eq(fruitCell[0]) // find place on y-axis (vertical)
		   .find('td').eq(fruitCell[1]) // find place on x-axis (horizontal)
		   .addClass('fruitCell'); // add class fruitCell to newly generated fruit
}

// start a new game. dependent on initialize- and startMenu-functions
function newGame() {
	initialize(); // reset values
	$('#scoreBoard').html('YOUR SCORE: '+score); // print out new scoreboard
	startMenu(); // show start menu
}

// define global variables and set default values
function initialize() {
	window.direction = 'right', // the start direction
		   speed = 150, // the snake's start speed in ms
		   fruitCell = [], // define the fruit cell as an empty array
		   snakeCells = [ [10,5], [10,4], [10,3] ], // snake's start position
		   snakeHead = [10,5], // snake's head's start position
		   score = 0, // set zero as start score
		   died = false, // start as alive
		   ticker = null, // define interval ticker
		   turnedThisFrame = false; // set boolean to keep track of if the snake already has moved this frame (to prevent it from dying when hitting multiple keys simultaneously)
}

// show start menu. dependent on startGame-function
function startMenu() {
	$('#startMenu').show('scale', 400, function() { // show start button
		$('#start').off().on('click', function() { // if clicked on start button. off-function to disable multiple clicks (to prevent the ticker starting multiple times)
			$('#startMenu').hide(); // hide start menu
			startGame(); // start game
		});
	});
}

// start interval
function startGame() {
	ticker = setInterval(updateSnakeCell, speed);
}

// pause game = clear interval
function pauseGame() {
	clearInterval(ticker); // stop interval
	ticker = null; //set ticker to null
}

// function which updates place and size of snake, keeps track of score and speed. 
// dependent on renderSnake-, renderFruitCell- and startGame-functions
function updateSnakeCell() {
	snakeNewHead = []; // set an array for the snake's head's new position

	switch(direction){
		case 'right':
			snakeNewHead = [snakeHead[0], snakeHead[1]+1]; // if right arrow is pressed, change snakehead to plus one on x-axis
			break;
		case 'left':
			snakeNewHead = [snakeHead[0], snakeHead[1]-1]; // if left arrow is pressed, change snakehead to minus one on x-axis
			break;
		case 'up':
			snakeNewHead = [snakeHead[0]-1, snakeHead[1]]; // if up arrow is pressed, change snakehead to minus one on y-axis
			break;
		case 'down':
			snakeNewHead = [snakeHead[0]+1, snakeHead[1]]; // if down arrow is pressed, change snakehead to plus one on y-axis
			break;
	}
	
	if(walls == true) { // if walls are enabled, game over when hitting them
		if (snakeNewHead[0] < 0 || snakeNewHead[1] < 0) { // if snake hits east or north wall
			gameOver();
			return false;
		} else if (snakeNewHead[0] >= boardHeight || snakeNewHead[1] >= boardHeight) { // if snake hits west or south wall
			gameOver();
			return false;
		}
	} else { // if walls are disabled, come out on opposite side
		if (snakeNewHead[0] < 0) { // if snake hits south wall
			snakeNewHead = [boardHeight, snakeNewHead[1]];
		} else if (snakeNewHead[1] < 0) { // if snake hits west wall
			snakeNewHead = [snakeNewHead[0], boardHeight];
		} else if (snakeNewHead[0] >= boardHeight) { // if snake hits north wall
			snakeNewHead = [0, snakeNewHead[1]];
		} else if (snakeNewHead[1] >= boardHeight) { // if snake hits east wall
			snakeNewHead = [snakeNewHead[0], 0];
		}
	}

	var newCell = $('tr').eq(snakeNewHead[0]).find('td').eq(snakeNewHead[1]); // localize snake's head's new position

	if (newCell.hasClass('snakeCell')) { // if snake hits itself
		gameOver();
		return false;
	} else if (newCell.hasClass('fruitCell')) { // if snake gets fruit
		snakeCells.push([]); // add space for new tail
		renderFruitCell(); // add new fruit
		
		score+=10; // add score points
		$('#scoreBoard').html('YOUR SCORE: '+score); // update score board
		
		if (speed-5 >= 20) { // speed up = update interval more often, if not already 20ms (that will be the fastest it will go)
			speed-=5;
		} 
		
		clearInterval(ticker); // stop current interval
		startGame(); // continue game (set new interval)
	}
	
	for (i=(snakeCells.length-1); i>0; i--) {
		snakeCells[i] = snakeCells[i-1];
	}

	turnedThisFrame = false; // this frame turning is finished, set to false again
	snakeCells[0] = snakeHead = snakeNewHead; // set place 0 in array "snakeCells" as the head
	renderSnake(); // print out new place for and length of the snake
}

// function to change the snakes direction
function getNewDirection(keyCode) {
	var codes = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	if(typeof codes[keyCode] != 'undefined') { // if not pressed any other key
		var newDirection = codes[keyCode], 
			changeDirection = true;

		// can't switch to opposite direction
		switch(direction) {
			case 'up':
				changeDirection = newDirection != 'down';
				break;
			case 'down':
				changeDirection = newDirection != 'up';
				break;
			case 'right':
				changeDirection = newDirection != 'left';
				break;
			case 'left':
				changeDirection = newDirection != 'right';
				break;
		}

		// if changeDirection is true and turnedThisFrame is false (the frame haven't already changed, to prevent the snake dying when hitting multiple keys simultaneously)
		if(changeDirection && !turnedThisFrame) {
			direction = newDirection;
			turnedThisFrame = true;
		} else { // keep same direction
			direction;
		}
	}
}

// create snake
function renderSnake() {
	$('td').removeClass('snakeCell snakeHead'); // remove classes "snakeCell" and/or "snakeHead" from all former cells that have them
	
	for (var cell in snakeCells) {
		$('tr').eq(snakeCells[cell][0]) // place on y-axis (vertical)
			   .find('td').eq(snakeCells[cell][1]) // place on x-axis (horizontal)
			   .addClass('snakeCell'); // add class snakeCell to all the snake's cells
	}
	
	$('tr').eq(snakeHead[0]) // find position on y-axis (vertical)
		   .find('td').eq(snakeHead[1]) // find position on x-axis (horizontal)
		   .addClass('snakeHead'); // add class snakeHead to the top
}

// to change walls
function wallsOnOff(id, border, bool) {
	$(id).on('click', function() { // if clicked on walls on/off in start menu
		$('#walls p').css('text-decoration', 'none'); // remove underline from other alternatives
		$(this).css('text-decoration', 'underline'); // add underline to chosen alternative
		$('table').css('border', border); // remove jagged border
		walls = bool; // set wall as true or false
	});
}

// to change the board size
function boardSize(id, width, height) {
	$(id).on('click', function() { // if clicked on a size in start menu
		$('#boardSize p').css('text-decoration', 'none'); // remove underline from other alternatives
		$(this).css('text-decoration', 'underline'); // add underline to chosen size
		$('table, #header').animate({'width': width}); // change width of table and header
		boardHeight = height; // change boardHeight to new value
		renderBoard(); // print out new board
	});
}

// function to capture enter-button on certain element which must be in view
function enterTrigger(element) {
	if ($(element).is(':visible')) {
		$(element).trigger('click');
	}
}

// stops game and gives the user a game over-message with the option to start again
// dependent on pauseGame- and newGame-functions
function gameOver() {
	pauseGame(); // stop interval
	died = true; // set died boolean to true
	$('.snakeCell').effect('pulsate', 2000); // add effect to snake, pulsate when dying

	if (score > numberFive) { // if user's score is higher than numberFive on highscore list (the last one), update highscore list
		updateHighScore();
		$('#newHighScore').show('scale', 400); // show message for new highscore that allows user to write its initials
	} else { 
		$('#retry').show('scale', 400, function() { // show game over-message
			$(this).off().on('click', function() {
				$(this).hide(); // hide retry window
				newGame(); // start a new game upon click
			});
		});
	}
}

// updates the highscore
function updateHighScore() {
	$('#submit').off().on('click', function(e) { // if clicked submit button
		$(this).attr('disabled', 'disabled'); // add attribute 'disabled' to prevent ajax call from firing twice
		user = $('#user').val(); // get user's given initials

		if (user == '') { // if input field is empty, set initials to '???'
			user = '???';
		}

		$.ajax({
			type: "POST",
			url: "index.php",
			data: {score: score, user: user}, // send user's score and name
		    success: function() {
		    	highScoreList(); // update highscore list
		    	$('#submit').removeAttr('disabled'); // remove disabled attribute upon success
		    }
		});

		e.preventDefault(); // prevent default submit action
		return false;
	});
}

function highScoreList() {
	$('#newHighScore').hide(); // hide "new highscore"-message
	$('#highScoreList ul').empty(); // empty list to insert new values

	$.ajax({
		type: 'POST',
		url: 'highscores.xml',
		dataType: 'xml',
		success: function(xml) {

			var entries = $(xml).find('entry'), // find all entries in xml-file
				arr = $.makeArray(entries), // make an array of the found entries
				count = 0; // define a counter
			
			// loop through all the entries to get all usersnames and scores and increase the counter
			entries.each(function() {
				arr[count][0] = $(this).find('user').text(); // usernames
				arr[count][1] = $(this).find('score').text(); // scores
				count++;
			});

			// sort scores in descending order, highest first
			arr.sort(function(a, b) {
				return b[1]-a[1]
			});

			window.numberOne = arr[0][1], // define highest highscore in list
				   numberFive = arr[4][1]; // lowest highscore in list

			$('#highScore').html('HIGHSCORE: '+numberOne); // update highscore "preview" in header

			count = 0; // reset counter to zero

			// loop through the entries again and append to the score board
			entries.each(function() {
				if(count<5) { // only show up to 5 results
					$('#highScoreList ul').append('<li>#'+(count+1)+' '+arr[count][0].toUpperCase()+': '+arr[count][1]+'</li>'); // reslut example: <li>#1 ABC: 100</li>
					count++; // increase counter
				} else {
					return;
				}
			})
		}
	});
	
	if (ticker == null) { // game must be paused 
		$('#highScoreList, ul').show().off().on('click', function() { // show highscore list
			$(this).hide(); // on click: hide
			if (died == true) { // if user is dead give option to start over
				newGame();
			}
		});
	}
}