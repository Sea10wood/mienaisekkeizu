<?php
include 'includes/functions.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    if (empty($username) || empty($_POST['password'])) {
        echo "ユーザー名とパスワードを入力してください。";
    } else {
        try {
            $pdo = getDB();
            $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
            $stmt->execute(['username' => $username, 'password' => $password]);

            header("Location: login.php");
            exit();
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) { // ユニーク制約違反（ユーザー名の重複）
                echo "このユーザー名は既に登録されています。";
            } else {
                echo "登録に失敗しました: " . $e->getMessage();
            }
        }
    }
}

include 'templates/register_form.php';
?>
