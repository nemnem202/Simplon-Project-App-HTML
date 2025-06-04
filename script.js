window.addEventListener("DOMContentLoaded", renderPage);

async function renderPage() {
  const articles = await getArticles();

  const startupPage = "Mickey Mouse";

  const bodyContainer = document.getElementById("body");
  const mainContainer = document.createElement("main");
  bodyContainer.appendChild(mainContainer);

  loadPage(mainContainer, articles, startupPage);

  const searchButton = document.getElementById("searchButton");
  const navBar = document.getElementById("searchBar");

  searchButton.addEventListener("click", () => {
    loadPage(mainContainer, articles, navBar.value);
  });

  window.addEventListener("keydown", (e) => {
    console.log(e.code);
    if (e.code === "Enter") {
      loadPage(mainContainer, articles, navBar.value);
    }
  });

  const links = document.querySelectorAll(".link");
  links.forEach((l) => {
    l.addEventListener("click", () => {
      linkPage = l.innerText;
      loadPage(mainContainer, articles, linkPage, startupPage);
    });
  });
}

const loadPage = (mainContainer, articles, page, backpage) => {
  mainContainer.childNodes.forEach((c) => {
    c.removeEventListener("click", () => {
      loadPage(mainContainer, articles, page, backpage);
    });
  });
  const currentArticle =
    articles.find(
      (art) => art.article.title.toUpperCase() === page.toUpperCase()
    ) || "not-found";

  if (currentArticle === "not-found") {
    mainContainer.innerHTML = "<h1>Page not-found !</h1>";
    const link = window.document.createElement("span");
    link.classList.add("link");
    link.classList.add("linkDisplay");
    link.textContent = "back to previous page";
    link.addEventListener("click", () => {
      loadPage(mainContainer, articles, backpage);
    });
    mainContainer.appendChild(link);
  } else {
    mainContainer.innerHTML = mainContainerContent(currentArticle);
    const links = document.querySelectorAll(".link");
    links.forEach((l) => {
      l.addEventListener("click", () => {
        currentPage = l.innerText;
        loadPage(mainContainer, articles, currentPage, page);
      });
    });
  }
};

const getArticles = () => {
  return fetch("../articles.json").then((res) => res.json());
};

const mainContainerContent = (article) => `
  <article>
    <section class="side-menu">
      <h3>Navigation</h3>
      <ol>
        ${article.article.paragraphs
          .map(
            (item) =>
              `<li><a class="linkDisplay" href="#${item.title.replace(
                /\s+/g,
                ""
              )}">${item.title}</a></li>`
          )
          .join("")}
      </ol>
    </section>
    <section class="article-content">
      <h2 class="article-title">${article.article.title}</h2>
      <ul>
        ${article.article.paragraphs
          .map(
            (p) => `
          <li id="${p.title.replace(/\s+/g, "")}">
            <h3>${p.title}</h3>
            <p>${p.text}</p>
          </li>
        `
          )
          .join("")}
      </ul>
    </section>
    <section class="resumee">
      <h3>Résumé</h3>
      <img
        class="resumee-img"
        src="${article.resumee.image.src}"
        alt="${article.resumee.image.alt}"
        width="${article.resumee.image.width}"
        height="${article.resumee.image.height}"
      />
      ${article.resumee.dates
        .map(
          (d) => `
        <div class="resumee-info"><span>${d.label} :</span><span>${d.value}</span></div>
      `
        )
        .join("")}
    </section>
    
  </article>
      <footer>
      <p>&copy; 2024 Wikipédio. All rights reserved.</p>
    </footer>
`;
