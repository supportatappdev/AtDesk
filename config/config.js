/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/agile");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });
 
    $stateProvider 
        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "common/content.html",
        }).state('setup', {
            abstract: true,
            url: "/setup",
            templateUrl: "common/content.html",
        })
        .state('setup.proj', {
            url: "/proj",
            templateUrl: "projects.html",
             data: { pageTitle: 'Projects' }
        }).state('setup.resources', {
            url: "/resources",
            templateUrl: "resources.html",
             data: { pageTitle: 'Resources' }
        }) .state('setup.edittask', {
            url: "/edittask/:taskid",
            templateUrl: "edittask.html",
             data: { pageTitle: 'Edit Task' },
              resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      /*  {
                            files: [_appUrl+'/assets/js/angular-file-upload.js']
                        },*/
                        { 
                            name: 'summernote',
                            files: [_appUrl+'/assets/inspinia/css/plugins/summernote/summernote.css',
                                _appUrl+'/assets/inspinia/css/plugins/summernote/summernote-bs3.css',
                                _appUrl+'/assets/inspinia/js/plugins/summernote/summernote.min.js',
                                _appUrl+'/assets/inspinia/js/plugins/summernote/angular-summernote.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: [_appUrl+'/assets/inspinia/css/plugins/datapicker/angular-datapicker.css',_appUrl+'/assets/inspinia/js/plugins/datepicker/angular-datepicker.js']
                        },
                        {
                            files: [_appUrl+'/assets/inspinia/js/plugins/jasny/jasny-bootstrap.min.js']
                        }, {
                            name: 'localytics.directives',
                            files: [_appUrl+'/assets/inspinia/css/plugins/chosen/chosen.css',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.jquery.js',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.js']
                        }
                ]);
                }
             }
             
        })
        .state('setup.addtask', {
            url: "/addtask/:taskid",
            templateUrl: "addtask.html",
             data: { pageTitle: 'Add Task' },
              resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      /*  {
                            files: [_appUrl+'/assets/js/angular-file-upload.js']
                        },*/
                        { 
                            name: 'summernote',
                            files: [_appUrl+'/assets/inspinia/css/plugins/summernote/summernote.css',
                                _appUrl+'/assets/inspinia/css/plugins/summernote/summernote-bs3.css',
                                _appUrl+'/assets/inspinia/js/plugins/summernote/summernote.min.js',
                                _appUrl+'/assets/inspinia/js/plugins/summernote/angular-summernote.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: [_appUrl+'/assets/inspinia/css/plugins/datapicker/angular-datapicker.css',_appUrl+'/assets/inspinia/js/plugins/datepicker/angular-datepicker.js']
                        },
                        {
                            files: [_appUrl+'/assets/inspinia/js/plugins/jasny/jasny-bootstrap.min.js']
                        }, {
                            name: 'localytics.directives',
                            files: [_appUrl+'/assets/inspinia/css/plugins/chosen/chosen.css',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.jquery.js',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.js']
                        }
                ]);
                }
             }
             
        }).state('setup.addproject', {
            url: "/addproject/:projId",
            templateUrl: "addproj.html",
             data: { pageTitle: 'Add Project' },
                         resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: [_appUrl+'/assets/inspinia/css/plugins/datapicker/angular-datapicker.css',
                            _appUrl+'/assets/inspinia/js/plugins/datepicker/angular-datepicker.js']
                        },
                        {
                            files: [_appUrl+'/assets/inspinia/js/plugins/jasny/jasny-bootstrap.min.js']
                        },
                        {  
                            name: 'daterangepicker',
                            files: [_appUrl+'/assets/inspinia/js/plugins/daterangepicker/angular-daterangepicker.js']
                        },
                        {
                            files: [_appUrl+'/assets/inspinia/css/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css']
                        },
                        {
                            name: 'localytics.directives',
                            files: [_appUrl+'/assets/inspinia/css/plugins/chosen/chosen.css',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.jquery.js',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.js']
                        }

                    ]);
                }
            }
        }).state('index.agile', {
            url: "/agile",
            templateUrl: "agileboard.html",
            data: { pageTitle: 'Agile Board' }, 
             resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      /*  {
                            files: [_appUrl+'/assets/js/angular-file-upload.js']
                        },*/
                        { 
                            name: 'summernote',
                            files: [_appUrl+'/assets/inspinia/css/plugins/summernote/summernote.css',
                                _appUrl+'/assets/inspinia/css/plugins/summernote/summernote-bs3.css',
                                _appUrl+'/assets/inspinia/js/plugins/summernote/summernote.min.js',
                                _appUrl+'/assets/inspinia/js/plugins/summernote/angular-summernote.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: [_appUrl+'/assets/inspinia/css/plugins/datapicker/angular-datapicker.css',_appUrl+'/assets/inspinia/js/plugins/datepicker/angular-datepicker.js']
                        },
                        {
                            files: [_appUrl+'/assets/inspinia/js/plugins/jasny/jasny-bootstrap.min.js']
                        }, {
                            name: 'localytics.directives',
                            files: [_appUrl+'/assets/inspinia/css/plugins/chosen/chosen.css',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.jquery.js',
                            _appUrl+'/assets/inspinia/js/plugins/chosen/chosen.js']
                        },
                        {
                            name: 'ui.sortable',
                            files: [_appUrl+'/assets/inspinia/js/plugins/ui-sortable/sortable.js']
                        } 
                ]);
                }
             }
             
           /*  resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: [_appUrl+'js/plugins/sweetalert/sweetalert.min.js', _appUrl+'css/plugins/sweetalert/sweetalert.css']
                        },
                        {
                            name: 'oitozero.ngSweetAlert',
                            files: [_appUrl+'js/plugins/sweetalert/angular-sweetalert.min.js']
                        },
                        {
                            name: 'ui.sortable',
                            files: [_appUrl+'/assets/inspinia/js/plugins/ui-sortable/sortable.js']
                        }                    ]);
                        
                }
            }*/
            
        });
        
}  


function getBaseURL() {
	   return location.protocol + "//" + location.hostname + 
	      (location.port && ":" + location.port) ;
}; 
function getAppName(p) {
   if(p.indexOf("nfi") > -1) {
     return "/nfi"
   }
   return "/";
}
var _appUrl = getBaseURL()+getAppName(window.location.pathname);

var atDesk = angular
    .module('atDesk')


    atDesk.config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "nfi";
        $rootScope.appUrl = _appUrl;
    });