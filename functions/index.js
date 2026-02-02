const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.submitForm = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const userId = req.query.uid;
            if (!userId) {
                return res.status(400).json({ error: 'Missing user ID' });
            }

            // Get form data from body (supports JSON and form-urlencoded)
            let formData = req.body;
            
            // Save to Firestore
            const docRef = await admin.firestore().collection('submissions').add({
                userId: userId,
                formData: formData,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                source: req.headers.referer || 'Unknown'
            });

            // Send push notification
            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            if (userDoc.exists && userDoc.data().fcmToken) {
                const token = userDoc.data().fcmToken;
                
                // Build notification message
                let notificationBody = 'New submission received';
                if (formData.name) notificationBody = `From: ${formData.name}`;
                if (formData.email) notificationBody += ` (${formData.email})`;

                await admin.messaging().send({
                    token: token,
                    notification: {
                        title: '🔔 New Form Submission!',
                        body: notificationBody
                    },
                    data: {
                        submissionId: docRef.id
                    },
                    webpush: {
                        fcmOptions: {
                            link: '/'
                        }
                    }
                });
            }

            // Return success (for redirect-based forms)
            if (req.query.redirect) {
                return res.redirect(req.query.redirect);
            }
            
            res.status(200).json({ 
                success: true, 
                message: 'Form submitted successfully',
                id: docRef.id 
            });
            
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});