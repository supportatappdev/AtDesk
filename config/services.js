atDesk.service('Util',function($filter){

this.convertDate = function(_date) { 
 return $filter('date')(_date, "dd-MM-yyyy"); 
}   
 
});
atDesk.service('BSServiceUtil', function (notify,BSService,Cache) {
this.loadResources = function() {
    if(Cache.get('atDesk_res')) {
        return Cache.get('atDesk_res');
    } else {
        this.queryResult("usersRefAlias","atDesk_res");
    }
}

this.reloadProjects = function() {
 this.removeProjects();
 this.loadProjects();

}
this.loadProjects = function(isreload) {
    if(isreload) {
      this.removeProjects();
        this.queryResult("atDeskProjectRef","atDesk_proj");
    } else {
        if(Cache.get('atDesk_proj')) {
            return Cache.get('atDesk_proj');
        } else {
            this.queryResult("atDeskProjectRef","atDesk_proj");
        }
    }
}

/* this.getProjectResources = function(proj_id,wC,wCParams,callback) {

    var wc = "RPOJ_ID = ?"
    queryResultWithCallback

}
*/
this.queryResultWithCallback = function(dsName,keyName,wC,wCparams,oB,callback) {
      var inputJSON = {"ds":dsName, "executeCountSql": "N"};
        if(wC) {
            inputJSON.wC = wC;
        }
        if(wCparams) {
            inputJSON.params = wCparams;
        }
        if(oB) {
            inputJSON.oB = oB;
        }
        BSService.query({"method":"data"},inputJSON , function(result){
            if (result.status === "E") {
                notify({ message: result.title+' - '+result.errorMsg,
                    classes: 'alert-danger'});
            } else {
                if (result.data.length > 0) {
                    if(keyName) {
                        Cache.put(keyName,result.data);
                    }
                    if(callback) {
                        callback(result.data);
                    }
                }
            }
        });
}

this.queryResult = function(dsName,keyName) {
      var inputJSON = {"ds":dsName, "executeCountSql": "N"};
       if(dsName ==="usersRef") {
       
          inputJSON.skipCondtions  = "Y";
       }
        inputJSON.oB = "CREATION_DATE ASC";
        BSService.query({"method":"data"},inputJSON , function(result){
            console.log(result);
            if (result.status === "E") {
                notify({ message: result.title+' - '+result.errorMsg,
                    classes: 'alert-danger'});
            } else {
                if (result.data.length > 0) {
                   Cache.put(keyName,result.data);
                    return Cache.get(keyName);
                }
            }
        });
}

this.removeResources = function() {
    Cache.remove('atDesk_res');
}
this.removeProjects = function() {
    Cache.remove('atDesk_proj');
}

});

atDesk.service('CommentService', function (notify,BSService) {

var addOnlyComments = function(inputJson,callback) {
        var operation;
        var datajson;
        operation = "INSERT"; 
        var dataItem = {
            'ACTIVITY_ID':inputJson.actId,
            'COMMENT':inputJson.comment,
            'APP_ID':inputJson._appId, 
            'ORG_ID':inputJson._orgId, 
            'ATTACHMENT_ID':inputJson._fileId
        };
        var datajson = {'ds':'commCommentsRef','operation':operation,'data':dataItem}; 
        BSService.save({'method':'update'},datajson, function(result){
                callback(result);
        });
};

this.addComment = function(inputJson,callback){
	    var operation = "INSERT";
            datajson = {
                'ds': 'commActivitiesRef',
                'operation': 'INSERT',
                'data': {
                    'SOURCE_OBJECT_ID': inputJson.actId,
                    'ACTIVITY_NAME': inputJson.comment, 
                    'ACTIVITY_TYPE_ID': 0,
                     'APP_ID':inputJson._appId,
                    'ORG_ID': inputJson._orgId, 
                    //'CREATION_DATE': new Date(),
                    'CREATED_BY': inputJson._uId,
                    'LAST_UPDATED_BY': inputJson._uId,  
                   // 'LAST_UPDATE_DATE': new Date(),
                    'isGenIds': "Y"
                }  
            };
        BSService.save({
            'method': 'update'
        }, datajson, function(result) {
            if (result.status === "E") {
                notify({
                    message: result.title + ' - ' + result.errorMsg,
                    classes: 'alert-danger'
                });
            } else {
                var _genIds = result.ids;
                    addOnlyComments(inputJson,callback);
            }
        });
};

this.getComments = function (input,callback) {
	 var inputJSON = {'ds':'deGetCommentsRefV', 'executeCountSql': 'N'}; 
	 inputJSON.wC = "ACTIVITY_ID = ? and APP_ID = ? and ORG_ID = ?"; 
	 inputJSON.oB = "CREATION_DATE DESC";
	 inputJSON.params = [input.actId,input._appId,input._orgId];
		 BSService.query({'method':'data'},inputJSON , function(result){
		     callback(result);
		 });

};
});

var baseUrl = _appUrl+"/api/";
var importUrl = _appUrl+getAppName(window.location.pathname)+"/import";
var attachUrl = _appUrl+"/aservice";

atDesk.factory('BSService', function($resource) {
return $resource(baseUrl + ':method', {'8180':':8180'}, {
query: {
method: 'POST',
params: {},
isArray: false
},
save: {
method: 'POST',
params: {},
isArray: false
},
invoke: {
method: 'POST',
params: {},
isArray: false
},
saveAll: {
method: 'POST',
params: {},
isArray: true
}
});
});

atDesk.service('Cache', function () {
    var map;
    this.getRawValue = function(key) {
        return localStorage.getItem(key);
    };
    this.init = function(){
        if (map) {
        	return;
        }
        if (localStorage.getItem('Cache')){
        	map = angular.fromJson(localStorage.getItem('Cache'));
        } else {
        	map = {};
        }
    };
    this.get = function (k) {
        this.init();
        return map[k];
    };
    this.put = function (k, v) {
        this.init();
        map[k] = v;
        localStorage.setItem('Cache', angular.toJson(map));
        return map[k];
    };
    this.remove = function (k) {
        this.init();
        delete map[k];
        localStorage.setItem('Cache', angular.toJson(map));
    };
    this.loggedInUser = function (k) {
        console.log(angular.fromJson(localStorage.$_u));
        return angular.fromJson(localStorage.$_u);
    };
});