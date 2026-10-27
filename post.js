
const postDetail = document.getElementById('post-detail');
const message = document.querySelector('.message');

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');


async function fetchPost() {
    message.textContent = 'Loading...';

    try {
        if (!postId) {
            throw new Error('No post selected.');
        }

        const response = await fetch(`https://dummyjson.com/posts/${postId}`);

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const post = await response.json();

        const title = document.createElement('h2');
        title.textContent = post.title;

        const body = document.createElement('p');
        body.textContent = post.body;

        const details = document.createElement('p');
        details.textContent = 'Views: ' + post.views;

        const tags = document.createElement('p');
        tags.textContent = 'Tags: ' + post.tags.join(', ');

        postDetail.append(title, body, details, tags);

        message.textContent = '';

    } catch (error) {
        message.textContent = error.message;
    }
}

const commentsList = document.getElementById('comments-list');
const commentsMessage = document.getElementById('comments-message');

async function fetchComments() {
    commentsMessage.textContent = 'Loading comments...';

    try {
        if (!postId) {
            throw new Error('No post selected.');
        }

        const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();

        commentsList.innerHTML = '';

        data.comments.forEach(function(comment) {
            const article = document.createElement('article');

            const user = document.createElement('h3');
            user.textContent = comment.user.fullName;

            const body = document.createElement('p');
            body.textContent = comment.body;

            article.append(user, body);
            commentsList.appendChild(article);
        });

        if (data.comments.length === 0) {
            commentsMessage.textContent = 'No comments yet.';
        } else {
            commentsMessage.textContent = '';
        }

    } catch (error) {
        commentsMessage.textContent = error.message;
    }
}

fetchPost();
fetchComments();
