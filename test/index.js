var assert = require("assert")
var onesizeCss = require("../sources/onesize-css")



describe('CssOneSizeMedia', function(){
	describe('#simpleCss', function(){
		it('should create simple css', function(done){
			var cosm = new onesizeCss({minify: true, verbose:true})
			cosm.addCss('  @media screen and (min-width: 1000px){div.a{background:red;}}\n  span.b{background:blue;}  ');
			cosm.getResultCss( function(err, code){
					assert.equal('BODY#onesize-media.onesize-media div.a{background:red;}', code);
					done(err)
			} )
		})
	})	

	describe('#simpleFile', function(){
		it('should create simple css', function(done){
			var cosm = new onesizeCss({minify: true})
			cosm.addFile('test/simple.css');
			cosm.addFile('test/simple.less');
			cosm.addFile('test/simple.sass');
			cosm.getResultCss( function(err, code){
					var expected = 'BODY#onesize-media.onesize-media div.a{background:red;}' +
								   'BODY#onesize-media.onesize-media div.less{background:red;}'+
								   'BODY#onesize-media.onesize-media div.sass{background:red;}';

					assert.equal(expected , code);
					done(err)
			} )
		})
	})	
	
	describe('#badFile', function(){
		it('should error when bad file provided', function(done){
			var cosm = new onesizeCss({verbose:true})
			cosm.addFile('test/bad.css');

			cosm.getResultCss( function(err, code){
					assert.strictEqual(null,  code);
					done(code == null ? null:'bad code ')
			} )
		})
	})	
	

})