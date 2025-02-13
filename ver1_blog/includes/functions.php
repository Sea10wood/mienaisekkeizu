<?php
function getDB() {
    $host = 'localhost';
    $user = 'blog_user';
    $pass = 'b10gP@ss!';
    $dbname = 'blog_database';

    $dsn = "mysql:host=$host;dbname=$dbname";
    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}

function getAllPosts() {
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT id, title, content FROM posts ORDER BY created_at DESC");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertPost($title, $content) {
    $pdo = getDB();
    $stmt = $pdo->prepare("INSERT INTO posts (title, content) VALUES (:title, :content)");
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
  
    if ($stmt->execute()) {
        return true;
    } else {
        return false;
    }
}

function getPostById($id) {
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT id, title, content FROM posts WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

?>
