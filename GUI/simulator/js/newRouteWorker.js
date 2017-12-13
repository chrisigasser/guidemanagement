var timeSpan = 60;
var ankuft = 5;
var rate = timeSpan / ankuft;

onmessage = function(data) {
    console.log("Starting my generate of Routes");
    generateRoutes();
}

function generateRoutes() {
    

    var array = [];
    for(var i = 0; i < 10000; i++) {
        array.push(getNextExpo());
    }
    postMessage(array);
}

function getNextExpo() {
    var delay = (-Math.log(Math.random())/rate)*ankuft;
    if(Math.floor((Math.random() * 1)) == 0)
        delay *= -1;
    
    delay += 12;
    if(delay > 24 || delay < 0)
        return getNextExpo();
    
    return delay;
}