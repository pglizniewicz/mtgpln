import React, { Component } from 'react'

class AutocompletableInput extends Component {

    state = {
        sequenceNumber: 0,
        dataSource: [],
        duringInput: false,
    }

    render() {
        const { value, onInput } = this.props
        const { duringInput } = this.state;
        return (
            <div>
                <input value={value} onChange={e => this.handleInput(e.target.value)} type="text" className="form-control" placeholder="Nazwa karty" />
            </div>
        )
    }

    handleInput = (value) => {
        const sequence = this.state.sequenceNumber + 1;
        this.setState({ duringInput: true, sequenceNumber: sequence });
        this.props.onInput(value);
        setTimeout(() => {
            if (this.state.sequenceNumber === sequence) {
                this.setState({ duringInput: false });
                this.props.onDataRequest()
            }
        }, 250)
    }
}

export default AutocompletableInput