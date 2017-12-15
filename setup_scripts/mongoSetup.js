print("Current db: " + db.databaseName);

db.users.drop();
db.createCollection("users");
db.users.insert([
    {
        username: 'admin',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'guide',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'guide'
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