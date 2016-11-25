angular
.module('legapp')
.factory('$session',function($http,$location){
    return {
        start:function(user){
            date = new Date();
            sessionStorage.setItem('lgin',true);
            sessionStorage.setItem('lgdt',date.valueOf());
            sessionStorage.setItem('user',JSON.stringify(user));
            sessionStorage.setItem('apps',JSON.stringify(user));
        },
        destroy:function(){
            sessionStorage.setItem('lgin',null);
            sessionStorage.setItem('lgdt',null);
            sessionStorage.setItem('user',null);
            sessionStorage.setItem('apps',null);
            for(i in sessionStorage){
                delete sessionStorage[i];
            }
            document.location.href='/login/#/login';
        },
        get:function(key){
            return sessionStorage.getItem(key);
        },
        set:function(key,value){
            sessionStorage.setItem(key,value);
        },
        autorize:function(promise){
            $this = this;
            loggedin = eval(sessionStorage.getItem('lgin'));
            if(loggedin===true){
                date = new Date();
                diff = (date.valueOf() - parseInt(sessionStorage.getItem('lgdt'))) / 1000;
                if(diff <= 3600){
                    $http
                        .get('/rest/ful/session.php/status')
                        .error(function(){$this.destroy();})
                        .success(function(json){
                            if(json.result){
                                date = new Date();
                                sessionStorage.setItem('lgdt',date.valueOf());
                                promise();
                            }
                            else {
                                $this.destroy();
                            }
                        });
                }
                else {
                    $this.destroy();    
                }
            }
            else {
                $this.destroy();
            }
        }
    };
});