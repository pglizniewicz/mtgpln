// @flow
import React, {Component} from 'react'
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
        const {foundCardNames} = this.state;
        const {foundCards} = this.state;
        return (
            <div className="container-fluid" style={{padding: 10}}>
                <div className="row">
                    <div className="col-sm">
                        <div className="input-group mb-3">
                            <AutocompletableInput
                                onDataRequest={this.fetchHints}
                                value={this.state.cardName}
                                onInput={value => this.setState({cardName: value})}/>
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

                    {/* Wyniki wyszukiwania. TODO: dodać jakąś metodę czyszczenia wyników.*/
                        this.state.foundCards.data &&
                        <div>
                            <h4>Znalezionych wydań: {foundCards.total_cards}</h4>
                            <ul className="list-group">
                                {
                                    this.state.foundCards.data.map((print, i) => {
                                        return <li className="list-group-item" key={i}>{print.set} {(print.eur * euroRate.mid).toFixed(2)} PLN</li>
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
                                this.state.chosen.map(print => {
                                    return <li>{print.set} {(print.eur * euroRate.mid).toFixed(2)} PLN</li>
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
        function today() {
            return new Date().toISOString().split('T')[0];
        }

        const json = await fetch('https://api.scryfall.com/cards/search?&q=!"' + this.state.cardName +'" st=booster game:paper date<=' + today() +
            '&unique=prints' +
            '&order=set' +
            '&dir=desc')
            .then(response => response.json());

        this.setState({
            foundCards: json
        })
    };

    findEuro = () => {
        const {euro} = this.state;
        if (euro.length === 0)
            return undefined;

        return euro[0].rates.find(rate => rate.code === 'EUR');

    };

    fetchHints = async () => {
        const {cardName} = this.state;
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
            const json = await fetch(`https://api.scryfall.com/cards/search?q=name:/^${cardName}/`)
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
