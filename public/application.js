window.dhx4.application = {
    init: function() {
        window.dhx4.application.mdi = new dhtmlXLayoutObject('dhx4AppContainer', '1C', 'dhx_skyblue');
        window.dhx4.application.mdi.cells('a').setText('');

        window.dhx4.application.menu = window.dhx4.application.mdi.attachMenu();
        window.dhx4.application.menu.setIconsPath('/imgcdn/icons/');
        window.dhx4.application.menu.addNewSibling(null, 'archivo', 'Archivo', false, 'application-blue.png', 'application-blue.png');
        window.dhx4.application.menu.addNewChild('archivo', 0, 'applications', 'Cambiar de aplicación', false, 'applications-blue.png', 'applications-blue.png');
        window.dhx4.application.menu.addNewChild('archivo', 1, 'logout', 'Salir de la aplicación', false, 'cross-button.png', 'cross-button.png');
        window.dhx4.application.menu.addNewChild('archivo', 2, 'formnewuser', 'Registrarse en el sistema', false, 'user-silhouette-question.png', 'user-silhouette-question.png');
        window.dhx4.application.menu.addNewChild('archivo', 3, 'formreturntohome', 'Volver a la pagina web principal', false, 'home--arrow.png', 'home--arrow.png');
        window.dhx4.application.menu.addNewChild('archivo', 4, 'formabout', 'Información de...', false, 'information-button.png', 'information-button.png');
        window.dhx4.application.menu.attachEvent('onclick', window.dhx4.application.handlers.events);

        window.windows = new dhtmlXWindows();
        uri = document.location || window.location;
        if (uri.href.indexOf('/login/#/applications') >= 1) window.dhx4.application.handlers.formApplications();
        else if (uri.href.indexOf('/login/#/logout') >= 1) window.dhx4.application.handlers.formLogout();
        else {
            sessionStorage.setItem('lgin', null);
            sessionStorage.setItem('lgdt', null);
            sessionStorage.setItem('user', null);
            sessionStorage.setItem('apps', null);
            for (i in sessionStorage) delete sessionStorage[i];
            window.dhx4.application.handlers.formLogin();
        }
        caches.open('v1').then(function(cache) {
            cache.delete('*.*').then(function(response) {
                someUIUpdateFunction();
            });
        });
    },

    // Manejadores de eventos.
    handlers: {
        events: function(event) {
            if (event.indexOf('FromModule') >= 1) window.dhx4.application.moduleHandlers[event]();
            else {
                if (event === 'formlogin') window.dhx4.application.handlers.formLogin();
                if (event === 'formnewuser') window.dhx4.application.handlers.formNewUser();
                if (event === 'formreturntohome') window.dhx4.application.handlers.formReturnToHome();
                if (event === 'formabout') window.dhx4.application.handlers.formAbout();
                if (event === 'applications') window.dhx4.application.handlers.formApplications();
                if (event === 'logout') window.dhx4.application.handlers.formLogout();
            }
        },
        resetApllication: function() {
            window.dhx4.application.mdi.cells('a').setText('');
            window.dhx4.application.mdi.cells('a').detachMenu();
            window.dhx4.application.mdi.cells('a').detachToolbar();
            window.dhx4.application.mdi.cells('a').detachStatusBar();
            window.dhx4.application.mdi.cells('a').detachRibbon();
            window.dhx4.application.mdi.cells('a').detachObject(true);
            window.dhx4.application.menu.forEachItem(function(itemid) {
                if (itemid.indexOf('FromModule') >= 1) window.dhx4.application.menu.removeItem(itemid);
            });
            window.dhx4.application.moduleHandlers = null;
            window.dhx4.application.moduleHandlers = {};
        },
        formLogin: function() {
            win = window.windows.createWindow('win', 0, 0, 320, 150);
            win.setText('Ingresar al sistema');
            win.setModal(true);
            win.centerOnScreen();
            win.denyResize();
            win.denyMove();
            win.button('help').hide();
            win.button('stick').hide();
            win.button('park').hide();
            win.button('minmax').hide();
            win.button('close').hide();

            toolbar = win.attachToolbar();
            toolbar.setIconsPath('/imgcdn/icons/');
            toolbar.addButton('ingresar', 0, 'Ingresar', 'tick-button.png', 'tick-button.png');

            form = win.attachForm([
                { type: 'input', name: 'user', label: 'Cuil:', maxLength: 13, labelWidth: 80, inputWidth: 210, required: true },
                { type: 'password', name: 'pass', label: 'Password:', maxLength: 20, labelWidth: 80, inputWidth: 210, required: true },
            ]);
            form.enableLiveValidation(true);
            form.setFocusOnFirstActive();
            form.attachEvent("onEnter", function() {
                if (form.validate() === true) {
                    uri = '/rest/ful/session.php/login';
                    pass = CryptoJS.MD5(form.getItemValue('pass')).toString();
                    json = { user: form.getItemValue('user'), pass: pass };
                    window.dhx4.application.mdi.progressOn();
                    window.dhx4.ajax.post(uri, JSON.stringify(json), function(rta) {
                        json = JSON.parse(rta.xmlDoc.responseText);
                        if (json.result === false) dhtmlx.alert({ type: 'alert-error', title: 'Error', text: 'El cuil o la clave no son válidos.', ok: 'Aceptar' });
                        if (json.result === true) {
                            window.dhx4.session.start(json.rows);
                            window.dhx4.application.handlers.formApplications();
                        }
                        win.close();
                        window.dhx4.application.mdi.progressOff();
                    });
                } else dhtmlx.message({ title: 'Error', type: 'alert-error', text: 'Todos los campos son obligatorios.', ok: 'Aceptar' });
            });

            toolbar.attachEvent('onclick', function(event) {
                if (event === 'ingresar') {
                    if (form.validate() === true) {
                        uri = '/rest/ful/session.php/login';
                        pass = CryptoJS.MD5(form.getItemValue('pass')).toString();
                        json = { user: form.getItemValue('user'), pass: pass };
                        window.dhx4.application.mdi.progressOn();
                        window.dhx4.ajax.post(uri, JSON.stringify(json), function(rta) {
                            json = JSON.parse(rta.xmlDoc.responseText);
                            if (json.result === false) dhtmlx.alert({ type: 'alert-error', title: 'Error', text: 'El cuil o la clave no son válidos.', ok: 'Aceptar' });
                            if (json.result === true) {
                                window.dhx4.session.start(json.rows);
                                window.dhx4.application.handlers.formApplications();
                            }
                            win.close();
                            window.dhx4.application.mdi.progressOff();
                        });
                    } else dhtmlx.message({ title: 'Error', type: 'alert-error', text: 'Todos los campos son obligatorios.', ok: 'Aceptar' });
                }
            });

        },
        formLogout: function() {
            win = window.windows.createWindow('win', 0, 0, 400, 130);
            win.setText('Salir de la aplicación');
            win.setModal(true);
            win.centerOnScreen();
            win.denyResize();
            win.denyMove();
            win.button('help').hide();
            win.button('stick').hide();
            win.button('park').hide();
            win.button('minmax').hide();
            win.button('close').hide();
            win.attachURL('logout.html');

            toolbar = win.attachToolbar();
            toolbar.setIconsPath('/imgcdn/icons/');
            toolbar.addButton('aceptar', 0, 'Aceptar', 'tick-button.png', 'tick-button.png');
            toolbar.addButton('cancelar', 1, 'Cancelar', 'cross-button.png', 'cross-button.png');
            toolbar.attachEvent('onclick', function(event) {
                if (event === 'aceptar') window.dhx4.session.destroy();
                if (event === 'cancelar') win.close();
            });
        },
        formApplications: function() {

            window.dhx4.application.handlers.resetApllication();
            window.dhx4.session.autorize(function() {
                var win = window.windows.createWindow('win', 0, 0, 500, 300);
                win.setText('Aplicaciones');
                win.setModal(true);
                win.centerOnScreen();
                win.denyResize();
                win.denyMove();
                win.button('help').hide();
                win.button('stick').hide();
                win.button('park').hide();
                win.button('minmax').hide();
                win.button('close').hide();

                toolbar = win.attachToolbar();
                toolbar.setIconsPath('/imgcdn/icons/');
                toolbar.addButton('salir', 0, 'Salir', 'tick-button.png', 'tick-button.png');
                toolbar.addButton('cerrar', 1, 'Cerrar', 'cross-button.png', 'cross-button.png');
                toolbar.attachEvent('onclick', function(event) {
                    if (event === 'cerrar') win.close();
                    if (event === 'salir') {
                        win.close();
                        window.dhx4.application.handlers.formLogout();
                    }
                });


                form  = win.attachForm();
                items = [];
                apps  = JSON.parse(window.dhx4.session.get('apps'));
                for (i = 0; i < apps.length; i++) {
                    console.log(apps[i].uriname,apps[i].uriname.indexOf('webapps/'));
                    if(apps[i].uriname.indexOf('webapps/')<=0){
                        items.push({
                            type: 'button',
                            name: '/' + apps[i].uriname,
                            value: apps[i].name
                        });
                    }
                }
                form.loadStruct(items, 'json');
                form.attachEvent('onButtonClick', function(event) {
                    oldapps = ['/adminpre', '/adminparj', '/adminipp', '/adminadd', '/adminmpz', '/admindds', '/adminsdc', '/adminper', '/adminaut', '/admindip', '/admincdt'];

                    for (i = 0; i < oldapps.length; i++) {
                        if (oldapps[i] === event) {
                            location = document.location || window.location;
                            location.href = (event);
                        }
                    }

                    menu = document.createElement('script');
                    menu.src = event + '/module.menu.js';
                    menu.onload = function() {
                        events = document.createElement('script');
                        events.src = event + '/module.events.js';
                        events.onload = function() {
                            forms = document.createElement('script');
                            forms.src = event + '/module.forms.js';
                            forms.onload = function() {
                                window.dhx4.application.forms.main();
                                win.close();
                            };
                            document.body.appendChild(forms);
                        };
                        document.body.appendChild(events);
                    };
                    document.body.appendChild(menu);
                })
            });
        },
        formNewUser: function() {
            win = window.windows.createWindow('win', 0, 0, 400, 200);
            win.setText('Nuevo usuario');
            win.setModal(true);
            win.centerOnScreen();
            win.denyResize();
            win.denyMove();
            win.button('help').hide();
            win.button('stick').hide();
            win.button('park').hide();
            win.button('minmax').hide();
            win.button('close').hide();
            win.attachURL('registers.html');

            toolbar = win.attachToolbar();
            toolbar.setIconsPath('/imgcdn/icons/');
            toolbar.addButton('cerrar', 0, 'Cerrar', 'cross-button.png', 'cross-button.png');
            toolbar.attachEvent('onclick', function(event) { if (event === 'cerrar') win.close(); });
        },
        formReturnToHome: function() {
            win = window.windows.createWindow('win', 0, 0, 400, 140);
            win.setText('Retornar a la Página Principal');
            win.setModal(true);
            win.centerOnScreen();
            win.denyResize();
            win.denyMove();
            win.button('help').hide();
            win.button('stick').hide();
            win.button('park').hide();
            win.button('minmax').hide();
            win.button('close').hide();
            win.attachURL('return.html');

            toolbar = win.attachToolbar();
            toolbar.setIconsPath('/imgcdn/icons/');
            toolbar.addButton('aceptar', 0, 'Aceptar', 'tick-button.png', 'tick-button.png');
            toolbar.addButton('cancelar', 1, 'Cancelar', 'cross-button.png', 'cross-button.png');
            toolbar.attachEvent('onclick', function(event) {
                if (event === 'cancelar') win.close();
                if (event === 'aceptar') {
                    window.dhx4.application.session.destroy();
                    location = document.location || window.location;
                    location.href = '../';
                }
            });
        },
        formAbout: function() {
            win = window.windows.createWindow('win', 0, 0, 400, 200);
            win.setText('Acerca de...');
            win.setModal(true);
            win.centerOnScreen();
            win.denyResize();
            win.denyMove();
            win.button('help').hide();
            win.button('stick').hide();
            win.button('park').hide();
            win.button('minmax').hide();
            win.button('close').hide();
            win.attachURL('about.html');

            toolbar = win.attachToolbar();
            toolbar.setIconsPath('/imgcdn/icons/');
            toolbar.addButton('cerrar', 0, 'Cerrar', 'cross-button.png', 'cross-button.png');
            toolbar.attachEvent('onclick', function(event) {
                if (event === 'cerrar') win.close();
            });
        }
    },
    moduleHandlers: {}

};