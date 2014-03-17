Word Run
=============
Web Chat, implemented as a single page application using cutting edge technologies.

The current technological stack consists of:
* RActiveJS – Mustache oriented DOM manipulator for our UI needs.
 * Backbone – Acts as a plugin to RActiveJS in order to form UI Models and Collections.
* Node.JS – I/O oriented server.
 * Socket IO – Pub-Sub engine for data traversal between the chat users.
 * Redis – Key-Value database to persist ExpressJS web sessions.
 * MongoDB – Document database used for data persistence.

Status
---------
The basic functionality and UI of the chat have been implanted.

Present tasks:
* Add cluster support.
* Finish up code TODOs.
* General code cleanup.

Future tasks:
* Use web rtc for private calls (text/audio/video).
* Add more UI features:
 * Filter by age/gender.
 * Find by name.
 * Save chat content.
 * Image sharing.
 * File sharing.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/eranbetzalel/wordrun/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

