const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios')

const TELEGRAM_BOT_TOKEN = functions.config().telegram.token;
const CHAT_ID = functions.config().telegram.chat_id;

// Initialize the Firebase Admin SDK
admin.initializeApp();

exports.sendTelegramNotification = functions.firestore
    .document('borangKesengsaraan/{docId}')
    .onCreate(async (snap, context) => {
        // Log a message to the Firebase console for debugging
        console.log('New document created, attempting to send Telegram notification...');
        
        // Retrieve the data from the newly created document
        const newData = snap.data();
        const docId = context.params.docId;

        // Construct the message text using data from the new document
        const messageText = `📢 *Borang Baru Diterima!* 📢
        
        *ID Dokumen:* ${docId}
        *Nama:* ${newData.name}
        *Tarikh Lahir:* ${newData.birthday}
        *E-mel:* ${newData.email}
        *Nombor Telefon:* ${newData.phone}
        *Masa Pendaftaran:* ${newData.time}
        *Komen:* ${newData.comment || "Tiada komen"}
        
        Sila semak pangkalan data untuk maklumat lanjut.`;

        // The Telegram Bot API URL for the sendMessage method
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            // Make the HTTP POST request to the Telegram API
            await axios.post(url, {
                chat_id: CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown' // Use Markdown to format the message
            });
            console.log('Telegram notification sent successfully!');
        } catch (error) {
            // Log any errors that occur during the API call
            console.error('Error sending Telegram notification:', error.response.data);
            // You can return the error here to make it visible in the Firebase logs
            return Promise.reject(error);
        }

        // Return a successful promise
        return null;
    });