class Deck() {
  constructor(cards) {
    this.cards = cards;
  }

  getCategory(category) {
    return this.cards.filter(card => card.category == category);
  }
}
