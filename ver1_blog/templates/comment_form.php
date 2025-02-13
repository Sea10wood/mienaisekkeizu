<?php if (isset($_SESSION['user_id'])): ?>
    <form action="comment.php" method="post">
        <input type="hidden" name="post_id" value="<?= $_GET['id'] ?>">
        <textarea name="content" required></textarea>
        <button type="submit">コメントを投稿</button>
    </form>
<?php else: ?>
    <p><a href="login.php">ログイン</a>するとコメントできます。</p>
<?php endif; ?>
