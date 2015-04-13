
/************************************************************
*
*  module Util
*
*************************************************************/


(function (){
	
	var util = require( "util" );

	util.getContext = function( canvas )
	{
		if( typeof canvas === "string" )
			canvas = document.getElementById( canvas );

		var gl;

		try
		{
			gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );
		}
		catch( e ){}

		return gl;
	}

	util.formatted = function()
	{
		var closer = arguments,
			str = arguments[0].toString(), i = 1;

		return str.replace( /\%s+/g, function()
		{
			return closer[i++].toString();
		});
	};

	util.createProgram = function( gl, vertexSource, fragmentSource )
	{
		var program = gl.createProgram();

		gl.attachShader( program, util.createShader( gl, gl.VERTEX_SHADER, vertexSource ) );
		gl.attachShader( program, util.createShader( gl, gl.FRAGMENT_SHADER, fragmentSource ) );

		gl.linkProgram( program );

		if( !gl.getProgramParameter( program, gl.LINK_STATUS ) )
		{
			throw new Error( 
				util.formatted( "LINK_ERROR: [%s]", gl.getProgramInfoLog( program ) ) 
			);
		}

		return program;
	}

	util.createShader = function( gl, type, source )
	{
		var shader = gl.createShader( type );

		gl.shaderSource( shader, source );
		gl.compileShader( shader );

		if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
		{
			throw new Error( 
				util.formatted( "COMPILE_ERROR: [%s]", gl.getShaderInfoLog( shader ) ) 
			);
		}

		return shader; 
	}

	util.loadShaderCodes = function( complete, path )
	{
		var loadedCodes = [];

		function onComplete( source )
		{
			loadedCodes.push( source );

			if( path.length == 0 )
				complete( loadedCodes );
			else
				$.get( path.shift(), onComplete );		
		}

		if( path.constructor == String ) path = [ path ];
		
		$.get( path.shift(), onComplete );
	}

})();