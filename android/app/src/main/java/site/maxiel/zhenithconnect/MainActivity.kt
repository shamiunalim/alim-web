package site.maxiel.zhenithconnect

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth

class MainActivity : Activity() {
    private val auth by lazy { FirebaseAuth.getInstance() }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(36, 36, 36, 36)
            setBackgroundColor(0xFF071B16.toInt())
        }
        val title = TextView(this).apply {
            text = "Zhenith Connect"
            textSize = 26f
            setTextColor(0xFFE8F5EE.toInt())
            gravity = Gravity.CENTER
        }
        val info = TextView(this).apply {
            text = "Login diperlukan sebelum sinkronisasi notifikasi. Versi starter ini menyiapkan izin notifikasi; gunakan Firebase Authentication pada tahap konfigurasi."
            textSize = 15f
            setTextColor(0xFFB8D0C2.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 20, 0, 20)
        }
        val login = Button(this).apply {
            text = "Login / konfigurasi akun"
            setOnClickListener {
                Toast.makeText(this@MainActivity, "Konfigurasikan Firebase Auth; web dan APK harus memakai UID yang sama.", Toast.LENGTH_LONG).show()
            }
        }
        val permission = Button(this).apply {
            text = "Buka izin notifikasi"
            setOnClickListener { startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
        }
        val state = TextView(this).apply {
            text = if (auth.currentUser == null) "Status akun: belum login" else "Status akun: ${auth.currentUser?.uid}"
            setTextColor(0xFF7CE8AA.toInt())
            gravity = Gravity.CENTER
            setPadding(0, 16, 0, 8)
        }
        root.addView(title, ViewGroup.LayoutParams(-1, -2))
        root.addView(info, ViewGroup.LayoutParams(-1, -2))
        root.addView(login, ViewGroup.LayoutParams(-1, -2))
        root.addView(permission, ViewGroup.LayoutParams(-1, -2))
        root.addView(state, ViewGroup.LayoutParams(-1, -2))
        setContentView(root)
    }
}
