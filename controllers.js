/**
 *Controllers
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl() {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
};

function agileBoard(FileUploader,BSServiceUtil,$modal, $state,$scope) {
    
    $scope.addTask = function() {
        $state.go('setup.addtask')
        /*var modalInstance = $modal.open({
            templateUrl: 'addtask.html',
            size:"lg",
            controller: AddTaskCtrl
        });*/
    }

     $scope.tasks;
     $scope.projects = BSServiceUtil.loadProjects();
     var getTasks = function() {
        $scope.resources = {};
         var wC = undefined;
         var wCParams = undefined;
          var callback = function(data) {
              $scope.tasks = data;
              for(var cnt = 0 ; cnt < data.length; cnt++) {
              /*
                     <option value="1">In-Progress</option>
                                        <option value="2">Open</option>
                                        <option value="3">Closed</option>
                                        <option value="4">Re-Open</option>
                                        <option value="5">Resolved</option>*/
                  var item = data[cnt];
                  if(item.PRIORITY_ID ===1) {
                      item.statusClass = "danger";
                  }else if(item.PRIORITY_ID ===2) {
                      item.statusClass = "warning";
                  } else {
                      item.statusClass = "info";
                  }
                  if(item.STATUS_ID === 1) {
                      $scope.inProgressList.push(item);
                  } else if(item.STATUS_ID === 2) {
                      $scope.todoList.push(item);
                  } else {
                       $scope.completedList.push(item);
                  }
              }
          }
          var oB  = "CREATION_DATE DESC";
          var keyName = undefined
         BSServiceUtil.queryResultWithCallback("atDeskTasksV",keyName,wC,wCParams,oB,callback);
     }

   getTasks();
    $scope.todoList = [];
    $scope.inProgressList = [];
    $scope.completedList = [];/*
        {
            content: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
            date: '16.11.2015',
            statusClass: 'info',
            tagName: 'Mark'
        }
    ];*/


  $scope.sortableOptions = {
    update: function(e, ui) {
      var logEntry = todoList.map(function(i){
        return i.value;
      }).join(', ');
      $scope.sortingLog.push('Update: ' + logEntry);
    },
    stop: function(e, ui) {
      // this callback has the changed model
      var logEntry = tmpList.map(function(i){
        return i.value;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  };
    /*$scope.sortableOptions = {
       update: function(e, ui) { 
            console.log(e);
            console.log(ui);
        },
    
        connectWith: ".connectList"
    };*/
     BSServiceUtil.loadResources();
     BSServiceUtil.loadProjects();
     

}

function ProjCtrl(BSServiceUtil,BSService,$scope,notify,Cache,$state) {
 var projIds = "";
 
    function getProjectResource() {
        $scope.isLoading = true;
        var inputJSON = {"ds":"atDeskResourceV", "executeCountSql": "N"};
            inputJSON.wC = " PROJ_ID in ("+projIds+")";
            BSService.query({"method":"data"},inputJSON , function(result){
            $scope.isLoading = false;
                if (result.status === "E") {
                    notify({ message: result.title+' - '+result.errorMsg,
                        classes: 'alert-danger'});
                } else {
                    if (result.data.length > 0) {
                        var projResources = {};
                        for(var cnt = 0 ; cnt < result.data.length; cnt++) {
                            var PROJ_ID = result.data[cnt].PROJ_ID;
                            var pic_id  = result.data[cnt].pic_id;
                            var displayName = result.data[cnt].display_name;
                            if(projResources[PROJ_ID]) {
                              var item =  {"picId":pic_id,"name":displayName};
                              projResources[PROJ_ID].push(item)
                            } else {
                                var values = [];
                                var item = {"picId":pic_id,"name":displayName};
                                values.push(item);
                                projResources[PROJ_ID] = values;
                            }
                        }
                        $scope.projRes = projResources;
                    }
                }
            });
    }
    
    function getProjects() {
        $scope.isProjLoading = true;
        var inputJSON = {"ds":"atDeskProjectRef", "executeCountSql": "N"};
            inputJSON.oB = "CREATION_DATE DESC";
            BSService.query({"method":"data"},inputJSON , function(result){
            $scope.isLoading = false;
                if (result.status === "E") {
                    notify({ message: result.title+' - '+result.errorMsg,
                        classes: 'alert-danger'});
                } else {
                    if (result.data.length > 0) {
                        $scope.projects = result.data;
                        for(var cnt = 0 ; cnt < result.data.length; cnt++) {
                          projIds += result.data[cnt].ID;
                            if(cnt < result.data.length  - 1) {
                                projIds += ",";      
                            }
                        }
                        getProjectResource();
                    }
                }
            });
    }

getProjects();
    //load resources
    BSServiceUtil.loadResources();
    $scope.addProj = function($state) {
        $state.go("setup.addprojects");
    }
}
//atDeskProjectRef  


function AddProjCtrl(BSServiceUtil,BSService,$scope,notify,Cache,$state,$stateParams,Util) {
BSServiceUtil.loadResources();

$scope.projrow = {};
var operation = 'INSERT';
    
    if($stateParams.projId !== 'new') {
        operation = 'UPDATE';    
    } 
    $scope.addProj = function() {
       /*$scope.isLoading = true;*/
       
        var _st = Util.convertDate($scope.projrow.startdate);
         var _dt = Util.convertDate($scope.projrow.duedate);
               var params = {'ds':'atDeskProjectRef','operation':operation,
               'data':
                    {'PROJECT_NAME':$scope.projName,
                     'CODE':$scope.projName,
                     'DESCRIPTION':$scope.description,
                     'START_DATE':_st,
                     'DUE_DATE':_dt,
                      'STATUS_ID':$scope.status,
                     
                    }
               };
                if(operation === "UPDATE") {
                    params.data.custUpdate = "Y";
                    params.data.ID = $stateParams.projId;
                } else  {
                     params.data.isGenIds ='Y'
                }
                BSService.save({'method':'update'},params , function(result){
                if (result.status === "E") {
                    notify({ message: result.title+' - '+result.errorMsg,
                         classes: 'alert-danger'});
                } else {
                    var _projId;
                         if($stateParams.projId != 'new') {
                             var operation = 'DELETE';
                              var params = {'ds':'atDeskPrjResources','operation':operation};
                               params.wC = 'PROJ_ID=?'
                               params.params = [$stateParams.projId];
                                BSService.save({'method':'update'},params , function(result){
                                    if (result.status === "E") {
                                        notify({ message: result.title+' - '+result.errorMsg,
                                        classes: 'alert-danger'});
                                    } else {
                                        addResources($stateParams.projId);
                                    }
                                });
                            }else {
                                _projId  = result.ids[0];
                                addResources(_projId);
                            }
                     }
            });
       
    }
    
    var addResources  = function(_projId) {
        var params = [];
        var operation = "INSERT";
                        for(var cnt = 0 ; cnt < $scope.x.resource.length; cnt++) {
                            var _item = {'ds':'atDeskPrjResources','operation':operation,
                                                'data':
                                                    {
                                                        'RESOURCE_ID': $scope.x.resource[cnt],
                                                        'PROJ_ID':_projId
                                                    }
                                                };
                                params.push(_item);
                            }
                             BSService.save({'method':'update'},{"list":params} , function(result){
                             if (result.status === "E") {
                                 notify({ message: result.title+' - '+result.errorMsg,
                                      classes: 'alert-danger'});
                             } else {
                                 notify({ message: "Added project successfully",
                                     classes: 'alert-success'});
                                     $state.go('setup.proj');
                                     BSServiceUtil.loadProjects(true);
                             }
                         });
    
    }
     $scope.x = {};
     $scope.x.resource = [] 
    $scope.resources = Cache.get('atDesk_res');
    if(console) {
        console.log(Cache.get('atDesk_res'));
    }
    
    var getProjectDetail  = function() {
    
      $scope.isLoading = true;
      var inputJSON = {"ds":"atDeskProjectRef", "executeCountSql": "N"};
          inputJSON.wC = " ID = ?";
          inputJSON.params = [$stateParams.projId];
          inputJSON.oB = "CREATION_DATE ASC";
          BSService.query({"method":"data"},inputJSON , function(result){
          $scope.isLoading = false;
              if (result.status === "E") {
                  notify({ message: result.title+' - '+result.errorMsg,
                      classes: 'alert-danger'});
              } else {
                  if (result.data.length > 0) {
                      $scope.projName = result.data[0].PROJECT_NAME;
                      //$scope.projName,
                    $scope.description = result.data[0].DESCRIPTION;
                    $scope.projrow.startdate = result.data[0].START_DATE;
                    $scope.projrow.duedate = result.data[0].DUE_DATE;
                     $scope.status =  result.data[0].STATUS_ID;
                     
                      //$scope.pendingAudits = result.data;
                      var inputJSON = {"ds":"atDeskPrjResources", "executeCountSql": "N"};
                          inputJSON.wC = " PROJ_ID = ?";
                          inputJSON.params = [$stateParams.projId];
                          inputJSON.oB = "CREATION_DATE ASC";
                          BSService.query({"method":"data"},inputJSON , function(result){
                          $scope.isLoading = false;
                              if (result.status === "E") {
                                  notify({ message: result.title+' - '+result.errorMsg,
                                      classes: 'alert-danger'});
                              } else {
                                  if (result.data.length > 0) {
                                     for(var cnt = 0 ; cnt < result.data.length; cnt++) {
                                        $scope.x.resource.push(result.data[cnt].RESOURCE_ID);
                                     }
                                  }
                              }
                          });
                  }
              }
          });
    }
    getProjectDetail();
}

function AddTaskCtrl (CommentService,notify,BSService,FileUploader,BSServiceUtil,$scope, $stateParams,Util, $state,Cache,$filter) {
     $scope.resources;
     $scope.projects = BSServiceUtil.loadProjects();
          var operation = 'INSERT';
          /* get proj resources*/
     $scope.getProjResources = function() {
        $scope.resources = {};
         var wC = " PROJ_ID = ?";
         var wCParams = [$scope.taskrow.project];
          var callback = function(data) {
              $scope.resources = data;
          }
          var oB  = undefined;
          var keyName = undefined
         BSServiceUtil.queryResultWithCallback("atDeskResourceV",keyName,wC,wCParams,oB,callback);
     }
     
     /* get task details*/
     $scope.taskrow = {};
     function getTaskDetails() {
     
        var inputJSON = {"ds":"atDeskTasksV", "executeCountSql": "N"};
            inputJSON.wC = " TASK_ID = ?";
            inputJSON.params = [$stateParams.taskid];
            BSService.query({"method":"data"},inputJSON , function(result){
                if (result.status === "E") {
                    notify({ message: result.title+' - '+result.errorMsg,
                        classes: 'alert-danger'});
                } else { 
                    if (result.data.length > 0) {
                          $scope.taskrow.taskname = result.data[0].TASK_NAME; 
                            $scope.taskrow.description  = result.data[0].DESCRIPTION;
                            $scope.taskrow.assignedto  = result.data[0].ASSIGNED_TO;
                            $scope.taskrow.fileId  = result.data[0].ATTACHMENT_ID;
                            $scope.taskrow.startdate  = result.data[0].START_DATE;
                            $scope.taskrow.duedate  = result.data[0].DUE_DATE;
                            $scope.taskrow.status  = result.data[0].STATUS_ID;
                            $scope.taskrow.priority  = result.data[0].PRIORITY_ID;
                            $scope.taskrow.project = result.data[0].PROJ_ID;
                            $scope.taskrow.taskId = result.data[0].TASK_ID;
                    }
                }
            });
     
     }
     
     /* get task comments */
     var getTaskComments = function() {
         
        $scope.taskCommentsloading = true;
          var inputJson  = {"actId":$stateParams.taskid};
            var _u = localStorage.$_u;            
         if(_u) {
             inputJson._appId = 0; 
             inputJson._orgId = 0;
             inputJson._uId = _u.uId;
                var callback  = function(result){
                    if (result.status === "E") {
                        notify({ message: result.title+' - '+result.errorMsg,
                        classes: 'alert-danger'});
                    } else {
                         $scope.taskComments = [];
                        $scope.taskComments = result.data;
                        $scope.taskCommentsloading = false;                    
                    }
                }
             CommentService.getComments(inputJson,callback);
         } else {
                  notify({ message: 'User data not found ',
			    	   classes: 'alert-danger'});
            console.log(localStorage.$_u);
         }
     }
     if($stateParams.taskid) {
       operation = "UPDATE";
       getTaskDetails();
       getTaskComments();
     }
     
     
     $scope.addTask = function() {
         var _st = Util.convertDate($scope.taskrow.startdate);
         var _dt = Util.convertDate($scope.taskrow.duedate);
     
             var params = {'ds':'atDeskTasks','operation':operation,
             'data':{
                    'TASK_NAME':$scope.taskrow.taskname,
                    'DESCRIPTION':$scope.taskrow.description,
                    'ASSIGNED_TO':$scope.taskrow.assignedto,
                    'START_DATE': _st,
                    'DUE_DATE':_dt,
                    'STATUS_ID':$scope.taskrow.status,
                     'PRIORITY_ID':$scope.taskrow.priority,
                    'isGenIds':'Y'
                    }};
                    
                if(operation === "UPDATE") {
                    params.data.custUpdate = "Y";
                    params.data.ID = $stateParams.taskid;
                    
                } else {
                    params.data.ATTACHMENT_ID =  $scope.fileAttachRow.fileId;
                }
              BSService.save({'method':'update'},params , function(result){
              if (result.status === "E") {
                  notify({ message: result.title+' - '+result.errorMsg,
                       classes: 'alert-danger'});
              } else {
                  
                   var _taskId = result.ids[0];
                        var operation = 'INSERT';
                                var params = {'ds':'atDeskPrjTasks','operation':operation,
                                        'data':{'PROJ_ID': $scope.taskrow.project,
                                                'TASK_ID':_taskId
                                        }};
                                   BSService.save({'method':'update'},params , function(result){
                                   if (result.status === "E") {
                                       notify({ message: result.title+' - '+result.errorMsg,
                                            classes: 'alert-danger'});
                                       } else {
                                               notify({ message: 'Task has been created successfully',
                                            classes: 'alert-danger'});
                                            $state.go("index.agile");
                                       }
                                   });                   
              }
          });
     
     }
    
    //file uploader
    
    var attachUrl = _appUrl+"/aservice";
    	//file uploader 
	  // create a uploader with options
	  var fUploader = function() {
		  // create a uploader with options
		  var dataRow;
		  var uploader = new FileUploader({
		      url: attachUrl,
		      autoUpload:true,
		      removeAfterUpload:true
		    });
		  // FILTERS

	        uploader.filters.push({
	            name: 'customFilter',
	            fn: function(item /*{File|FileLikeObject}*/, options) {
	                return this.queue.length < 10;
	            }
	        });
		    uploader.setDataRow = function(ln) {
		    	dataRow = ln; 
		    	dataRow.uploaded = false;
		      };
		    // ADDING FILTERS
		    uploader.filters.push(function (item) { // second user filter
		        console.info('filter2');
		        return true;
		    });

		    uploader.onAfterAddingFile = function(fileItem) {
		       console.info('onAfterAddingFile', fileItem);
		      };
		      
		      uploader.onSuccessItem = function(fileItem, response, status, headers) {
		        var responseStatus = angular.fromJson(response);
		        dataRow.uploaded = true;     
		        dataRow.attachedfilename = responseStatus.name;
		        dataRow.fileId = responseStatus.fileId;
		          console.log(dataRow);  
		        if(responseStatus.error) {
		        	dataRow.message = responseStatus.errorMsg;
			        notify({ message: responseStatus.title +" - "+dataRow.message,
				    	   classes: 'alert-danger'});   
		        } 
		        /*else {
		        dataRow.message = responseStatus.msg;
		        notify({ message: dataRow.message,
			    	   classes: 'alert-success'});  
		        }*/
		      //   this.clearAll();
		      };
		      uploader.onErrorItem = function(fileItem, response, status, headers) {
		        //console.info('onErrorItem', fileItem, response, status, headers);
		        toaster.pop("error", "Error", "Error while uploading the file");
		        notify({ message: 'Error while uploading the file ',
			    	   classes: 'alert-danger'});
		        console.log(response);
		      };
		      uploader.onCancelItem = function(fileItem, response, status, headers) {
		        console.info('onCancelItem', fileItem, response, status, headers);
		      };
		      uploader.clearAll = function() {
		    	  dataRow.uploaded = false;
		    	  angular.forEach(angular.element("input[type='file']"),function(inputElem) {
			          angular.element(inputElem).val(null);
			        });
		      };

		      uploader.cancel = function() {
		    	  dataRow.uploaded=false;
		        angular.forEach(angular.element("input[type='file']"),function(inputElem) {
		          angular.element(inputElem).val(null);
		        });
		          delete dataRow.fileId;
		          delete dataRow.attachedfilename;
		        uploader.queue=[];
		      };
  
	    return uploader;
	  };
	    
	//end of file uploader
	    $scope.fileAttachRow = {};
	    $scope.fileUploader = new fUploader();
	    $scope.fileAttachRow.uploaded = false;
	    $scope.fileUploader.setDataRow($scope.fileAttachRow);
	    
	    $scope.$watch('taskrow.project', function (val){
            if(val) {
               $scope.getProjResources();
            }
         });

    $scope.addTaskComments = function() {
        
        if(!$scope.taskrow.taskcomments) {
           notify({ message: "Please enter comments",
                        classes: 'alert-danger'});
            return;
        }
        var inputJson  = {"comment":$scope.taskrow.taskcomments,
                        "actId":$scope.taskrow.taskId};
            var _u = localStorage.$_u;            
         if(_u) {
             inputJson._appId = _u.appId;
             inputJson._orgId = _u.orgId;
             inputJson._uId = _u.uId;
             inputJson._fileId = $scope.fileAttachRow.fileId;
                var callback  = function(result){
                    if (result.status === "E") {
                        notify({ message: result.title+' - '+result.errorMsg,
                        classes: 'alert-danger'});
                    } else {	
                        //console.log(result);
                        //$scope.taskComments.push($scope.taskrow.taskcomments);
                        getTaskComments();
                        $scope.taskrow.taskcomments = "";
                        $scope.fileAttachRow.fileId = "";;
                         $scope.fileAttachRow.uploaded = false;
                         
                    }
                }
             CommentService.addComment(inputJson,callback);
         } else {
                  notify({ message: 'User data not found ',
			    	   classes: 'alert-danger'});
            console.log(localStorage.$_u);
         }
    }

}


angular
    .module('atDesk')
    .controller('MainCtrl', MainCtrl)
    .controller('ProjCtrl',['BSServiceUtil','BSService','$scope','notify','Cache','$state',ProjCtrl])
    .controller('AddProjCtrl',['BSServiceUtil','BSService','$scope','notify','Cache','$state','$stateParams','Util',AddProjCtrl])
    .controller('AgileBoard',['FileUploader','BSServiceUtil','$modal','$state','$scope',agileBoard])
    .controller('AddTaskCtrl',['CommentService','notify','BSService','FileUploader','BSServiceUtil','$scope','$stateParams','Util','$state','Cache','$filter',AddTaskCtrl]);
    
    
    
    