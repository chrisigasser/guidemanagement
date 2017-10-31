module.exports = function(app){
    var users = require('./controllers/users');
    app.get('/checkAuthentification', users.authenticate);
}