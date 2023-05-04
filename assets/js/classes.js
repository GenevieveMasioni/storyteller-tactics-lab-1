class Deck {
  #cards;

  constructor(cards) {
    this.#cards = cards;
  }

  getCards() {
    return this.#cards;
  }

  getCardsByCategory(category) {
    if(!category || category == "all") {
      return getCards();
    }
    return this.#cards.filter(card => card.category.includes(category));
  }

  #_createCardDomElement(card) {
    var cardElement = document.createElement("div");
    return cardElement;
  }
}
