import React, { Component } from 'react'
import { connect } from 'react-redux';

export default class LoginPage extends Component {

    state = {
        euro: []
    }

    render() {
        const { euro } = this.state;
        const euroRate = this.findEuro();
        return (
            <div>
                {
                    euroRate &&
                    <div style={{padding: 30}}>
                        <h1>Kurs euro</h1>
                        <p>
                            {euroRate.mid}
                        </p>
                    </div>
                }

            </div>
        )
    }

    findEuro = () => {
        const { euro } = this.state;
        if (euro.length === 0)
            return undefined;

        return euro[0].rates.find(rate => rate.code === 'EUR');

    }

    async componentDidMount() {
        const json = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=JSON')
            .then(response => response.json());
        this.setState({
            euro: json
        })
    }
}
