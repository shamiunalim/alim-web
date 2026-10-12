package site.maxiel.zhenithconnect

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue

/**
 * Only reads WhatsApp Messenger notifications after the device owner grants
 * Notification Access. It does not read WhatsApp's private database or media.
 *
 * IMPORTANT: A production build should add a visible in-app opt-in toggle,
 * retention controls, deduplication and error handling before enabling sync.
 */
class WhatsAppNotificationListener : NotificationListenerService() {
    private val tag = "ZhenithNotification"
    private val auth by lazy { FirebaseAuth.getInstance() }
    private val db by lazy { FirebaseFirestore.getInstance() }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (sbn.packageName != "com.whatsapp") return
        val user = auth.currentUser ?: run {
            Log.i(tag, "Not syncing WhatsApp notification: no signed-in Firebase user")
            return
        }

        val extras = sbn.notification.extras ?: return
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty()
        val text = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()
            ?: extras.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty()
        if (title.isBlank() && text.isBlank()) return

        // This is an explicit data transfer to the user's own Firestore account.
        // For production, add an opt-in toggle and stronger deduplication/retention.
        val data = hashMapOf(
            "packageName" to "com.whatsapp",
            "title" to title.take(300),
            "text" to text.take(4000),
            "postedAt" to sbn.postTime,
            "createdAt" to FieldValue.serverTimestamp()
        )
        db.collection("users").document(user.uid).collection("notifications")
            .add(data)
            .addOnFailureListener { e -> Log.e(tag, "Notification sync failed", e) }
    }
}
