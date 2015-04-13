
/************************************************************
*
*  네임스페이스 지정, import( require ) 관련 util 함수들. 
*
*************************************************************/

(function (global){
	
	global.core_namespaceMap = global.core_namespaceMap || {};

	var specific_namespace;

	global.usenamespace = function( namespace )
	{
		specific_namespace = 
		global.core_namespaceMap[ namespace ] = global.core_namespaceMap[ namespace ] || {};

		return specific_namespace;
	};

	global.require = function( module )
	{
		if( typeof specific_namespace === "undefined" ||
			specific_namespace === null ) 
			throw new Error( "특정 네임스페이스가 지정되지 않았습니다.\n" + 
				"usenamespace( namespace_name )로 특정 네임스페이스를 지정할 수 있습니다." );

		specific_namespace[ module ] = specific_namespace[ module ] || {};

		return specific_namespace[ module ];
	};

})( this );