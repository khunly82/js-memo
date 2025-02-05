"use strict";

(() => {
    const BASE_IMG_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/'

    const DOM = {
        cardsContainer: document.getElementById('cards-container'),
    }

    const UTILS = {
        shuffle: array => {
            return array
                .map(item => ({ item, seed: Math.random() }))
                .sort((a,b) => a.seed - b.seed)
                .map(x => x.item)
        },
        range: (min, max) => {
            return [...Array(max - min + 1).keys()]
                .map(v => v + min)
        }
    }

    const GAME = {
        cards: null,
        selectedCard: null,
        canPlay: true,
        init: () => {
            let cards = UTILS.range(1,150);
            cards = UTILS.shuffle(cards).slice(0, 10);
            cards = UTILS.shuffle([...cards, ...cards]);
            GAME.cards = cards.map(i => ({ url: BASE_IMG_URL + i + '.svg' }))
        },
        hideCard: (element) => {
            element.classList.remove('show');
            element.querySelector('img').removeAttribute('src');
        },
        showCard: (element, card) => {
            element.classList.add('show');
            element.querySelector('img').src = card.url;
        }
    }

    const RENDER = {
        createCard: c => {
            const div = document.createElement('div');
            const divBack = document.createElement('div'); 
            const divFront = document.createElement('div');
            const image = document.createElement('img');
            div.classList.add('card');
            divFront.classList.add('front');
            divBack.classList.add('back');
            div.append(divFront, divBack);
            divFront.append(image);
            div.addEventListener('click', HANDLERS.pick(div, c));
            return div;
        }
    }

    const HANDLERS = {
        pick: (element, card) => {
            return () => {
                if(!GAME.canPlay) {
                    return;
                }
                GAME.showCard(element, card);
                if(!GAME.selectedCard) {
                    GAME.selectedCard = {element, card};
                }
                else {
                    if(GAME.selectedCard.card.url !== card.url) {
                        GAME.canPlay = false;
                        setTimeout(() => {
                            GAME.hideCard(element);
                            GAME.hideCard(GAME.selectedCard.element);
                            GAME.selectedCard = null;
                            GAME.canPlay = true;
                        }, 1000);
                    } else {
                        GAME.selectedCard = null;
                    }
                }
            }
        }
    }

    GAME.init();
    DOM.cardsContainer.append(...GAME.cards.map(RENDER.createCard))
})()

