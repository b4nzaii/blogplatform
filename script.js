const postList = document.getElementById("post-list");
const message = document.querySelector(".message");
const searchInput = document.getElementById("search-input");
const tagFilter = document.getElementById("tag-filter");
const sortPosts = document.getElementById("sort-posts");
let allPosts = [];

async function fetchPosts() {
  message.textContent = "Loading posts...";
  try {
    const response = await fetch("https://dummyjson.com/posts?limit=0");

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    allPosts = data.posts;
    const tags = [];
    allPosts.forEach(function (post) {
      post.tags.forEach(function (tag) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    tags.sort();
    tags.forEach(function (tag) {
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = tag;

      tagFilter.appendChild(option);
    });
    filterPosts();
  } catch (error) {
    message.textContent = error.message;
  }
}
function displayPosts(posts) {
  postList.innerHTML = "";

  posts.forEach(function (post) {
    const article = document.createElement("article");
    article.classList.add("post-card");

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    const details = document.createElement("p");
    details.textContent =
      "Views: " + post.views + " | Likes: " + post.reactions.likes;
    const tags = document.createElement("p");
    tags.textContent = "Tags: " + post.tags.join(", ");

    const link = document.createElement("a");
    link.href = `post.html?id=${post.id}`;
    link.textContent = "Read more";

    article.append(title, body, details, tags, link);
    postList.appendChild(article);
  });
}

function filterPosts() {
  const searchText = searchInput.value.toLowerCase();
  const selectedTag = tagFilter.value;

  const filteredPosts = allPosts.filter(function (post) {
    const matchesSearch =
      post.title.toLowerCase().includes(searchText) ||
      post.body.toLowerCase().includes(searchText);

    const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  if (sortPosts.value === "most-views") {
    filteredPosts.sort(function (a, b) {
      return b.views - a.views;
    });
  } else if (sortPosts.value === "least-views") {
    filteredPosts.sort(function (a, b) {
      return a.views - b.views;
    });
  } else if (sortPosts.value === "most-likes") {
    filteredPosts.sort(function (a, b) {
      return b.reactions.likes - a.reactions.likes;
    });
  }

  displayPosts(filteredPosts);

  if (filteredPosts.length === 0) {
    message.textContent = "No posts found.";
  } else {
    message.textContent = "";
  }
}
searchInput.addEventListener("input", filterPosts);
tagFilter.addEventListener("change", filterPosts);
sortPosts.addEventListener("change", filterPosts);
fetchPosts();
