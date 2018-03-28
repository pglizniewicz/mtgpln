const translations = {
    fallback: {
        'validator.constraints.email.message': 'Nieprawidłowy format adresu e-mail',
    }
}


export default class I18n {

    static tr(messageKey) {
        return translations.fallback[messageKey] || `??${messageKey}??`;
    }

    static trObject(object) {
        const result = {};
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                result[key] = I18n.tr(object[key]);
            }
        }
        return result;
    }

}