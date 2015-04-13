
(function (){
	
	var graphics = require( "graphics" ),
		math = require( "math" );

	var colorBuffer, indexBuffer, orthogonal;

	function Rect( x, y, w, h )
	{
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;

		this.mat4 = new math.Mat4();
	};


	var p = Rect.prototype;

	Rect.initGeometry = function( gl )
	{
		if( colorBuffer != null ) return;

		colorBuffer = gl.createBuffer();

		var colors = new Float32Array([
			0,0,0, 	1,0,0,	
			1,0,0, 	0,1,0,
			1,1,0,	0,0,1,
			0,1,0,	1,0,1
		]);

		gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW );

		indexBuffer = gl.createBuffer();

		var indices = new Uint16Array([
			0,1,2,	0,2,3
		]);

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );

		orthogonal = math.Mat4.orthogonal( gl.canvas.width, gl.canvas.height );
	};

	p.draw = function( gl, program )
	{
		var pos = gl.getUniformLocation( program, "pos" ),
			color = gl.getAttribLocation( program, "aColor" );

		var model = gl.getUniformLocation( program, "model" ),
			projection = gl.getUniformLocation( program, "projection" );

		this.mat4.translate( this.x, this.y, 0 );
		this.mat4.scale( this.width, this.height, 1 );

		gl.uniformMatrix4fv( model, false, this.mat4.raw );
		gl.uniformMatrix4fv( projection, false, orthogonal.raw );

		gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );

		gl.enableVertexAttribArray( color );
		gl.enableVertexAttribArray( pos );

		gl.vertexAttribPointer( pos, 3, gl.FLOAT, false, 4 * 6, 4 * 0 );
		gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 4 * 6, 4 * 3 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
	};

	graphics.Rect = Rect;

})();


(function (global){
	
	"use strict";

	var util = require( "util" ),
		graphics = require( "graphics" );

	var gl,
		program,
		children = [];

	function TransformTriangle()
	{
		
	};

	var p = TransformTriangle.prototype;

	p.init = function( webgl, numRects )
	{
		gl = webgl;
		gl.enable( gl.DEPTH_TEST );
		gl.clearColor( 0, 0, 0, 1 );

		graphics.Rect.initGeometry( gl );
		children.length = numRects;

		util.loadShaderCodes( this.onComplete.bind(this), [
			"shader/RectVertexShader.cpp",
			"shader/RectFragmentShader.cpp"
		]);
	};

	p.onComplete = function( sources )
	{
		program = util.createProgram( gl, sources[0], sources[1] );

		this.layout();

		(this.render = function( ms ){
			
			this.stats.begin();
				this.draw( ms );
			this.stats.end();

			this.reqId = requestAnimationFrame( this.render );

		}.bind( this ))( 0 );
	};

	p.dispose = function()
	{
		cancelAnimationFrame( this.reqId );
	};

	p.layout = function()
	{
		var MAX_SIZE = 500,
			MIN_SIZE = 100;

		var x, y, w, h, r,
			stageW = gl.canvas.width, 
			stageH = gl.canvas.height;

		for( var i = 0; i < children.length; i++ )
		{
			x = Math.random() * stageW;
			y =	Math.random() * stageH;
			w = ( MAX_SIZE - MIN_SIZE ) * Math.random() + MIN_SIZE;
			h = ( MAX_SIZE - MIN_SIZE ) * Math.random() + MIN_SIZE;

			r = children[i] = new graphics.Rect( x, y, w, h );
			r.ox = x;
			r.oy = y;
			r.radius = Math.random() * 100 + 10;
			r.speed = 500 * Math.random() + 100;
		}
	};

	p.draw = function( ms )
	{
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		gl.useProgram( program );

		var r,
			stageW = gl.canvas.width, 
			stageH = gl.canvas.height;

		for( var i = 0; i < children.length; i++ )
		{
			r = children[i];

			r.x = r.ox + r.radius * Math.cos( ms / r.speed );
			r.y = r.oy + r.radius * Math.sin( ms / r.speed );

			r.draw( gl, program );
		}
	};

	global.TransformTriangle = TransformTriangle;

})( this );