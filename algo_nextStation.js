var object1 = [
    	{
            people: 1,
            avgTime: 10
        },
        {
            people: 2,
            avgTime: 11
        },
        {
            people: 3,
            avgTime: 10
        },
        {
            people: 4,
            avgTime: 17
        },
        {
            people: 5,
            avgTime: 25
        },
        {
            people: 6,
            avgTime: 30
        }
];

var object2 = [
    {
        people: 1,
        avgTime: 19
    },
    {
        people: 2,
        avgTime: 21
    },
    {
        people: 3,
        avgTime: 30
    },
    {
        people: 4,
        avgTime: 31
    },
    {
        people: 5,
        avgTime: 59
    },
    {
        people: 6,
        avgTime: 61
    }
];

var object3 = [
    {
        people: 1,
        avgTime: 19
    },
    {
        people: 2,
        avgTime: 30
    },
    {
        people: 3,
        avgTime: 30
    },
    {
        people: 4,
        avgTime: 31
    },
    {
        people: 5,
        avgTime: 59
    },
    {
        people: 6,
        avgTime: 61
    }
];

var object4 = [
    {
        people: 1,
        avgTime: 19
    },
    {
        people: 2,
        avgTime: 19
    },
];


var objectToConsider = object4;

var maxPeople = 1;
var avgTimeSum = objectToConsider[0].avgTime;
var maxChangeTime = Math.pow(avgTimeSum / 3,2);

for(var i = 1; i < objectToConsider.length; i++) {
    if(Math.pow(objectToConsider[i].avgTime-(avgTimeSum/i),2) >= maxChangeTime) {
        maxPeople = objectToConsider[i].people;
        break;
    }
    avgTimeSum += objectToConsider[i].avgTime;
}

//if returns 0 then there is no limit with current data
console.log("Maximale Anzahl an erlaubten Personen an dieser Station: " + (maxPeople-1));
