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