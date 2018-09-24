const moment = require('moment');

exports.create = function(email){
    var classEntity = {
        activated: false,
        lockdown: false,
        birthDate: '',
        name: '',
        surname: '',
        dateCreation: moment().format(),
        email: email,
        profileImage : 'person-placeholder.jpg',
        notificationTokens : ''
    }
    return classEntity;
}