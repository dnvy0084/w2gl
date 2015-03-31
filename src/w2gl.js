
this.w2gl = this.w2gl || {};

this.w2gl.usenamespace = function( global, scope )
{
	scope = scope || w2gl;

	global.require = function( module )
	{
		if( !scope.hasOwnProperty( module ) )
		{
			throw new Error( "cannot find module name: " + module );
		}

		return scope[ module ];
	}

	global.namespace = function( module )
	{
		if( !scope.hasOwnProperty( module ) )
		{
			scope[ module ] = {};
		} 

		return scope[ module ]; 
	} 
};

this.w2gl.usenamespace( this );