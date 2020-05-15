## [Programmierung und Design von WebApplications mit HTML5, CSS3 und JavaScript](https://lsf.uni-regensburg.de/qisserver/rds?state=verpublish&status=init&vmfile=no&publishid=148115&moduleCall=webInfo&publishConfFile=webInfo&publishSubDir=veranstaltung) ##

SS2020 

Leitung: Dr. Friedrich Wünsch, Louis Ritzkowski

# Starfall #

Gina Kastner - 2090583


### Beschreibung ###
Ein Glühwürmchen hat die Aufgabe, eine bestimmte Menge an Sternenlicht zu sammeln, bevor die Sonne aufgeht.

### Umsetzung ###
Es werden zufällig Items generiert, die entweder Sterne, Super-Sterne oder Schneeflocken sein können. Normale Sterne geben einen Punkt und verursachen 0,5 Punkte Verlust, wenn sie nicht gefangen werden. Mit einem Super-Stern werden alle normalen Sterne, die aktuell verfügbar sind, aufgefangen. Schneeflocken frieren normale Sterne, die aufgefangen werden können, für eine kurze Zeit ein. Spezialitems haben jeweils keine Auswirkungen auf einander.\
Die Spielzeit ist abgelaufen, wenn die Sonne vollständig aufgegangen ist.\
Pro Level sind zusätzlich 10 Punkte zu erreichen, und die Geschwindigkeit der fallenden Items, aber auch des Spielers erhöht sich mit jedem Level.\

### Steuerung ###
- Item/Steuerungshinweise am Rand des Bildschirms: mit Maus hovern, um Beschreibungen anzuzeigen
- Spiel starten: E oder Enter
- Bewegung Glühwümchen: Pfeiltasten oder W/A/S/D
- Laufendes Spiel beenden: Q oder ESC
- Zurückkehren zum Startbildschirm: Zweites Mal Q oder ESC
- Sound an/aus: M oder Button auf Startbildschirm aktivieren 

### Wichtige Klassen/Dateien ###
JS:\
- ImageInitializer: Legt Bildelemente an, welche für jede Instanz einer Klasse wiederverwendet werden können.\
- BackgroundObjects: Enthält die Klassen der beweglichen Hintergrundobjekte TreeRow, Sun und Moon und Steuerung des Fortschrittsbalkens.\
- DropItems: Enthält die Klassen für die sammelbaren Items Star, AllStar und Snow.\
- BackgroundEngine: Enthält Methoden für die Hintergrundanimation, d. h. Bewegung und Generierung der Baumreihen, Sonne, Mond und Veränderungen des Himmels.\
- Starfall: Initialisierung und Ablauf des Spiels.\

CSS:\
- gameScreen: Bildschirm, Menü, Goldener Rahmen und Box zur Fortschrittsanzeige\
- controls und items: Tutorial-Buttons und Items\

### Designentscheidungen ###
Als Grundlage habe ich den Code der GameBox übernommen und ihn stellenweise etwas abgewandlet oder erweitert.

Man merkt vermutlich, dass meine Priorität bei diesem Spiel die grafischen Effekte waren - es hätten noch ein paar DropItems zusätzlich hinzugefügt werden können, was ich zeitlich aber nicht mehr geschafft habe.

Mit der Animation der Baumreihen, der richtigen Positionierung und Bewegung von Sonne und Mond und der Erweiterung um die Farbveränderung des Himmels, wenn die Sonne aufgeht, habe ich vermutlich die meiste Zeit verbracht. Dazu verwende ich zwei Gradienten, die Farben des ersten werden zunächst abhängig vom Himmelskörper und dessen Position verändert und ab einem gewissen Sonnenstand wird der Sonnenaufgangs-Gradient mit dem des blauen Himmels überblendet.

Drop-Items beginnen zu leuchten, wenn sie eingesammelt werden können und werden zum Bildschirmrand hin größer, wodurch ich zusammen mit der Vergrößerung der Baumreihen den Eindruck erwecken wollte, als dass das Glühwürmchen vorwärts fliegt.

Ein weiteres Feature, das mir wichtig war, war der leuchtende Rahmen, den ich als Fortschrittsbalken verwende, indem je nach Gesamtpunkten für das Level berechnet wird, wie viel Prozent pro Punkt angezeigt werden müssen und dann eine Box in der Farbe des Hintergrunds entsprechend verschoben wird.

Die Button-Designs folgen ebenfalls dem Leucht-Konzept, der Musik-Button bleibt aktiviert, wenn er angeklickt oder M gedrückt wird, bis man die Musik wieder abschaltet.

Sämtliche Bilder werden bei vor dem GameEngine initialisiert, damit alle Items dasselbe Bild verwenden können und sie nicht erst während dem Spiel für jedes einzelne Objekt neu angelegt werden müssen. Ursprünglich wollte ich vor allem für den Spieler und die Baumreihen eigene Bilder zeichnen und stattdessen verwenden, es sollte nämlich dynamisch für jede Baumreihe ein anderes Bild ausgewählt werden, um ein bisschen Variation in den Wald zu bringen. Da aber mein Grafiktablet in GIMP streikt und das was ich mir da vorgestellt hatte nur mit der Maus nicht umsetzbar ist, steht an der Stelle der geplante Code und es werden weiterhin die Platzhalter-Bilder verwendet.


