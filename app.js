// =============================================
// CREVATE NOTIFICATIONS - DEBUG VERSION
// =============================================

console.log('========================================');
console.log('🚀 CREVATE NOTIFICATIONS STARTING...');
console.log('========================================');

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('❌ CRITICAL: Firebase is not loaded!');
    alert('Error: Firebase not loaded. Check your internet connection.');
} else {
    console.log('✅ Firebase loaded successfully');
}

// Check if db is available
if (typeof db === 'undefined') {
    console.error('❌ CRITICAL: Firestore (db) is not initialized!');
    alert('Error: Database not initialized. Check firebase-config.js');
} else {
    console.log('✅ Firestore (db) is available');
}

// User ID
let userId = localStorage.getItem('crevate_user_id');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('crevate_user_id', userId);
    console.log('🆕 Created new user ID:', userId);
} else {
    console.log('👤 Existing user ID:', userId);
}

// DOM Elements with null checks
const connectionStatus = document.getElementById('connection-status');
const enableNotifBtn = document.getElementById('enable-notifications');
const userIdDisplay = document.getElementById('user-id');
const webhookUrlDisplay = document.getElementById('webhook-url');
const copyUserIdBtn = document.getElementById('copy-userid');
const copyWebhookBtn = document.getElementById('copy-webhook');
const submissionsList = document.getElementById('submissions-list');
const testForm = document.getElementById('test-form');

// Check DOM elements
console.log('🔍 Checking DOM elements:');
console.log('  - connectionStatus:', connectionStatus ? '✓' : '❌ MISSING');
console.log('  - enableNotifBtn:', enableNotifBtn ? '✓' : '❌ MISSING');
console.log('  - userIdDisplay:', userIdDisplay ? '✓' : '❌ MISSING');
console.log('  - submissionsList:', submissionsList ? '✓' : '❌ MISSING');
console.log('  - testForm:', testForm ? '✓' : '❌ MISSING');

// Display User ID
if (userIdDisplay) {
    userIdDisplay.textContent = userId;
}
if (webhookUrlDisplay) {
    webhookUrlDisplay.textContent = `User: ${userId}`;
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message, type = 'info') {
    console.log(`🍞 Toast [${type}]: ${message}`);
    
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast show ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}

// =============================================
// ENABLE NOTIFICATIONS
// =============================================
if (enableNotifBtn) {
    enableNotifBtn.addEventListener('click', async () => {
        console.log('🔔 Notification button clicked');
        try {
            const permission = await Notification.requestPermission();
            console.log('🔔 Permission result:', permission);
            
            if (permission === 'granted') {
                enableNotifBtn.textContent = '✅ Notifications On';
                enableNotifBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                
                new Notification('🎉 Notifications Enabled!', {
                    body: 'You will now receive alerts.',
                });
                
                showToast('Notifications enabled!', 'success');
            } else {
                enableNotifBtn.textContent = '❌ Denied';
                showToast('Please allow notifications', 'error');
            }
        } catch (error) {
            console.error('❌ Notification error:', error);
            showToast('Error: ' + error.message, 'error');
        }
    });
}

