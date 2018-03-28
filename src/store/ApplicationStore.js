import { createStore, applyMiddleware } from "redux";
import logger from 'redux-logger';

const initialState = {
    todos: [
        {
            name: 'do sth'
        }
    ]
    
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add-todo': {
            return Object.assign({}, state, {
                todos: [].concat(state.todos).concat([action.payload])
            });

        }
    }
    return state;
}

const store = createStore(reducer, applyMiddleware(logger));

export default store;
