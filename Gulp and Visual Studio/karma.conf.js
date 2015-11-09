module.exports = function (config) {
    config.set({
        files: ['./Scripts/*.js',
                './Scripts/Specs/**/*.js',
        ],

        exclude: ['./Scripts/libs/*.js'],

        frameworks: ['jasmine'],

        autoWatchBatchDelay: 1000,

        reporters: ['progress'],

        browsers: ['PhantomJS']
    });
};