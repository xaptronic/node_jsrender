<h2>JsRender: Next generation <strike>jQuery</strike> <em>NodeJS</em> Templates</strike></h2>
<em>Optimized for high-performance pure string-based rendering, without <strike>DOM or jQuery</strike> <em>hassle</em> dependency. (Current version - "codeless" tag syntax)</em>

Original demos: [http://borismoore.github.com/jsrender/demos/step-by-step/index.html](http://borismoore.github.com/jsrender/demos/step-by-step/index.html).
See also [JsViews step-by-step samples](http://borismoore.github.com/jsviews/demos/step-by-step/index.html)

<h4>Without Express</h4>

After you checkout this module with npm or git:

var jsrender = require('jsrender');

process.on('start', function () {
  jsrender.template("yourtemplate", "<h4>{{=myvar}}</h4>");
  var result = jsrender.render("yourtemplate", {myvar:"Hello World!"});
  
  console.log(result);
});

Yields:

&lt;h4&gt;Hello World&lt;/h4&gt;

<h4>With Express</h4>

But who <em>isn't</em> using express these days?

// server.js
var jsrender = require('jsrender');
var express = require('express');

var app = express.createServer();

// TODO Make sure this is right
app.register('jsrender', jsrender.express);

// turn off layouts..

app.get('/', function (req, res) {
  var data = {people:[{name:"Alex",age:23},{name:"Waldo",age:34}],things:"Render all the things!"};
  res.render('index.jsrender', {meta: {title: "List of stuff"}, data: data});
});

app.listen(8080);

// index.jsrender
<html>
<head>
  <title>{{=meta.title}}</title>
</head>
<body>
  <h1>People!</h1>
  {{#each data.people}}
    <div>{{=name}} is {{=age}}</div>
  {{/each}}
</body>
</html>

<h4>Partials</h4>

// TODO In the partial tag if an array of objects is passed in then loop over them with partial..?
Refactoring the above index.jsrender template (pretending that we have a complex view of people data):

// index.jsrender
<html>
<head>
  <title>{{=meta.title}}</title>
</head>
<body>
  <h1>People!</h1>
  {{#each data.people}}
    {{partial name=name age=age}}
  {{/each}}
</body>
</html>

// person.jsrender
<div>{{=name}} is {{=age}}</div>

<h4>Layout</h4>

This section demonstrates two features; 
1) Using layouts.
2) The layout tag allows you to change the layout of a particular template.

<h5>Using layouts</h5> 

First lets take the above example express server and remove the nonsense about not using a layout:

// server.js
var jsrender = require('jsrender');
var express = require('express');

var app = express.createServer();

// TODO Make sure this is right
app.register('jsrender', jsrender.express);

<strong>// no more turn off layout</strong>

app.get('/', function (req, res) {
  var data = {people:[{name:"Alex",age:23},{name:"Waldo",age:34}],things:"Render all the things!"};
  res.render('index.jsrender', {meta: {title: "List of stuff"}, data: data});
});

app.listen(8080);

// layout.jsrender
<html>
<head>
  <title>TODO: How does this get here.. can a template pass variables to the layout using something like a block?</title>
</head>
<body>
  {{=body}}
</body>
</html>

The layout template automatically receives a variable called body which contains the rendered result of the content template, e.g.; index.js

// index.js
<div id="container">
  <div id="content">
    <div class="content-header">My Interesting Observations about Niches</div>
    <p>This is my content section where I detail something very interesting about a very niche subject.</p>  
  </div>
  <div id="sidebar">
    <div class="sidebar-header">Favorite Links</div>
    <ul>
      <li>NodeJS</li>
      <li>jQuery</li>
      <li>Other great new technologies</li>
    </ul>
  </div>
</div>

<h4>Templatable Templates / Script Blocks containing templates for use on the client</h4>

Okay, so far so good. Now the real value (read: what I really like about this) is that using this templating library gives me a single codebase that can work on the same templates on both the client and the server.
One of the problems you may not have thought of is what happens if you have a template that rendered on the server that has an inline template that is meant to be used on the client. Because it is using the same syntax there is some overlap here. We don't want the client template to be rendered at all.

Part of the express wrapper includes a tag syntax that is converted to the regular template syntax post render.

In a server template, {% and %} will be converted to {{ and }} respectively.

// TODO Remove the tmpl tag and put the tag conversion in the compile method.

// index.js
<html>
<head>
<script type="text/x-jquery-tmpl">
<p>This is a template. This is my variable: {%=myvariable%}</p>
</script>
</head>
<body>
A quick example of using templatable templates.
</body>
</html>

Once this is rendered the output returned will look like

// index.js (rendered)
<html>
<head>
<script type="text/x-jquery-tmpl">
<p>This is a template. This is my variable: {{=myvariable}}</p>
</script>
</head>
<body>
A quick example of using templatable templates.
</body>
</html>

This inline template is now ready to be used on the client.

You can mix and match this syntax to do something interesting things that I have not yet experimented yet.

<h4>Reusing Partials on the Server and Client</h4>

I have yet to add this functionality.. I may need to do some tricky business to accomplish this.
