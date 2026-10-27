const postList = document.getElementById('post-list');
const message = document.querySelector('.message');

async function fetchPosts(){
  message.textContent = 'Loading posts...';
  try{
    const response = await fetch("https://dummyjson.com/posts?limit=10");
    if(!response.ok){
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    postList.innerHTML = '';

    data.posts.forEach(function(post){
      const article = document.createElement('article');

      article.classList.add('post-card');

      const title = document.createElement('h3');
      title.textContent = post.title;

      const body = document.createElement('p');
      body.textContent = post.body;

      const details = document.createElement('p');
      details.textContent = "Views: " + post.views;

      const tags = document.createElement('p');
      tags.textContent = "Tags: " + post.tags.join(', ');
      const link = document.createElement('a');
      link.href = `post.html?id=${post.id}`;
      link.textContent = "Read more";
      article.append(title, body, details, tags, link);
      postList.appendChild(article);
    });
    message.textContent = ""
  }
  catch(error){
    message.textContent = error.message;
  }
}
fetchPosts();
