<?php
include 'includes/header.php';
include 'includes/functions.php';

$post = getDB()->prepare("SELECT * FROM posts WHERE id = :id");
$post->execute(['id' => $_GET['id']]);
$post = $post->fetch();

$comments = getDB()->prepare("SELECT comments.content, users.username FROM comments 
    JOIN users ON comments.user_id = users.id WHERE post_id = :post_id ORDER BY comments.created_at DESC");
$comments->execute(['post_id' => $_GET['id']]);
$comments = $comments->fetchAll();
?>

<h2><?= htmlspecialchars($post['title']) ?></h2>
<p><?= nl2br(htmlspecialchars($post['content'])) ?></p>

<h3>コメント</h3>
<ul>
    <?php foreach ($comments as $comment): ?>
        <li><strong><?= htmlspecialchars($comment['username']) ?>:</strong> <?= htmlspecialchars($comment['content']) ?></li>
    <?php endforeach; ?>
</ul>

<?php include 'templates/comment_form.php'; ?>
<?php include 'includes/footer.php'; ?>
