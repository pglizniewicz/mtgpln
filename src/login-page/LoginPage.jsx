import React, {Component} from 'react'
import {connect} from 'react-redux';

export default class LoginPage extends Component {

    state = {
        euro: [],
        foundCards: {},
        foundCardNames: {},
        chosen: [],
        cardName: ""
    };

    render() {
        const euroRate = this.findEuro();
        return (
            <div>
                <input value={this.state.cardName} onChange={this.findCardNames}></input>
                {/* Podpowiedzi wyszukiwania TODO: debounce */
                    this.state.foundCardNames.data &&
                    <h1>{this.state.foundCardNames.total_cards}</h1>
                }
                {
                    this.state.foundCardNames.data &&
                    <ul>
                        {
                            this.state.foundCardNames.data.map(card => {
                                return <li>{card.name}</li>// onClick ustaw this.state.cardName i odpal szukajkę
                            })
                        }
                    </ul>
                }

                <button onClick={this.findCards}>Find cards</button>

                {/* Wyniki wyszukiwania */
                    this.state.foundCards.data &&
                    <ul>
                        {
                            this.state.foundCards.data.map(print => {
                                return <li>{print.set} {(print.eur * euroRate.mid).toFixed(2)} PLN</li>
                            })
                        }
                    </ul>
                }

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
        )
    }

    findCardNames = async (event) => {
        this.setState({
            cardName: event.target.value
        });
        const json = await fetch('https://api.scryfall.com/cards/search?&q=' + event.target.value)
            .then(response => response.json());

        this.setState({
            foundCardsNames: json
        })
    };

    setCardName = (event) => {
        this.setState({
            cardName: event.target.value
        });
    }

    findCards = async (event) => {
        const json = await fetch('https://api.scryfall.com/cards/search?&q=!' + this.state.cardName + '&unique=prints&order=set&dir=desc')
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

    async componentDidMount() {
        const json = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=JSON')
            .then(response => response.json());
        this.setState({
            euro: json
        })
    }
}
