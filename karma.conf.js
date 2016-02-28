module.exports = function(config){
  config.set({

    basePath : '',

    files : [
      'app/bower_components/jquery/dist/jquery.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'app/bower_components/angular-flash-alert/dist/angular-flash.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/a0-angular-storage/dist/angular-storage.js',
      'app/bower_components/ng-file-upload/ng-file-upload.min.js',
      'app/bower_components/angular-jwt/dist/angular-jwt.js',
      'app/bower_components/moment/min/moment-with-locales.min.js',
      'app/bower_components/admin-lte/dist/js/app.min.js',
      'app/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      'app/bower_components/select2/dist/js/select2.min.js',
      'app/js/**/*.js',
      /*'app/js/course/course.controllers.js',
       'app/js/course/course.module.js',
       'app/js/course/course.services.js',*/
      'test/ServiceAuthTest.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};