// =============================================
// MAIN FUNCTION: LISTEN FOR SUBMISSIONS
// =============================================
async function listenForSubmissions() {
    console.log('========================================');
    console.log('👂 STARTING LISTENER...');
    console.log('👤 Looking for userId:', userId);
    console.log('========================================');

    try {
        // First, let's do a simple read test
        console.log('📖 Testing simple read from submissions...');
        
        const testSnapshot = await db.collection('submissions').limit(5).get();
        console.log(`📖 Total documents in submissions: ${testSnapshot.size}`);
        
        testSnapshot.forEach(doc => {
            console.log('📄 Document:', doc.id, doc.data());
        });

        // Now let's query for our user
        console.log('🔍 Querying for userId:', userId);
        
        const userSnapshot = await db.collection('submissions')
            .where('userId', '==', userId)
            .get();
        
        console.log(`🔍 Found ${userSnapshot.size} documents for this user`);

        // Display the results
        if (submissionsList) {
            submissionsList.innerHTML = '';

            if (userSnapshot.empty) {
                console.log('📭 No submissions found for this user');
                submissionsList.innerHTML = `
                    <p class="empty-state">
                        No submissions found for user: ${userId}<br>
                        Check if userId matches in Firebase.
                    </p>
                `;
            } else {
                console.log('📬 Rendering submissions...');
                
                const submissions = [];
                userSnapshot.forEach(doc => {
                    const data = doc.data();
                    console.log('📄 Submission:', doc.id, data);
                    submissions.push({ id: doc.id, ...data });
                });

                // Sort by timestamp (newest first)
                submissions.sort((a, b) => {
                    const timeA = a.timestamp?.seconds || 0;
                    const timeB = b.timestamp?.seconds || 0;
                    return timeB - timeA;
                });

                // Render each submission
                submissions.forEach(data => {
                    const item = createSubmissionItem(data);
                    submissionsList.appendChild(item);
                    console.log('✅ Rendered submission:', data.id);
                });
            }
        }

        // Update connection status
        if (connectionStatus) {
            connectionStatus.classList.add('connected');
            connectionStatus.querySelector('.text').textContent = 'Connected ✓';
        }

        // Now set up real-time listener
        console.log('👂 Setting up real-time listener...');
        
        db.collection('submissions')
            .where('userId', '==', userId)
            .onSnapshot(
                snapshot => {
                    console.log('🔄 Real-time update received!');
                    console.log(`🔄 Documents count: ${snapshot.size}`);
                    
                    if (connectionStatus) {
                        connectionStatus.classList.add('connected');
                        connectionStatus.querySelector('.text').textContent = 'Live ✓';
                    }

                    if (submissionsList) {
                        submissionsList.innerHTML = '';

                        if (snapshot.empty) {
                            submissionsList.innerHTML = `
                                <p class="empty-state">
                                    No submissions yet for user: ${userId}
                                </p>
                            `;
                            return;
                        }

                        const submissions = [];
                        snapshot.forEach(doc => {
                            submissions.push({ id: doc.id, ...doc.data() });
                        });

                        submissions.sort((a, b) => {
                            const timeA = a.timestamp?.seconds || 0;
                            const timeB = b.timestamp?.seconds || 0;
                            return timeB - timeA;
                        });

                        submissions.forEach(data => {
                            const item = createSubmissionItem(data);
                            submissionsList.appendChild(item);
                        });

                        console.log(`✅ Rendered ${submissions.length} submissions`);
                    }
                },
                error => {
                    console.error('❌ Real-time listener error:', error);
                    console.error('❌ Error code:', error.code);
                    console.error('❌ Error message:', error.message);
                    
                    if (connectionStatus) {
                        connectionStatus.classList.remove('connected');
                        connectionStatus.querySelector('.text').textContent = 'Error';
                    }
                    
                    showToast('Listener error: ' + error.message, 'error');
                }
            );

    } catch (error) {
        console.error('❌ CRITICAL ERROR in listenForSubmissions:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        
        if (connectionStatus) {
            connectionStatus.classList.remove('connected');
            connectionStatus.querySelector('.text').textContent = 'Error';
        }
        
        showToast('Database error: ' + error.message, 'error');
    }
}

// =============================================
// CREATE SUBMISSION ITEM HTML
// =============================================
function createSubmissionItem(data) {
    console.log('🎨 Creating item for:', data);
    
    const div = document.createElement('div');
    div.className = 'submission-item';

    // Format time
    let timeString = 'Just now';
    if (data.timestamp) {
        try {
            let date;
            if (data.timestamp.toDate) {
                date = data.timestamp.toDate();
            } else if (data.timestamp.seconds) {
                date = new Date(data.timestamp.seconds * 1000);
            } else {
                date = new Date(data.timestamp);
            }
            timeString = date.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.warn('⚠️ Time parsing error:', e);
            timeString = 'Recent';
        }
    }

    // Build fields HTML
    let fieldsHtml = '';
    const formData = data.formData || {};
    
    console.log('📋 Form data:', formData);
    
    if (Object.keys(formData).length === 0) {
        fieldsHtml = '<div class="field"><span class="field-name">No data</span></div>';
    } else {
        for (const [key, value] of Object.entries(formData)) {
            if (value) {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                fieldsHtml += `
                    <div class="field">
                        <span class="field-name">${label}:</span>
                        <span>${value}</span>
                    </div>
                `;
            }
        }
    }

    div.innerHTML = `
        <div class="time">📅 ${timeString}</div>
        <div class="data">${fieldsHtml}</div>
        <div style="font-size: 10px; color: #666; margin-top: 5px;">ID: ${data.id || 'unknown'}</div>
    `;

    return div;
}

// =============================================
// TEST FORM SUBMISSION
// =============================================
if (testForm) {
    testForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📤 Form submitted');

        const submitBtn = testForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Sending...';

        const name = testForm.querySelector('input[name="name"]').value.trim();
        const email = testForm.querySelector('input[name="email"]').value.trim();
        const message = testForm.querySelector('textarea[name="message"]').value.trim();

        console.log('📤 Form values:', { name, email, message });

        if (!name || !email) {
            showToast('Please fill name and email', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }

        const submissionData = {
            userId: userId,
            formData: {
                name: name,
                email: email,
                message: message || '(No message)'
            },
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            source: 'Test Form'
        };

        console.log('📤 Submission data:', submissionData);

        try {
            const docRef = await db.collection('submissions').add(submissionData);
            console.log('✅ Saved with ID:', docRef.id);
            
            showToast('✅ Submission saved!', 'success');
            testForm.reset();

            if (Notification.permission === 'granted') {
                new Notification('📬 New Submission!', {
                    body: `From: ${name}`,
                });
            }
        } catch (error) {
            console.error('❌ Submit error:', error);
            showToast('❌ Error: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// =============================================
// COPY BUTTONS
// =============================================
if (copyUserIdBtn) {
    copyUserIdBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(userId);
        copyUserIdBtn.textContent = '✓';
        setTimeout(() => copyUserIdBtn.textContent = 'Copy', 2000);
    });
}

if (copyWebhookBtn) {
    copyWebhookBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(userId);
        copyWebhookBtn.textContent = '✓';
        setTimeout(() => copyWebhookBtn.textContent = 'Copy', 2000);
    });
}

// =============================================
// CHECK NOTIFICATION PERMISSION
// =============================================
if (enableNotifBtn) {
    if (Notification.permission === 'granted') {
        enableNotifBtn.textContent = '✅ Notifications On';
        enableNotifBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    } else if (Notification.permission === 'denied') {
        enableNotifBtn.textContent = '❌ Blocked';
        enableNotifBtn.style.background = '#ef4444';
    }
}

// =============================================
// START THE APP
// =============================================
console.log('========================================');
console.log('🚀 INITIALIZING APP...');
console.log('========================================');

// Start listening
listenForSubmissions();

console.log('========================================');
console.log('✅ APP INITIALIZATION COMPLETE');
console.log('========================================');