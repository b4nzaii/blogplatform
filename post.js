const postDetail = document.getElementById("post-detail");
const message = document.querySelector(".message");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
const editForm = document.getElementById("edit-form");
const editTitle = document.getElementById("edit-title");
const editBody = document.getElementById("edit-body");
const editStatus = document.getElementById("edit-status");

async function fetchPost() {
  message.textContent = "Loading...";

  try {
    if (!postId) {
      throw new Error("No post selected.");
    }

    const response = await fetch(`https://dummyjson.com/posts/${postId}`);

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const post = await response.json();
    editTitle.value = post.title;
    editBody.value = post.body;
    const title = document.createElement("h2");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    const details = document.createElement("p");
    details.textContent = "Views: " + post.views;

    const tags = document.createElement("p");
    tags.textContent = "Tags: " + post.tags.join(", ");

    postDetail.append(title, body, details, tags);

    message.textContent = "";
  } catch (error) {
    message.textContent = error.message;
  }
}

const commentsList = document.getElementById("comments-list");
const commentsMessage = document.getElementById("comments-message");

async function fetchComments() {
  commentsMessage.textContent = "Loading comments...";

  try {
    if (!postId) {
      throw new Error("No post selected.");
    }

    const response = await fetch(
      `https://dummyjson.com/posts/${postId}/comments`,
    );

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    commentsList.innerHTML = "";

    data.comments.forEach(function (comment) {
      const article = document.createElement("article");

      const user = document.createElement("h3");
      user.textContent = comment.user.fullName;

      const body = document.createElement("p");
      body.textContent = comment.body;

      article.append(user, body);
      commentsList.appendChild(article);
    });

    if (data.comments.length === 0) {
      commentsMessage.textContent = "No comments yet.";
    } else {
      commentsMessage.textContent = "";
    }
  } catch (error) {
    commentsMessage.textContent = error.message;
  }
}

const commentForm = document.getElementById("comment-form");
const commentBody = document.getElementById("comment-body");
const commentStatus = document.getElementById("comment-status");

commentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const text = commentBody.value.trim();

  if (!text) {
    commentStatus.textContent = "Please write a comment.";
    return;
  }
  commentStatus.textContent = "Sending comment...";
  try {
    if (!postId) {
      throw new Error("No post selected.");
    }
    const response = await fetch("https://dummyjson.com/comments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: text,
        postId: Number(postId),
        userId: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const newComment = await response.json();
    const article = document.createElement("article");
    const user = document.createElement("h3");
    user.textContent = newComment.user.fullName;

    const body = document.createElement("p");
    body.textContent = newComment.body;

    article.append(user, body);
    commentsList.appendChild(article);

    commentsMessage.textContent = "";
    commentForm.reset();
    commentStatus.textContent = "Comment added!";
  } catch (error) {
    commentStatus.textContent = error.message;
  }
});

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const title = editTitle.value.trim();
  const body = editBody.value.trim();

  if (!title || !body) {
    editStatus.textContent = "Please fill in all fields.";
    return;
  }

  editStatus.textContent = "Updating post...";

  try {
    if (!postId) {
      throw new Error("No post selected.");
    }

    const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const updatedPost = await response.json();

    postDetail.querySelector("h2").textContent = updatedPost.title;
    postDetail.querySelector("p").textContent = updatedPost.body;

    editStatus.textContent = "Post updated!";
  } catch (error) {
    editStatus.textContent = error.message;
  }
});

const deleteBtn = document.getElementById('delete-btn');
const deleteStatus = document.getElementById('delete-status');

deleteBtn.addEventListener('click', async function() {

    const confirmDelete = confirm('Are you sure you want to delete this post?');

    if (!confirmDelete) {
        return;
    }

    deleteStatus.textContent = 'Deleting post...';

    try {
        if (!postId) {
            throw new Error('No post selected.');
        }

        const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        deleteStatus.textContent = 'Post deleted!';

        postDetail.remove();
        editForm.remove();
        commentForm.remove();
        deleteBtn.disabled = true;

    } catch (error) {
        deleteStatus.textContent = error.message;
    }
});

fetchPost();
fetchComments();
