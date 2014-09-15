#onesize-css
=================

###Generate CSS for specific screen size from responsive CSS files for IE6-8.

IE8(when I said IE8, I mean IE8 and below ) are not support CSS3 Media Queries at all. And this is a big headache for all web developers.

Javascript solutions like Respond.js or css3-mediaqueries-js are awesome. But sometimes, IE8 are slow and poor performance on Javascript already, I just don't want to push more works on him.
 
The Question is: Are CSS3 Media Queries and responsive design really needed on IE8? 
I don't think so. How many people have IE8 on small screen device?

So, The idea of this script is to get rid of CSS3 Media Queries on IE8. Let it work and keep it stay at fullsize no matter what the browser size is.

The script generate a new seperate CSS file from your existing CSS files.

You develop your website with CSS3 Media Queries and test on modern browsers. and use this script to generate a new CSS and include it in your page on IE8 only (using IE HTML condition) and that's it :D.

