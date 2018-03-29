// @flow
import React, { Component } from 'react'
import AutocompletableInput from './AutocompletableInput';

interface CardName {
    name: string
}

interface CardHints {
    data: Array<CardName>,
    total_cards: number
}

type State = {
    cardName: string,
    euro: any,
    foundCardNames: CardHints,
    foundCards: any
}

interface Cards {
    data: Array<Card>
}

interface Card {
    mid: number,
    eur: string
}

export default class LoginPage extends Component<void, State> {

    state = {
        euro: [],
        foundCards: {
            data: [],
        },
        foundCardNames: {
            data: [],
            total_cards: 0
        },
        chosen: [],
        cardName: ""
    }

    render() {
        const euroRate = this.findEuro();
        const { foundCardNames } = this.state;
        return (
            <div className="container-fluid" style={{ padding: 10 }}>
                {/* Kurs EUR/PLN */
                    euroRate &&
                    <div>
                        <p>
                            Średni kurs EUR/PLN NBP {euroRate.mid}
                        </p>
                    </div>
                }
                <div className="row">
                    <div className="col-sm">
                        <div class="input-group mb-3">
                            <AutocompletableInput
                                onDataRequest={this.fetchHints}
                                value={this.state.cardName}
                                onInput={value => this.setState({ cardName: value })} />
                            <div class="input-group-append">
                                <button onClick={this.findCards} class="btn" type="button">Szukaj</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        foundCardNames.data.length > 0 &&
                        <div>
                            <h4>Znalezionych kart: {foundCardNames.total_cards}</h4>
                            <ul className="list-group">
                                {
                                    this.state.foundCardNames.data.map((card, i) => {
                                        return <li onClick={() => this.searchCards(card.name)} className="list-group-item" key={i}>{card.name || ''}</li>// onClick ustaw this.state.cardName i odpal szukajkę
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>

                <div>

                    {/* Wyniki wyszukiwania */
                        this.state.foundCards.data &&
                        <ul>
                            {
                                this.state.foundCards.data.map((print, i) => {
                                    return <li key={i}>{print.set} {(print.eur * euroRate.mid).toFixed(2)} PLN</li>
                                })
                            }
                        </ul>
                    }
                </div>

                <div>
                    {/* Wybrane karty */
                        this.state.chosen &&
                        <ul>
                            {
                                this.state.chosen.map(print => {
                                    return <li>{print.set} {(print.eur * euroRate.mid).toFixed(2)} PLN</li>
                                })
                            }
                        </ul>
                    }


                </div>

            </div>
        )
    }

    searchCards = (cardName: string) => {
        this.setState({
            foundCardNames: {
                data: [],
                total_cards: 0
            },
            cardName
        });
        this.findCards();
    }

    findCards = async () => {
        const json = await fetch('https://api.scryfall.com/cards/search?&q=!' + this.state.cardName + '&unique=prints&order=set&dir=desc')
            .then(response => response.json());

        this.setState({
            foundCards: json
        })
    };

    findEuro = () => {
        const { euro } = this.state;
        if (euro.length === 0)
            return undefined;

        return euro[0].rates.find(rate => rate.code === 'EUR');

    };

    fetchHints = async () => {
        const { cardName } = this.state;
        try {
            const json = await fetch(`https://api.scryfall.com/cards/search?q=${cardName}`)
                .then(response => response.json());
            this.setState({
                foundCardNames: json
            });
        }
        catch (err) {
            console.log('no cards found')
        }
    }

    async componentDidMount() {
        const json = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=JSON')
            .then(response => response.json());
        this.setState({
            euro: json
        })
    }
}
