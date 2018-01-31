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
        "visited" : [],
        x:-1,
        y:-1
    },
    {
        "name" : "Startup",
        "desc" : "Start in die HTL und Zukunftsperspektiven bei Abschluss.<br>Starte in den ersten Jahrgang, starte ins Berufsleben. Wir zeigen wie es im ersten Jahrgang losgeht, und wir zeigen welche Berufsmöglichkeiten sich nach der HTL Informatik ergeben.",
        "visited" : [],
        x:480,
        y:250
    },{
        "name" : "Videowall",
        "desc" : "Virtuelle Hall of Fame unserer Absolventen<br>Die Videowall zeigt eine virtuelle Hall of Fame unserer AbsolventInnen. Der Aufbau und die Programmierung der Videowall wurde durch Informatik-Schüler gemacht.",
        "visited" : [],
        x:300,
        y:480
    },{
        "name" : "Projektorientierte Softwareentwicklung",
        "desc" : "Du arbeitest im Team an Projekten mit verschiedensten Systemen und Programmiersprachen.<br>Projektmanagement und Teamarbeit wird in der Informatik-Abteilung groß geschrieben. Du siehst unterschiedlichste Schülerprojekte des 4. und 5. Jahrganges.<br>Pong-Game <br>Alexa Project und smart Home<br>Stations- und Pausenmanagementsystem <br>Tutoring System<br>Peer Coaching<br>Facility Management Tool (Siegerprojekt bei Innovations-Wettbewerb)<br>und noch viele mehr …",
        "visited" : [],
        x:430,
        y:900
    },{
        "name" : "Praxisorientierter Wirtschaftsunterricht",
        "desc" : "Betriebswirtschaft und Management spielerisch erleben.<br>Die Schüler entwickelten Spiele, in denen sie sowohl ihre wirtschaftlichen Kompetenzen erweitern als auch ihre Programmierfähigkeiten anwenden konnten. Dies wurde durch einen fächerübergreifenden Wirtschafts- und Informatikunterricht ermöglicht. (jedem Besucher soll angeboten werden eines der Spiele zu testen).",
        "visited" : [],
        x:680,
        y:710
    },{
        "name" : "Übungsfirma 4.0",
        "desc" : "Eine Übungsfirma (Üfa) ist eine Einrichtung, in Schüler ein simuliertes Unternehmen bilden, um mit anderen Übungsfirmen im In- und im Ausland (weltweit gibt es über 7000 Übungsfirmen) mit virtuellen Waren und Geld zu handeln.<br>Die Übungsfirma der HTL Villach besteht aus den Abteilungen Einkauf, Verkauf, Personal, Rechnungswesen und Sekretariat.<br>Die Übungsfirma kauft und verkauft Produkte/Dienstleistungen, zahlt Steuern und Abgaben und erledigt alle notwendigen Behördenwege (Sozialversicherung, Firmenbuch, Bank, Gericht, Shopping Mall, Gewerbebehörde etc.) online. <br>Die ÜFA der HTL Villach wird zum Großteil papierlos geführt.",
        "visited" : [],
        x:827,
        y:709
    },{
        "name" : "1. Jahrgang – Wie startet man erfolgreich?",
        "desc" : "Wie schaffst du den erfolgreichen Einstieg in die Informatik?<br>Schüler des ersten Jahrgangs geben Tipps für den Einstieg: <br>Zeitmanagement<br>Arbeitseinteilung<br>Selbstorganisation  <br>Eigenverantwortung<br>Buddysystem<br>PeerCoaching<br>Schüler helfen Schülern<br>…",
        "visited" : [],
        x:1200,
        y:900
    },{
        "name" : "Apps Corner",
        "desc" : "Mobile Apps (für Android) baut bei uns jede(r) ab dem 4. JG. Das können eigene Spiele sein wie letztes Jahr, oder wir nutzen öffentliche Web-Services wie Google-Maps wie heuer, und selbstverständlich bauen wir eigene Web-Services die wir mit anderen synchronisieren und kombinieren.",
        "visited" : [],
        x:1200,
        y:700
    },{
        "name" : "Programmierwerkstatt",
        "desc" : "„hands on – start programming, schreib dein erstes Programm“<br><br>„Hier wird mit Unterstützung der Schüler der erste Source Code in C geschrieben, ausgeführt und getestet. Je nach Wissenstand des Schnupperschülers reicht das von einem ‚Hello World‘ bis hin zur Ausgabe eines dynamisch gezeichneten Dreiecks.“",
        "visited" : [],
        x:1500,
        y:900
    },{
        "name" : "Toolsmatrix, Stundenvergleich, Stundenplan",
        "desc" : "Unterschied zu anderen Schulformen und Abteilungen.<br>Vergleiche die Stundentafel der Informatik mit anderen Abteilungen, schau dir exemplarische Stundenplänen der Abteilung an.<br>Außerdem bekommst du einen Überblick über die Tools und die Programmiersprachen die du in 5 Jahren erlernst und verwendest!",
        "visited" : [],
        x:1490,
        y:700
    },{
        "name" : "Elektronik, Messtechnik & Mikrocontroller",
        "desc" : "Software steuert jede Hardware, die Zukunft liegt in der Software<br>Grundlegende Elektronik-Kenntnisse können auch für Informatiker wichtig sein. Hier zeigen wir dir die Anwendung von Messgeräten und einfache Anwendungen von Mikrocontrollern. Natürlich mit \"software inside\"!",
        "visited" : [],
        x:1600,
        y:490
    },{
        "name" : "Unternehmen und Absolventen ",
        "desc" : "Wir kooperieren mit der Wirtschaft und haben ein hervorragendes Absolventennetzwerk.<b>Mit 5 Unternehmen, unseren erfolgreichen Absolventen und einem gesponserten, international renommierten Stärken-Test bieten wir auf Firmenebene wieder Einiges.",
        "visited" : [],
        x:1430,
        y:245
    },{
        "name" : "iRoute",
        "desc" : "",
        "visited" : [],
        x:777,
        y:188
    }

]);
db.routen.drop();
db.createCollection("routen");