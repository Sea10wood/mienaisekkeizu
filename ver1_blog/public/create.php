<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];

    $conn = new mysqli('localhost', 'blog_user', 'your_password', 'blog_database');

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO posts (title, content) VALUES ('$title', '$content')";
    if ($conn->query($sql) === TRUE) {
        echo "New post created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
<form method="POST" action="create.php">
    <input type="text" name="title" placeholder="Post Title" required><br>
    <textarea name="content" placeholder="Post Content" required></textarea><br>
    <input type="submit" value="Create Post">
</form>
