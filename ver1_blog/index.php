<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ブログ</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<?php
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/functions.php';


$pdo = getDB();
$posts = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC")->fetchAll();
?>

<h2>記事一覧</h2>
<ul>
    <?php foreach ($posts as $post): ?>
        <li><a href="post.php?id=<?= $post['id'] ?>"><?= htmlspecialchars($post['title']) ?></a></li>
    <?php endforeach; ?>
</ul>

<?php include 'includes/footer.php'; ?>

</body>
