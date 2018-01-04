angular
    .module('legapp')
    .factory('$session', function($http, $location, $rootScope) {
        return {
            start: function(user) {
                date = new Date();
                sessionStorage.setItem('lgin', true);
                sessionStorage.setItem('lgdt', date.valueOf());
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('apps', JSON.stringify(user.applications));
            },
            destroy: function() {
                sessionStorage.setItem('lgin', null);
                sessionStorage.setItem('lgdt', null);
                sessionStorage.setItem('user', null);
                sessionStorage.setItem('apps', null);
                for (i in sessionStorage) delete sessionStorage[i];

                var location = document.location || window.location;
                location.href = '/login';
            },
            get: function(key) {
                return sessionStorage.getItem(key);
            },
            set: function(key, value) {
                sessionStorage.setItem(key, value);
            },
            init: function() {
                var $this = this;

                if (sessionStorage.getItem('lgin') === 'true') {
                    var aut = false;
                    var app = $location.absUrl();
                    var apps = JSON.parse(sessionStorage.getItem('user')).applications;
                    app = app.replace('https://', '');
                    app = app.substr((app.indexOf('/') + 1));
                    if (app.indexOf('/#/')) app = app.substr(0, app.indexOf('/#/'));
                    for (i in apps)
                        if (apps[i].uriname === app) aut = true;
                    if (aut === true) $this.enableStage();
                    else $this.destroy();
                } else if ($location.path() === '/login') {
                    sessionStorage.setItem('lgin', null);
                    sessionStorage.setItem('lgdt', null);
                    sessionStorage.setItem('user', null);
                    sessionStorage.setItem('apps', null);
                    for (i in sessionStorage) delete sessionStorage[i];
                }

                var loading = document.getElementById('loading');
                loading.className = 'hidden';
            },
            enableStage: function() {
                var data = JSON.parse(sessionStorage.getItem('user'));
                $rootScope.usuario = data.usuario;
                $rootScope.stage = true;
            },
            autorize: function(promise) {
                $this = this;
                loading = document.getElementById('loading');
                loading.className = 'show';
                loggedin = eval(sessionStorage.getItem('lgin'));
                if (loggedin === true) {
                    date = new Date();
                    diff = (date.valueOf() - parseInt(sessionStorage.getItem('lgdt'))) / 1000;
                    if (diff <= 3600) {
                        $http
                            .get('/rest/ful/session.php/status')
                            .error(function() { $this.destroy(); })
                            .success(function(json) {
                                if (json.result) {
                                    date = new Date();
                                    sessionStorage.setItem('lgdt', date.valueOf());
                                    promise();
                                } else {
                                    $this.destroy();
                                }
                                loading.className = 'hidden';
                            });
                    } else {
                        $this.destroy();
                    }
                } else {
                    $this.destroy();
                }
            }
        };
    });