var VERSION = [0,0,1]

var less = require("less"),
	css = require('css'),
	fs = require('fs'),
	path = require("path"),
	mediaQuery = require('css-mediaquery'),
	Q = require('q'),
	_ = require('underscore'),
	sass = require('node-sass');

var defaultOption = {
	width: 1024,
	cssprefix: "BODY#onesize-media.onesize-media",
	minify: false,
	verbose: false
}

var onesizeCss = function(_option){

	var $this = this;

	$this.version = VERSION

	var option = _.extend({} , defaultOption);
	option = _.extend(option , _option);
	var outputRules = [];
	var defers = []

	var errorOut = function( msg ){
		console.log( msg )
	}

	var verbose = function(msg){
		if(option.verbose)
			console.log(msg)
	}

	var isMatchMedia = function(mediaRule){
		
		return mediaQuery.match(mediaRule, {
				type: 'screen',
				width: option.width + 'px'
		})
	}


	var processRules = function(rules, includeThisRules){
		
		rules.forEach(function(r){

			
			if(r.type=='media' && isMatchMedia(r.media)){
				verbose("Media found: " + r.media)
				processRules(r.rules, true)
			}

			if(r.type=='rule' && includeThisRules){

				var new_rule = r


				verbose("Adding " + new_rule.selectors.length + " rules css.")
				
				new_rule.selectors.forEach(function(r, k){
					verbose("	+" + option.cssprefix + ' ' + r+ "{...}") 
					new_rule.selectors[k] =  option.cssprefix + ' ' + r
				})

				outputRules.push( new_rule )
			}
		})
	}

	var parseCss = function( code ,source ){
		var ast = css.parse( code, {source: source} )
		
		if(!ast)
			throw new Error("invalid css")

		processRules( ast.stylesheet.rules )
	}

	var parseLess = function( code, file, onDone ){
		var lessparser = new less.Parser({paths: [ path.dirname(file)] });
		lessparser.parse( code , function (err, tree) {
			  if (err) {
			  		onDone(err)
			  }
			  try{
			  	var csscode = tree.toCSS()

			  	parseCss( csscode , path.basename(file)+'.compiled.css');

			  }catch(e){
			  	errorOut(  e.message )
			  	if(e.column && e.line && e.source){
			  		errorOut( e.source.split('\n').slice(Math.min(e.line-2 ,0), Math.min(e.line-2 ,0)+4).join('\n') )
			  	}
			  	onDone(err)
			  	return
	          }

	          onDone()
			  
		});
	}


	var parseSass = function( code, file, onDone ){

		sass.render({	data: code,
					    success: function(cssCode){
					    	parseCss( cssCode , path.basename(file)+'.compiled.css');
					    	onDone(null, cssCode)
					    },
					    error: function(err){
					    	onDone(err)
					    },
					    includePaths: [ path.dirname(file)],

					 });

	}

	var processFile = function(file){
		var deferred = Q.defer();
	    fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
	        if (!err){
	        	try{

	        		if( file.match(/\.css$/) ){
	        			verbose("It's a raw css");
	        			parseCss( data, file );
	        			deferred.resolve('ok');
	        		}else
	        		if( file.match(/\.s(a|c)ss$/) ){
	        			verbose("It's a Sass file");
	        			parseSass( data, file , function(err){
	        				verbose("Parse SASS " + (err?'failed':'success') + '.');
	        				if(err)
	        					deferred.reject(new Error( file + " : " + err ));	
	        				else
	        					deferred.resolve('ok');
	        			})	
	        		}else
	        		if( file.match(/\.less$/) ){
	        			verbose("It's a Less file");
	        			parseLess( data, file, function(err){
	        				verbose("Parse LESS " + (err?'failed':'success') + '.');
	        				if(err)
	        					deferred.reject(new Error( file + " : " + err ));	
	        				else
	        					deferred.resolve('ok');
	        			} )
	        		}else
	        			throw new Error("unsupported filetype")
	 
	        	}catch(e){
	        		deferred.reject(new Error( e.message ));	
	        	}

	        	
	        }else{
	            //errorOut(file + " : " +err);
	            deferred.reject(new Error( "Cannot read " + file + " : " +err ));
	        }
	    });
		    
		return deferred.promise
	}

	$this.addFile = function(cssFile){
		verbose("adding file "+ cssFile)
		defers.push( processFile( cssFile ) )		
	}

	$this.addCss = function(cssCode){

		verbose("adding code `"+ cssCode.trim().substr(0, 50) + '...`.')	
		var deferred = Q.defer();
		
		setTimeout(function(){
			try{
				parseCss( cssCode, '[raw-code]' )
				deferred.resolve('ok');
			}catch(e){
        		deferred.reject(new Error( e.message ));	
        	}
		}, 1)
	    defers.push( deferred.promise )
	}

	$this.getResultCss = function(callBack){

		Q.all(defers)

		   .then(function(){
		   			verbose("process css success.")	

					var ast = {
								type: 'stylesheet',
								stylesheet: {
									rules: outputRules
								}
							  }

					verbose("building output (minifi:"+(option.minify?'Yes':'No')+").")	
					var code = css.stringify( ast, {compress: option.minify} )

					if( typeof(callBack)=='function' ){
						callBack( null, code );
					}

					verbose("Completed ("+ code.length +" bytes).")	
					defers = []
		   })
		   .fail(function (error) {

		   		verbose("createing css failed `" + error+ "`")	

			    if( typeof(callBack)=='function' ){
					callBack( error, null);
				}
			})
		   .done()

	}

}

onesizeCss.version = VERSION

module.exports = onesizeCss

