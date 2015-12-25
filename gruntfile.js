module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    // 
    require('time-grunt')(grunt);

    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            uglify: {
                files: ['public/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['public/**/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/libs/**/*.js']
            },
            all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
        },

        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    'dist/build/index.css': [
                        'public/less/iconfont.less',
                        'public/less/index.less'
                    ]
                }
            }
        },
        copy: {
          fonts: {
            expand: true,
            src: 'public/less/fonts/*',
            dest: 'dist/build/fonts/',
            flatten: true
          },
          imgs: {
            expand: true,
            src: 'public/img/*',
            dest: 'dist/build/img/',
            flatten: true
          }
        },
        uglify: {
            development: {
                files: {
                    'dist/build/admin.min.js': 'public/js/admin.js',
                    'dist/build/detail.min.js': [
                        'public/js/detail.js'
                    ]
                }
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },

        // mochaTest: {
        //   options: {
        //     reporter: 'spec'
        //   },
        //   src: ['test/**/*.js']
        // },

        concurrent: {
            tasks: ['nodemon', 'watch', 'less', 'uglify', 'copy:imgs', 'copy:fonts',
                // 'jshint'
            ],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.option('force', true);

    grunt.registerTask('default', ['concurrent']);

    // grunt.registerTask('test', ['mochaTest'])
};

