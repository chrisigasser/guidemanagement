module.exports = function(app){
    var users = require('./controllers/users');
    app.post('/checkAuthentification', users.authenticate);
}