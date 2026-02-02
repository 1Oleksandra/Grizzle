async function loadComponent(id, file) {
  let response = await fetch(file);
  let text = await response.text();
  document.getElementById(id).innerHTML = text;

  if (id === "header") {
    initBurgerMenu(); 
    initSubmenu()
    //  initBurgerSubmenu();
     setupSubmenuAccordion()
  }
}
// додавання Footer Header на сторінки---------------


loadComponent("header", "header.html");
loadComponent("footer", "footer.html");

// BLOG ===================================================

// Функція для створення картки з повними текстом post.html
function createBlogPost(post) {
  const card = document.getElementById('post-container');
  if (!card) return;

  card.innerHTML = `
    <h2 class="post-title title">
           ${post.title}
        </h2>
        <p class="post-data">${post.data}</p>
        <div class="post-img">
            <img src="${post.image}" alt="images">
        </div>
        <p class="post-text">
            ${post.text}
        </p>
  `;
}

// Функція для створення картки (маленька) для home.html, about.html
function createBlogCardSlider(post) {
  const card = document.createElement('div');
  card.classList.add('blog-item');

  card.innerHTML = `
    <div class="blog-item__img">
      <img src="${post.image}" alt="blog img" class="blog-img">
    </div>
    <div class="blog-item__content">
      <h5 class="blog-item__title title">${post.title}</h5>
      <p class="blog-item__text">${post.text}</p>
      <a href="post.html?id=${post.id}" class="blog-item__link">${post.button}</a>
    </div>
  `;
  return card;
}

// Функція для створення картки (маленька grid) для blog.html
function createBlogCard(post) {
  const card = document.createElement('div');
  card.classList.add('blog-item__grid');

  card.innerHTML = `
    <div class="blog-img__grid">
      <img src="${post.image}" alt="blog img" class="blog-img">
    </div>
    <div class="blog-item__content">
      <h5 class="blog-item__title title">${post.title}</h5>
      <p class="blog-item__text">${post.text}</p>
      <a href="post.html?id=${post.id}" class="blog-item__link">${post.button}</a>
    </div>
  `;
  return card;
}

// Функція для створення великої картки (BIG) для blog.html
function createBlogCardBig(post) {
  const card = document.querySelector('.blog-contant__block');
  if (!card) return; // перевірка, щоб не було помилки

  card.innerHTML = `
    <div class="blog-img__big">
      <img src="${post.image}" alt="images">
    </div>
    <div class="blog-contant">
      <h5 class="blog-item__title title">${post.title}</h5>
      <p class="blog-contant__data">${post.data}</p>
      <p class="blog-item__text blog-item__text-big">${post.text}</p>
      <a href="post.html?id=${post.id}" class="blog-item__link">${post.button}</a>
    </div>
  `;
}

// Функція для рендеру всіх постів
function renderBlogPosts(posts) {
  const blogGrid = document.querySelector('.blog-items__grid');
  const blogItemSlider = document.querySelector('.blog-items');

  posts.forEach(post => {
    // для blog.html
    if (blogGrid) {
      const cardGrid = createBlogCard(post);
      blogGrid.appendChild(cardGrid);
    }
    // для home.html / about.html
    if (blogItemSlider) {
      const cardSlider = createBlogCardSlider(post);
      blogItemSlider.appendChild(cardSlider);
    }
  });
}

async function loadBlogData(file) {
  let response = await fetch(file);
  let posts = await response.json();

  renderBlogPosts(posts);       // малi картки
  if (document.querySelector('.blog-contant__block')) {
    createBlogCardBig(posts[posts.length - 1]);  // велика картка тільки якщо є блок
  }
}

// Для однієї статті (post.html)
async function loadSinglePost(file) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // беремо id з URL

  let response = await fetch(file);
  let posts = await response.json();

  const post = posts.find(p => p.id == id);

  if (post) {
    createBlogPost(post);
  } else {
    document.getElementById("post-container").innerHTML = "<p>Статтю не знайдено.</p>";
  }
}


// Виклик прикладу:
loadBlogData("/data/blog.json");

// На post.html
loadSinglePost("/data/blog.json");

// =================================================================================

// Для docs.json =======================================================

