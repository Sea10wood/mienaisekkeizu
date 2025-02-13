<?php
session_start();
include 'includes/functions.php';

if (!isset($_SESSION['user_id']) || !isset($_POST['post_id'])) {
    die("不正なリクエストです");
}

$pdo = getDB();
$stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content) VALUES (:post_id, :user_id, :content)");
$stmt->execute([
    'post_id' => $_POST['post_id'],
    'user_id' => $_SESSION['user_id'],
    'content' => $_POST['content']
]);

header("Location: post.php?id=" . $_POST['post_id']);
exit();
