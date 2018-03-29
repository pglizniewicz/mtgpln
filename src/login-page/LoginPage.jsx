// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux';
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
            <div>
                <div style={{ flexDirection: 'row' }}>
                    <AutocompletableInput
                        onDataRequest={this.fetchHints}
                        value={this.state.cardName}
                        onInput={value => this.setState({ cardName: value })} />
                    <button onClick={this.findCards}>Szukaj</button>
                </div>
                <div>
                    {
                        foundCardNames.data &&
                        <ul>
                            {
                                this.state.foundCardNames.data.map((card, i) => {
                                    return <li key={i}>{card.name || ''}</li>// onClick ustaw this.state.cardName i odpal szukajkę
                                })
                            }
                        </ul>
                    }
                </div>

                <div>
                    {/* Podpowiedzi wyszukiwania TODO: debounce */
                        this.state.foundCardNames.data &&
                        <h1>{foundCardNames.total_cards}</h1>
                    }

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

                    {/* Kurs EUR/PLN */
                        euroRate &&
                        <div>
                            <p>
                                Średni kurs EUR/PLN NBP {euroRate.mid}
                            </p>
                        </div>
                    }
                </div>

            </div>
        )
    }

    findCards = async (event: any) => {
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
