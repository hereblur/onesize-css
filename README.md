#onesize-css
---

###Generate CSS for specific screen size from responsive CSS files for IE6-8.

IE8(when I said IE8, I mean IE8 and below ) are not support CSS3 Media Queries at all. And this is a big headache for all web developers especially for mobile-first project.

Javascript solutions like Respond.js or css3-mediaqueries-js are awesome. But sometimes, IE8 are slow and poor performance on Javascript already, I just don't want to push more works on him.
 
The Question is: Are CSS3 Media Queries and responsive design really needed on IE8? 
I don't think so. How many people have IE8 on small screen device?

So, The idea of this script is to get rid of CSS3 Media Queries on IE8. Let it work and keep the desktop layout no matter what the browser size is.

The script generate a new seperate CSS file from your existing CSS files.

You develop your website with CSS3 Media Queries and test on modern browsers. and use this script to generate a new CSS and include it in your page on IE8 only (using IE HTML condition) and that's it :D.

---

##Installation

You can install with NPM: `npm install onesize-css`

Or clone the repo: `git clone https://github.com/hereblur/onesize-css.git`

---

##Generate CSS

There are 2 ways to using this script.

###Command line usage 
        
    onesize-css [options option=parameter ...] <source> [more-source ...]

You can generate CSS file directly from command line. Possible parameters are: 
	
>###-mini, --minify          
>>Minify output.

>###-w, --width          	
>>Virtual screen width for matching the `@media` rules. It is usually the minimum size that your webpage start showing in the desktop version. default is 1024.

>###-pf, --prefix            
>>In the mobile-first webpage. IE8 always show the mobile version, so we need something to make the generated selectors more powerful. to override the mobile-first css.  So we use `id` and `class` on `BODY` tag to make it generated CSS more specificity. [https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity].

>###--verbose                
>>Be verbose.

>###-o, --output
>>Output filename. If no specify, it's write to stdout.

>###-v, --version            
>>Print version number and exit.

>###-h, --help               
>>Print help (this message) and exit.


###Using as a node module
```js
    var onesizeCss = require("onesize-css");
    var onesize = new onesizeCss({
            width: 1024,
            cssprefix: "BODY#onesize-media.onesize-media",
            minify: false,
            verbose: false
    })
```

As you can see above, the module accept 4 parameters which same/explained in the command line version. And I will explain in detail again below.

####Adding css sources
```js    
    onesize.addCss("@media screen and (min-width: 1000px){div.a{background:red;}} span.b{background:blue;}");

    onesize.addFile("simple.css");
    onesize.addFile("myfile.less");
    onesize.addFile("mycollege.sass");
```

We can add multiple source files and even mixed different types of CSS files and its' will mix/merge everything to a single file.

####Getting the generated CSS
```js
    onesize.getResultCss( function(err, code){
		if(err){
		    console.log("Something wrong :(  --> " + err  )
		}else{
		    fs.writeFile('generated-ie8.css', code, function(error){
		        console.log(error?'Write file failed':'Write file success')
		    })
		}
	})
```
We receiving generated CSS in the asynchronous fashion. And that's it. You got a CSS ready for IE8.

##Using the generated CSS on your webpage.
Most of the time, We will use this css for IE8 only. I assumed all of you are familiar with HTML Conditional comment, So:
```html
    <!--[if lte IE 8]>
    <link rel="stylesheet" type="text/css" href="generated-ie8.css" />
    <![endif]-->
```
####And the BODY tag.
If you look into the generated CSS file, You will see that everysingle selectors are leading by `BODY#onesize-media.onesize-media` or something else that you specify by `--prefix` or `cssprefix` parameter. This prefix is for making sure that our generated CSS is more powerful and harder to be overridden by something else. so, we have to make our `BODY` to get along with our generated css by apply `id` and `class` to match the prefix.
```html
    <!--[if lte IE 8]>
        <BODY id="onesize-media" class="onesize-media">
    <![endif]-->
    <!--[if gt IE 8]>
        <BODY>
    <![endif]-->
    <!--[if !IE]>-->
        <BODY>
    <!--<![endif]-->
```

##How it works?
This script read all of your css files and select the css-rules to be combined in the new css.
####Which rules will be include and which one not?
Only rules inside `@media` and the size matching with `width` parameter will be included.

let's say the `width` is 1024px, with the source css below.

```css
@media screen and (min-width: 1200px){
	div.a{background: blue;}
}

@media screen and (min-width: 1000px){
	div.a{background:red;}
}

@media screen and (max-width: 1200px){
	div.a{color:pink;}
}


@media screen and (max-width: 999px){
	div.a{background: yellow;}
}

span.a{
	background: orange;
}

```

The generated CSS:
```css
    BODY#onesize-media.onesize-media div.a{background:red;}
    BODY#onesize-media.onesize-media div.a{color:pink;}
```

As you can see the `width`(1024px) only matching 2 rules. and rules outside `@media` will not be included in the generated file.
 


##Issues
- Tested on IE8 only, will test on older version soon.
- Make sure your `BODY` tag on IE8 is matching the `prefix` parameter. 
- This script using `cssprefix` to make selectors stronger. but sometimes it's not enough. There're ways to overide the generated css, like using `#id` or `!important`. so, please avoid it.
- `@font-face`. This just not work. please use them in seperate files.
- This fix only media-query related only. not fixing other ie8 problems like html5tag, inline-block, border-radius, etc.
- This script fix CSS only, not fixing any javascript problem at all.
- Other bugs, issues or suggestion please welcome [https://github.com/hereblur/onesize-css/issues].




