import { useNotifications, useMarkNotificationRead } from "../../hooks/useNotifications"
import { Bell, Check, Info, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react"

export function AdminNotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkNotificationRead()

  const handleMarkAllRead = () => {
    if (notifications) {
      notifications.filter(n => !n.is_read).forEach(n => {
        markAsRead.mutate(n.id)
      })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100"><CheckCircle2 className="w-5 h-5"/></div>
      case "warning": return <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100"><AlertTriangle className="w-5 h-5"/></div>
      case "error": return <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 border border-rose-100"><XCircle className="w-5 h-5"/></div>
      default: return <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100"><Info className="w-5 h-5"/></div>
    }
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pusat Notifikasi</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau aktivitas sistem, peringatan tagihan, dan tiket baru.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Check className="w-4 h-4" /> 
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-sm font-medium">Memuat notifikasi...</p>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors hover:bg-slate-50 ${!notif.is_read ? 'bg-slate-50/50' : ''}`}
              >
                <div className="flex gap-4">
                  {getIcon(notif.type)}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-bold ${!notif.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 max-w-3xl ${!notif.is_read ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                       {new Date(notif.created_at).toLocaleDateString("id-ID", { 
                          weekday: "short", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" 
                       })} WIB
                    </p>
                  </div>
                </div>

                {!notif.is_read && (
                  <button 
                    onClick={() => markAsRead.mutate(notif.id)}
                    disabled={markAsRead.isPending}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Tandai Dibaca
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
             <Bell className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada notifikasi</h3>
          <p className="text-sm text-slate-500 max-w-[300px]">Pemberitahuan aktivitas penting seperti tiket baru atau laporan tagihan akan muncul di sini.</p>
        </div>
      )}
    </div>
  )
}
