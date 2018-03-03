print("Current db: " + db.databaseName);

db.users.drop();
db.createCollection("users");
db.users.insert([
    {
    "username" : "admin",
    "pwd" : "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270",
    "role" : "admin",
    "pwdblank" : "admin1234"
}
]);
db.stationen.drop();
db.createCollection("stationen");
db.stationen.insert([
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
      {
        "name" : "Videowall",
        "desc" : "Here you can see crazy things",
        "visited" : []
    },
      {
        "name" : "App corner",
        "desc" : "not recommended!",
        "visited" : []
    }

]);
db.routen.drop();
db.createCollection("routen");