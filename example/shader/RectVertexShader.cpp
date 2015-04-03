
uniform mat4 model;
uniform mat4 projection;

attribute vec3 pos;
attribute vec3 aColor;

varying mediump vec3 vColor;

void main()
{
	vColor = aColor;

	gl_Position = projection * model * vec4( pos, 1.0 );
}