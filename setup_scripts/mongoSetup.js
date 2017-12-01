print("Current db: " + db.databaseName);

db.users.drop();
db.createCollection("users");
db.users.insert([
    {
        username: 'admin',
        pwd: 'schueler',
        role: 'admin,guide'
    },
    {
        username: 'guide',
        pwd: 'asdf',
        role: 'guide'
    }
]);
db.stations.drop();
db.createCollection("stations");
db.stations.insert([
    {
        "name" : "next = generated",
        "desc" : "",
        "visited" : []
    },
    {
        "name" : "Arduino",
        "desc" : "Some fancy Microcontrollers",
        "visited" : []
    },
    {
        "name" : "Sharepoint",
        "desc" : "DO NOT VISIT!!",
        "visited" : []
    },
    {
        "name" : "Diplomarbeiten",
        "desc" : "Diplomarbeiten ansehen",
        "visited" : []
    },

]);
db.routen.drop();
db.createCollection("routen");