var timeSpan = 60;
var ankuft = 5;
var rate = timeSpan / ankuft;

onmessage = function(data) {
    console.log("Starting my generate of Routes");
    generateRoutes();
}

function generateRoutes() {
    

    var array = [];
    for(var i = 0; i < 15000; i++) {
        array.push(getNextNorm());
    }
    postMessage(array);
}

function getNextNorm() {
    var delay = (-Math.log(Math.random())/rate);
    if(Math.floor((Math.random() * 2)-1) == 0)
        delay *= -1;
    delay *= ankuft;
    
    delay += rate;
    if(delay > rate*2 || delay < 0)
        return getNextNorm();
    
    return delay;
}