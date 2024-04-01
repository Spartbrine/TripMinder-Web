importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyAJubosy8ur6VbfKcRaiLgwZXftkHnRfig",
    authDomain: "cecytec.firebaseapp.com",
    databaseURL: "https://cecytec.firebaseio.com",
    storageBucket: "cecytec.appspot.com",
    projectId: "cecytec",
    messagingSenderId: "456357382880",
    appId: "1:456357382880:web:abefa7775087eb38c39e85",
    measurementId: "G-CD58BJGZKP"
});

const messaging = firebase.messaging();

console.log("Servicio registrado...");
messaging.usePublicVapidKey("BFOWHQK3fwjQZ5LG4OrkfGWe5YaMfhzCwCTtwUJC67ACWnyWOG1l0I_o6shY0r2_kJ63v4dYSvUsqmoMBZnNalQ");
messaging.setBackgroundMessageHandler(payload => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    if (payload) {
        let title = 'Mensaje en segundo plano';
        const options = {
            body: payload.data.message,
            icon: '/favicon.ico',
            requireInteraction: true,
            actions: [{
                action: 'refresh-messages',
                title: 'Ver mensajes',
                icon: '/assets/img/document-icon.png'
            }]
        };

        return self.registration.showNotification(title, options);
    }
});