async function loadDocsMenu(file) {
  const response = await fetch(file);
  const docs = await response.json();

  const menu = document.getElementById("docs-menu");
  const content = document.getElementById("docs-content");

  docs.forEach(main => {
    const li = createMainItem(main, content);
    menu.appendChild(li);
  });
}

async function loadContent(file, content) {
  const res = await fetch(file);
  content.innerHTML = await res.text();
}

// Створює головний пункт меню
function createMainItem(main, content) {
  const li = document.createElement("li");
  li.classList.add("docs-menu__item");

  const link = createMainLink(main, content);
  li.appendChild(link);

  if (main.sections && main.sections.length > 0) {
    const arrow = createArrow(li);
    li.insertBefore(arrow, link);

    const submenu = createSubmenu(main.sections, content, li, link);
    li.appendChild(submenu);
  }

  return li;
}

// Створює головне посилання
function createMainLink(main, content) {
  const link = document.createElement("a");
  link.textContent = main.title;
  link.href = "#";
  link.classList.add("docs-menu__link");
  link.dataset.file = main.file;
  link.dataset.id = main.id;

  link.addEventListener("click", async (e) => {
    e.preventDefault();
    await loadContent(main.file, content);
    setActiveLink(link);
  });

  return link;
}

// Створює стрілочку для розгортання
function createArrow(li) {
  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>
  `;
 li.addEventListener("click", (e) => {
    e.stopPropagation(); 
    li.classList.toggle("open");
  });

  return arrow;
}

// Створює підменю
function createSubmenu(sections, content, parentLi, mainLink) {
  const ul = document.createElement("ul");
  ul.classList.add("docs-submenu");

  sections.forEach(sec => {
    const subLi = document.createElement("li");
    subLi.classList.add("docs-submenu__item");

    const subLink = createSubLink(sec, content, parentLi, mainLink);
    subLi.appendChild(subLink);

    ul.appendChild(subLi);
  });

  return ul;
}

// Створює посилання в підменю
function createSubLink(sec, content, parentLi, mainLink) {
  const subLink = document.createElement("a");
  subLink.textContent = sec.title;
  subLink.href = "#";
  subLink.classList.add("docs-submenu__link");
  subLink.dataset.file = sec.file;
  subLink.dataset.id = sec.id;

 
subLink.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation(); 

  parentLi.classList.add("open");
  await loadContent(sec.file, content);
  setActiveLink(mainLink, subLink);
});

  return subLink;
}

// Допоміжна функція для активного стану
function setActiveLink(mainLink, subLink = null) {
  document.querySelectorAll(".docs-menu__link").forEach(l => l.classList.remove("active"));
  document.querySelectorAll(".docs-submenu__link").forEach(l => l.classList.remove("active"));

  mainLink.classList.add("active");
  if (subLink) subLink.classList.add("active");
}

// Завантаження статті за параметром id
async function loadArticle(type) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let jsonFile = "";
  if (type === "solutions") {
    jsonFile = "/data/docs-solutions.json";
  } else if (type === "products") {
    jsonFile = "/data/docs-products.json";
  }

  const res = await fetch(jsonFile);
  const docs = await res.json();

  let article = docs.find(doc => doc.id === id);
  let parent = null;

  if (!article) {
    docs.forEach(doc => {
      if (doc.sections) {
        const sec = doc.sections.find(s => s.id === id);
        if (sec) {
          article = sec;
          parent = doc;
        }
      }
    });
  }

  if (article) {
    const content = document.getElementById("docs-content");
    await loadContent(article.file, content);

    // Відкрити меню і підсвітити
    const menuItems = document.querySelectorAll(".docs-menu__item");
    menuItems.forEach(item => {
      const mainLink = item.querySelector(".docs-menu__link");
      const subLinks = item.querySelectorAll(".docs-submenu__link");

      if (mainLink && mainLink.dataset.id === article.id) {
        item.classList.add("open");
        setActiveLink(mainLink);
      }

      subLinks.forEach(sub => {
        if (sub.dataset.id === article.id) {
          item.classList.add("open");
          setActiveLink(mainLink, sub);
        }
      });
    });
  } else {
    console.error("Стаття не знайдена:", id);
  }
}

// Виклик залежно від сторінки
const currentPage = window.location.pathname;
if (currentPage.includes("article-products.html")) {
  loadDocsMenu("/data/docs-products.json");
  loadArticle("products");
} else if (currentPage.includes("article-solutions.html")) {
  loadDocsMenu("/data/docs-solutions.json");
  loadArticle("solutions");
}

// Рандомний колір
const colors = ['#2E2A47', '#5F4B8B', '#B30000', '#3C4A57', '#2E2A47', '#5F4B8B', '#B30000']

function getRandomColor(arr){
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

const randomColor = getRandomColor(colors)

// слова на сторінці main

const mainSpan = document.getElementById('main-span')
const mainSpanArr = ['Password', 'Access', 'Cyber']

let wordIndex = 0
let letterIndex = 0

function typeText() {
  if (wordIndex >= mainSpanArr.length) {
    wordIndex = 0;
  }

  const currentWord = mainSpanArr[wordIndex]
  mainSpan.textContent = currentWord.slice(0, letterIndex)
   mainSpan.style.color = getRandomColor(colors)

  letterIndex++

  if (letterIndex > currentWord.length) {
    wordIndex++
    letterIndex = 0;
    setTimeout(typeText, 1500)
  } else {
    setTimeout(typeText, 150)
  }
}
typeText();


// текст по колу winner
const winnerCircle = document.querySelector('.winner-circle')

setInterval(()=> {
winnerCircle.style.backgroundColor = randomColor
}, 1000)


const text =document.querySelector('.circle-text p')
text.innerHTML = text.innerText.split('').map(
    (char, i) => `<span style='transform:rotate(${i * 10}deg)'>${char}</span>`
).join('')

// анімація при скролі organizations 

const cards = document.querySelectorAll('.organizations-item');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },
  {
    threshold: 0.3, // коли 30% елемента видно
  }
);

cards.forEach((card) => observer.observe(card));

// анімація для blog

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.blog-items');
  const visibleCount = 3;
  let currentIndex = 0;

  // після того як додала картки через createBlogCardSlider()
  function initSlider() {
    const items = slider.querySelectorAll('.blog-item');

    function slideNext() {
      currentIndex++;
      if (currentIndex > items.length - visibleCount) {
        currentIndex = 0;
      }

      const itemWidth = items[0].getBoundingClientRect().width;
      const offset = currentIndex * itemWidth;
      slider.style.transform = `translateX(-${offset}px)`;
    }

    setInterval(slideNext, 3000);
  }

  // викликати після рендера карток
  fetch('/data/blog.json')
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post => {
        const card = createBlogCardSlider(post);
        slider.appendChild(card);
      });
      initSlider(); 
    });
});


// Бургер =======================================================================

function initBurgerMenu() {
  const burgerBtn = document.querySelector('.burger');
  const mainNav = document.querySelector('.main-nuv');
  const header = document.querySelector('.header');

  if (!burgerBtn || !mainNav || !header) return;

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.classList.toggle('lock');
    // header.classList.toggle('fixed');
  });
}
// video block ===============================================================
document.addEventListener('DOMContentLoaded', () => {
  const videoBlock = document.querySelector('.video-blok');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoBlock.classList.add('visible');
        observer.unobserve(videoBlock); // одноразова активація
      }
    });
  }, {
    threshold: 0.3, 
  });

  if (videoBlock) {
    observer.observe(videoBlock);
  }
});

// випадаючий список======================


function initSubmenu() {
  const submenuLinks = document.querySelectorAll('.has-submenu > .main-link');

  submenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const parent = link.parentElement;
      const isActive = parent.classList.contains('active');

      submenuLinks.forEach(l => l.parentElement.classList.remove('active'));

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}


// відкривання аккордеону в бургер =========================================================================
function setupSubmenuAccordion() {
  const submenuTitles = document.querySelectorAll('.submenu-title');
  console.log("Знайдено submenu-title:", submenuTitles.length);

  submenuTitles.forEach(title => {
    title.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Клік по:", this.textContent);

      const parentItem = this.closest('.submenu-item');
      parentItem.classList.toggle('open');
    });
  });
}
document.addEventListener('DOMContentLoaded', setupSubmenuAccordion);

