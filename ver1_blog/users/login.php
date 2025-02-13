<?php
session_start();
include 'includes/functions.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute(['username' => $_POST['username']]);
    $user = $stmt->fetch();

    if ($user && password_verify($_POST['password'], $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        header("Location: index.php");
        exit();
    } else {
        echo "ログイン失敗";
    }
}

include 'templates/login_form.php';
?>
