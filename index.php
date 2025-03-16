<?php
session_start();

// Store the current page before redirecting
if (!isset($_SESSION['user_id'])) {
    $_SESSION['redirect_to'] = $_SERVER['REQUEST_URI']; // Store the requested page
    header("Location: ../../login.php"); // Redirect to login
    exit();
}

$userId = $_SESSION['user_id'];
$username = $_SESSION['username'];
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tree of Life Game</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #E3F2FD; /* Light blue background */
        }

        #game-container {
            width: 800px;
            height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script src="game.js"></script>
    <script src="https://discord.com/assets/4d3470e0a6a13c6e8477.js"></script>
</body>
</html>
