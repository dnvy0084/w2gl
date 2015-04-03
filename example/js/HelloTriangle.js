
(function (global){
			
	"use strict";

	var util = require( "util" );

	var gl, program, buffer;

	function HelloTriangle()
	{
		
	};

	var p = HelloTriangle.prototype;

	p.init = function( webglContext )
	{
		gl = webglContext;
		gl.clearColor( 0, 0, 0, 1 );
		
		this.makeProgramAndInitShaders();
	};

	p.dispose = function()
	{
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		gl.deleteBuffer( buffer );
		gl.deleteProgram( program );
	};

	p.createBufferAndUpload = function()
	{
		gl.useProgram( program );

		buffer = gl.createBuffer();

		var r = 0.5,
			vertices = new Float32Array([
				0, r,
				r, -r,
				-r, -r
			]);

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		this.render();
	};

	p.render = function()
	{
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		var pos = gl.getAttribLocation( program, "aPos" );

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		
		gl.enableVertexAttribArray( pos );
		gl.vertexAttribPointer( pos, 2, gl.FLOAT, false, 4 * 2, 4 * 0 );
		gl.drawArrays( gl.TRIANGLES, 0, 3 );
	};

	p.makeProgramAndInitShaders = function()
	{
		var args = [gl];

		var loadComplete = function( sources )
		{
			program = util.createProgram.apply( null, args.concat( sources ) );
			this.createBufferAndUpload();

		}.bind( this );

		util.loadShaderCodes( loadComplete, [
			"shader/BasicVertexShader.cpp",
			"shader/BasicFragmentShader.cpp"
		])
	};

	p.createShader = function( type, source )
	{
		console.log( type, source );

		var shader = gl.createShader( type );

		gl.shaderSource( shader, source );
		gl.compileShader( shader );

		if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
		{
			throw new Error( gl.getShaderInfoLog( shader ) );
		}

		return shader;
	};

	global.HelloTriangle = HelloTriangle;

})(this);

