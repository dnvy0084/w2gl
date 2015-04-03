
/************************************************************
*
*  4x4 Matrix
*
*************************************************************/

(function(){
	
	var math = namespace( "math" ),
		util = require( "util" );

	function Mat4( raw )
	{
		this.raw = raw || new Float32Array([
			1,0,0,0, 
			0,1,0,0,
			0,0,1,0,
			0,0,0,1
		]);
	};

	Mat4.orthogonal = function( w, h )
	{
		var m = new Mat4(),
			raw = m.raw;

		raw[0] = 2 / w, raw[12] = -1,
		raw[5] = -2 / h, raw[13] = 1;

		return m;
	}


	var p = Mat4.prototype;

	p.append = function( mat4 )
	{
		var a = this.raw, 
			b = mat4.raw,
			c = new Float32Array( 16 ),
			b00, b01, b02, b03;

		for( var i = 0; i < 16; i += 4 )
		{
			b00 = b[i  ], b01 = b[i+1], b02 = b[i+2], b03 = b[i+3];

			c[i  ] = a[0] * b00 + a[4] * b01 + a[8] * b02 + a[12] * b03;
			c[i+1] = a[1] * b00 + a[5] * b01 + a[9] * b02 + a[13] * b03;
			c[i+2] = a[2] * b00 + a[6] * b01 + a[10] * b02 + a[14] * b03;
			c[i+3] = a[3] * b00 + a[7] * b01 + a[11] * b02 + a[15] * b03;
		}

		return new Mat4( c );
	};

	p.identity = function()
	{
		this.raw = new Float32Array([
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1
		])
	};

	p.translate = function( x, y, z )
	{
		var raw = this.raw;

		raw[12] = x;
		raw[13] = y;
		raw[14] = z;
	};

	p.rotationZ = function( radian )
	{
		var cos = Math.cos( radian ),
			sin = Math.sin( radian ),
			raw = this.raw;

		raw[5] = cos;
		raw[6] = sin;

		raw[9] = -sin;
		raw[10] = cos;
	};

	p.scale = function( x, y, z )
	{
		var raw = this.raw;

		raw[0] = x;
		raw[5] = y;
		raw[10] = z;
	};

	p.toString = function()
	{
		var s = "| %s\t %s\t %s\t %s |\n" +
				"| %s\t %s\t %s\t %s |\n" +
				"| %s\t %s\t %s\t %s |\n" +
				"| %s\t %s\t %s\t %s |\n";

		var a = this.raw;

		return util.formatted( s, 
			a[0], a[4], a[8], a[12],
			a[1], a[5], a[9], a[13],
			a[2], a[6], a[10], a[14],
			a[3], a[7], a[11], a[15]
		);
	};

	math.Mat4 = Mat4;

})();