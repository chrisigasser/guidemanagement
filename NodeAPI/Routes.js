var authenticate = require('./controllers/authenticate');
module.exports = function(app){
    app.post('/checkAuthentification', users.authenticate);
}