document.addEventListener("DOMContentLoaded", function() {
    console.log("ブログのJavaScriptが読み込まれました！");

    // フラッシュメッセージを自動で消す
    let flashMessage = document.getElementById("flash-message");
    if (flashMessage) {
        setTimeout(() => {
            flashMessage.style.display = "none";
        }, 3000);
    }

    // コメントの非同期送信
    let commentForm = document.getElementById("comment-form");
    if (commentForm) {
        commentForm.addEventListener("submit", function(event) {
            event.preventDefault();
            let formData = new FormData(commentForm);

            fetch("comment.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let commentList = document.getElementById("comment-list");
                    let newComment = document.createElement("li");
                    newComment.textContent = data.username + ": " + data.content;
                    commentList.appendChild(newComment);
                    commentForm.reset();
                } else {
                    alert("コメント投稿に失敗しました");
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }
});
