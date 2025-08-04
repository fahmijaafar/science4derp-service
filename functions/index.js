// Import necessary Firebase and external libraries using ES module syntax
import { initializeApp } from 'firebase-admin/app';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import axios from 'axios';

// Initialize the Firebase Admin SDK
initializeApp();

// --- IMPORTANT: SET YOUR TELEGRAM ENVIRONMENT VARIABLES ---
// You will need to set these using the Firebase CLI:
// firebase functions:config:set telegram.token="YOUR_BOT_TOKEN"
// firebase functions:config:set telegram.chat_id="YOUR_CHAT_ID"
const TELEGRAM_BOT_TOKEN = functions.config().telegram.token;
const CHAT_ID = functions.config().telegram.chat_id;

/**
 * Cloud Function to send a Telegram notification whenever a new document is added
 * to the 'borangKesengsaraan' Firestore collection.
 */
export const sendTelegramNotification = onDocumentCreated('borangKesengsaraan/{docId}', async (event) => {
    // Log a message to the Firebase console for debugging
    console.log('New document created, attempting to send Telegram notification...');
    
    // Retrieve the data from the newly created document
    const snapshot = event.data;
    if (!snapshot) {
        console.log('No data associated with the event.');
        return;
    }
    const newData = snapshot.data();
    const docId = event.params.docId;

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
});
