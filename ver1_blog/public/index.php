<?php
include 'includes/header.php';
include 'includes/functions.php';

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
