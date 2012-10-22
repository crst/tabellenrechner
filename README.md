Tabellenrechner
---------------

Tabellenrechner is a table predictor for a soccer league (or other
leagues with a similar point system), written in JavaScript. An
example can be found
[here](http://crst.github.com/tabellenrechner/tbl.html).

It loads the teams and matchdays from a configuration file
[tbl-data.js](tree/master/js/tbl-data.js).

Including
---------

The table predictor needs jQuery, just include it somewhere before
loading any of the JavaScript files from this project.

Then include the stylesheet [tbl.css](tree/master/css/tbl.css) and the
two JavaScript files [tbl.js](tree/master/js/tbl.js) and
[tbl-data.js](tree/master/js/tbl-data.js) (in this order). Finally,
add a ```div``` with the id ```tbl-container``` to the page, which
should then look somehow like this:

```html
<html>
  <head>
    ...
    <script src="path/to/jquery/jquery.js" type="text/javascript"></script>
    ...
    <link href="css/tbl.css" rel="stylesheet" type="text/css">
    <script src="js/tbl.js" type="text/javascript"></script>
    <script src="js/tbl-data.js" type="text/javascript"></script>
    ...
  </head>
  <body>
    ...
      <div id="tbl-container"></div>
    ...
  </body>
</html>
```

Opening the page in a browser should display the table predictor with
the example league. You can configure the league by modifying the
contents of the [tbl-data.js](tree/master/js/tbl-data.js) file, and
customize the appearance of the table predictor by modifying the
[tbl.css](tree/master/css/tbl.css) stylesheet.
