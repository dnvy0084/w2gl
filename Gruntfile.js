module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify 설정. 
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> [<%= pkg.version %>] <%= grunt.template.today("yyyy-mm-dd, hh:MM:ss TT") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            }
        },

        // shell 설정. 
        shell: 
        {
            options: {
                stdout: true,
                stderr: true
            },

            target: {
                command: [ 
                    'git add .',
                    'git commit -m "commited by grunt at <%= grunt.template.today("yyyy-mm-dd, hh:MM:ss TT") %>"',
                    'git push origin master'
                ].join( '&' )
            }
        },

        // concat 설정. 
        concat: {
            basic: {
                src: [
                    "src/w2gl.js",
                    "src/util/*.js",
                    "src/**/*.js" 
                ],

                dest: "build/<%= pkg.name %>.js" 
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat']
            },
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    // load watch
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // load shell command plugins
    grunt.loadNpmTasks( 'grunt-shell' );

    // Default task(s)
    grunt.registerTask('default', ['concat', 'uglify']);

};