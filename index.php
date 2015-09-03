<html>
<head>
	<title>Snake</title>
	<meta charset="utf-8">
	<link href='http://fonts.googleapis.com/css?family=Press+Start+2P' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<div id="author">
    	<h1>By <a href="http://www.inaschmitz.com/" target="_blank">Ina Schmitz</a></h1>
    </div>

	<div id="header">
		<p id="scoreBoard">YOUR SCORE: 0</p>
		<p id="highScore">HIGHSCORE: 0</p>
	</div> <!-- #header -->

	<div id="startMenu">
		<h4>Options</h4>
		<div id="walls">
			<p>Walls:</p>
			<p id="wallsOn">ON</p>
			<p id="wallsOff">OFF</p>
		</div> <!-- #walls -->
		<div id="boardSize">
			<p>Board Size:</p>
			<p id="s">S</p>
			<p id="m">M</p>
			<p id="l">L</p>
		</div> <!-- #boardsize -->
		<p id="start" class="btn">START</p>
	</div> <!-- #startMenu -->

    <div id="retry">GAME OVER!<br>Try again?</div>
    
    <div id="pause">GAME PAUSED! Press space to continue</div>
    
    <div id="newHighScore">
    	<p>NEW HIGHSCORE!</p><p id="highScoreValue"></p>
    	<form method="post">
	    	<label name="user">Enter your initials:</label>
	    	<input type="text" name="user" id="user" maxlength="3" autofocus>
	    	<input type="submit" name="submit" id="submit" value=">>">
	    </form>
    </div> <!-- #newHighScore -->
	<?php  

	$xml = simplexml_load_file('highscores.xml');
	$sxe = new SimpleXMLElement($xml->asXML());

	if(isset($_POST['user']) && $_POST['user'] != '' && isset($_POST['score'])) {
		$new_item = $sxe->addChild('entry');
		$new_item->addChild('user', $_POST['user']);
		$new_item->addChild('score', $_POST['score']);
		$sxe->asXML('highscores.xml');
	}

	?>
    <div id="highScoreList">
    	<h4>HIGHSCORE</h4>
    	<ul>
    	</ul>
    	<p>Close</p>
    </div> <!-- #highScoreList -->

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
	<script src="main.js" type="text/javascript"></script>
</body>
</html>