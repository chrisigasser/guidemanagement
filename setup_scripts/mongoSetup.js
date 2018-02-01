print("Current db: " + db.databaseName);
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
        x:240,
        y:138
    },{
        "name" : "Videowall",
        "desc" : "Virtuelle Hall of Fame unserer Absolventen<br>Die Videowall zeigt eine virtuelle Hall of Fame unserer AbsolventInnen. Der Aufbau und die Programmierung der Videowall wurde durch Informatik-Schüler gemacht.",
        "visited" : [],
        x:155,
        y:265
    },{
        "name" : "Projektorientierte Softwareentwicklung",
        "desc" : "Du arbeitest im Team an Projekten mit verschiedensten Systemen und Programmiersprachen.<br>Projektmanagement und Teamarbeit wird in der Informatik-Abteilung groß geschrieben. Du siehst unterschiedlichste Schülerprojekte des 4. und 5. Jahrganges.<br>Pong-Game <br>Alexa Project und smart Home<br>Stations- und Pausenmanagementsystem <br>Tutoring System<br>Peer Coaching<br>Facility Management Tool (Siegerprojekt bei Innovations-Wettbewerb)<br>und noch viele mehr …",
        "visited" : [],
        x:204,
        y:384
    },{
        "name" : "Praxisorientierter Wirtschaftsunterricht",
        "desc" : "Betriebswirtschaft und Management spielerisch erleben.<br>Die Schüler entwickelten Spiele, in denen sie sowohl ihre wirtschaftlichen Kompetenzen erweitern als auch ihre Programmierfähigkeiten anwenden konnten. Dies wurde durch einen fächerübergreifenden Wirtschafts- und Informatikunterricht ermöglicht. (jedem Besucher soll angeboten werden eines der Spiele zu testen).",
        "visited" : [],
        x:324,
        y:381
    },{
        "name" : "Übungsfirma 4.0",
        "desc" : "Eine Übungsfirma (Üfa) ist eine Einrichtung, in Schüler ein simuliertes Unternehmen bilden, um mit anderen Übungsfirmen im In- und im Ausland (weltweit gibt es über 7000 Übungsfirmen) mit virtuellen Waren und Geld zu handeln.<br>Die Übungsfirma der HTL Villach besteht aus den Abteilungen Einkauf, Verkauf, Personal, Rechnungswesen und Sekretariat.<br>Die Übungsfirma kauft und verkauft Produkte/Dienstleistungen, zahlt Steuern und Abgaben und erledigt alle notwendigen Behördenwege (Sozialversicherung, Firmenbuch, Bank, Gericht, Shopping Mall, Gewerbebehörde etc.) online. <br>Die ÜFA der HTL Villach wird zum Großteil papierlos geführt.",
        "visited" : [],
        x:363,
        y:492
    },{
        "name" : "1. Jahrgang – Wie startet man erfolgreich?",
        "desc" : "Wie schaffst du den erfolgreichen Einstieg in die Informatik?<br>Schüler des ersten Jahrgangs geben Tipps für den Einstieg: <br>Zeitmanagement<br>Arbeitseinteilung<br>Selbstorganisation  <br>Eigenverantwortung<br>Buddysystem<br>PeerCoaching<br>Schüler helfen Schülern<br>…",
        "visited" : [],
        x:644,
        y:487
    },{
        "name" : "Apps Corner",
        "desc" : "Mobile Apps (für Android) baut bei uns jede(r) ab dem 4. JG. Das können eigene Spiele sein wie letztes Jahr, oder wir nutzen öffentliche Web-Services wie Google-Maps wie heuer, und selbstverständlich bauen wir eigene Web-Services die wir mit anderen synchronisieren und kombinieren.",
        "visited" : [],
        x:640,
        y:381
    },{
        "name" : "Programmierwerkstatt",
        "desc" : "„hands on – start programming, schreib dein erstes Programm“<br><br>„Hier wird mit Unterstützung der Schüler der erste Source Code in C geschrieben, ausgeführt und getestet. Je nach Wissenstand des Schnupperschülers reicht das von einem ‚Hello World‘ bis hin zur Ausgabe eines dynamisch gezeichneten Dreiecks.“",
        "visited" : [],
        x:925,
        y:488
    },{
        "name" : "Toolsmatrix, Stundenvergleich, Stundenplan",
        "desc" : "Unterschied zu anderen Schulformen und Abteilungen.<br>Vergleiche die Stundentafel der Informatik mit anderen Abteilungen, schau dir exemplarische Stundenplänen der Abteilung an.<br>Außerdem bekommst du einen Überblick über die Tools und die Programmiersprachen die du in 5 Jahren erlernst und verwendest!",
        "visited" : [],
        x:777,
        y:383
    },{
        "name" : "Elektronik, Messtechnik & Mikrocontroller",
        "desc" : "Software steuert jede Hardware, die Zukunft liegt in der Software<br>Grundlegende Elektronik-Kenntnisse können auch für Informatiker wichtig sein. Hier zeigen wir dir die Anwendung von Messgeräten und einfache Anwendungen von Mikrocontrollern. Natürlich mit \"software inside\"!",
        "visited" : [],
        x:855,
        y:274
    },{
        "name" : "Unternehmen und Absolventen ",
        "desc" : "Wir kooperieren mit der Wirtschaft und haben ein hervorragendes Absolventennetzwerk.<b>Mit 5 Unternehmen, unseren erfolgreichen Absolventen und einem gesponserten, international renommierten Stärken-Test bieten wir auf Firmenebene wieder Einiges.",
        "visited" : [],
        x:752,
        y:135
    },{
        "name": "iRoute",
        "desc" : "",
        "visited" : [],
        x:388,
        y:126
    }

]);
db.routen.drop();
db.createCollection("routen");