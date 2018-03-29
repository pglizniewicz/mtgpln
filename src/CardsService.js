// @flow

function prepareQuery(query: string): string {
    const _query = query.trim();
    if (_query.indexOf(' ') === -1)
        return _query;

    return `"${_query}"`;
}

export default {
    fetchCards(query: string): Promise<any> {
        const _query = prepareQuery(query);
        return fetch(`https://api.scryfall.com/cards/search?q=!${encodeURI(_query)}&unique=prints&order=set&dir=desc`)
            .then(response => response.json());
    }
}