// @flow
import React, { Component } from 'react'
import AutocompletableInput from './AutocompletableInput';
import CardsService from '../CardsService'

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
        const { foundCards } = this.state;
        return (
            <div className="container-fluid" style={{ padding: 10 }}>
                <div className="row">
                    <div className="col-sm">
                        <div className="input-group mb-3">
                            <AutocompletableInput
                                onDataRequest={this.fetchHints}
                                value={this.state.cardName}
                                onInput={value => this.setState({ cardName: value })} />
                            <div className="input-group-append">
                                <button onClick={this.findCards} className="btn" type="button">Szukaj</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {
                        foundCardNames.data.length > 0 &&
                        <div>
                            <h4>Może szukasz: {foundCardNames.total_cards}</h4>
                            <ul className="list-group">
                                {
                                    this.state.foundCardNames.data.map((card, i) => {
                                        return <li onClick={() => this.searchCards(card.name)}
                                            className="list-group-item" key={i}>{card.name || ''}</li>
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>

                <div>

                    {/* Wyniki wyszukiwania */
                        this.state.foundCards.data &&
                        <div>
                            <h4>Znalezionych wydań: {foundCards.total_cards}</h4>
                            <ul className="list-group">
                                {
                                    this.state.foundCards.data.map((print, i) => {
                                        return <li className="list-group-item" key={i}>
                                            <span className="badge badge-primary">
                                                {print.set}
                                            </span>
                                            &nbsp;
                                            {print.eur ?
                                                <span>
                                                    {this.computePrice(print).toFixed(2)} PLN
                                                    </span> :
                                                <span className="badge badge-secondary">
                                                    Brak kursu w euro
                                                </span>}

                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>

                <div>
                    {/* Wybrane karty */
                        this.state.chosen &&
                        <ul>
                            {
                                this.state.chosen.map(offer => {
                                    return <li>{offer.set} {this.computePrice(offer.eur).toFixed(2)} PLN</li>
                                })
                            }
                        </ul>
                    }
                </div>
                <div>
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

    computePrice = (offer: any): number => {
        const euroRate = this.findEuro();
        const offerPrice = parseFloat(offer.eur);
        return offerPrice * euroRate.mid;
    }

    searchCards = (cardName: string) => {
        this.setState({
            foundCardNames: {
                data: [],
                total_cards: 0
            },
            cardName
        });
        this._findCards(cardName);
    }

    findCards = async () => {
        return this._findCards(this.state.cardName)
    };


    _findCards = async (cardName: string) => {
        const json = await CardsService.fetchCards(cardName);
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
        if (!cardName || cardName.trim() === '') {
            this.setState({
                foundCardNames: {
                    data: [],
                    total_cards: 0
                }
            });
            return
        }
        try {
            const response = await fetch(`https://api.scryfall.com/cards/search?q=name:/^${encodeURI(cardName)}/`);
            if (response.ok) {
                const json = await response.json();
                this.setState({
                    foundCardNames: json
                });
            }
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
