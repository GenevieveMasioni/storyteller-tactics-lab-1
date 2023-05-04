window.onload = () => {
  const PIPDECK_URL = "https://pipdecks.com/pages/";
  const CARDS_PATH = "assets/images/cards";
  const ICONS_PATH = "assets/images/icons";
  const ST_DATA_URL = "https://raw.githubusercontent.com/GenevieveMasioni/storyteller-tactics-lab/main/data/storyteller_tactics.json";
  var cardData, cardDeck, cardCategories, activeCategory;
  var cardInfoElement = document.querySelector(".card-picker-deck-item-info-wrapper");
  var introCardFront = document.querySelector("#intro-card-front");
  var introCardBack = document.querySelector("#intro-card-back");

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var copy = document.getElementById(data).cloneNode(true);
    copy.id = "clone-id";
    ev.target.appendChild(copy);
  }

  function populateStoryLabs() {
    const cards = document.querySelectorAll(".card-holder");
    cards.forEach(card => {
      card.addEventListener("drop", (e) => drop(e));
      card.addEventListener("dragover", (e) => allowDrop(e));
    });
  }

  function displayCardInfo(e, card) {
    const cardElement = e.target;
    cardInfoElement.querySelector(".card-picker-deck-info-image").src = `${CARDS_PATH}/${card.image}`;
    const articleUrl = `${PIPDECK_URL}/${card.handle}`;

    fetch(articleUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const dom = new DOMParser().parseFromString(data, "text/html");
      const article = cardInfoElement.querySelector(".card-picker-deck-item-info-article");
      article.textContent = "";
      article.appendChild(dom.querySelector(".card"));
    });

    cardInfoElement.classList.remove("hidden");
  }

  function hideCardInfo(e) {
    cardInfoElement.classList.add("hidden");
  }

  function createCardDomElement(card) {
    var cardElementWrapper = document.createElement("div");
    cardElementWrapper.classList.add("card-picker-deck-item-wrapper", "clickable");
    var cardElement = document.createElement("img");
    cardElement.classList.add("card-picker-deck-item", "card");
    cardElement.id = card.handle;
    cardElement.src = `${CARDS_PATH}/${card.image}`;
    cardElement.draggable = true;
    cardElement.addEventListener("dragstart", (e) => drag(e));

    cardElementWrapper.appendChild(cardElement);
    cardElementWrapper.addEventListener("click", (e) => displayCardInfo(e, card));
    return cardElementWrapper;
  }

  function populateCardDeck(cards) {
    const footer = document.querySelector(".site-footer");
    const cardsPickerElement = document.querySelector(".card-picker-deck");
    cardsPickerElement.textContent = "";
    cardsPickerElement.style.height = `${document.querySelector(".section-2").clientWidth - footer.clientHeight}px`;
    cards.forEach(card => {
      cardsPickerElement.appendChild(createCardDomElement(card));
    });
  }

  function filterCards(category) {
    populateCardDeck(cardDeck.getCardsByCategory(category));
  }

  function createCategoryDomElement(category) {
    var categoryElement = document.createElement("div");
    categoryElement.classList.add("card-picker-category", "clickable");
    categoryElement.dataset.category = category.name;

    var categoryIcon = document.createElement("img");
    categoryIcon.classList.add("card-picker-category-icon");
    categoryIcon.src = `${ICONS_PATH}/${category.icon}`;
    categoryElement.appendChild(categoryIcon);

    var categoryName = document.createElement("p");
    categoryName.classList.add("card-picker-category-name");
    categoryName.textContent = category.name;
    categoryElement.appendChild(categoryName);

    return categoryElement;
  }

  function populateCategories(categories, initMode = false) {
    const categoriesElement = document.querySelector(".card-picker-categories");
    var allCategory = { "name": "all", "icon": "pipdeck-icon-recipe.webp" };
    var allCategoryElement = createCategoryDomElement(allCategory);
    categoriesElement.appendChild(allCategoryElement);
    categories.forEach(category => {
      var categoryElement = createCategoryDomElement(category);
      categoryElement.addEventListener("click", (e) => {
        filterCards(categoryElement.dataset.category);
        if(activeCategory) {
          activeCategory.classList.remove("active");
        }
        categoryElement.classList.add("active");
        activeCategory = categoryElement;
      });
      categoriesElement.appendChild(categoryElement);
    });

    if(initMode) {
      // allCategoryElement.click();
      allCategoryElement.classList.add("active");
      activeCategory = allCategoryElement;
    }
  }

  function initUI() {
    const footer = document.querySelector(".site-footer");
    // document.querySelector("body").style.height = `${window.screen.height}px`;
    // document.querySelector(".main-content").style.height = `${window.screen.height - footer.clientHeight}px`;

    cardDeck = new Deck(cardData.cards);
    populateCategories(cardData.categories, true);
    populateCardDeck(cardData.cards);
    populateStoryLabs();

    cardInfoElement.querySelector(".card-picker-deck-item-info-header").addEventListener("click", (e) => hideCardInfo(e));
    introCardFront.addEventListener("click", (e) => {
      introCardFront.classList.add("invisible");
      introCardBack.classList.remove("invisible");
    });
    introCardBack.addEventListener("click", (e) => {
      introCardFront.classList.remove("invisible");
      introCardBack.classList.add("invisible");
    });
  }

  fetch(ST_DATA_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    cardData = data;
    initUI();
  });

}
