print("Current db: " + db.databaseName);

db.users.drop();
db.createCollection("users");
db.users.insert([
    {
        username: 'user1',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user2',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user3',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user4',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user5',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user6',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user7',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user8',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
    },
    {
        username: 'user9',
        pwd: '6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c',
        role: 'admin,guide'
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

]);
db.routen.drop();
db.createCollection("routen");