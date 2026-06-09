import { useState, useRef, useEffect } from "react"
import { Bell, Info, CheckCircle2, AlertTriangle, AlertCircle, Check } from "lucide-react"
import { useNotifications, useMarkNotificationRead } from "../hooks/useNotifications"

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const { data: notifications = [] } = useNotifications()
  const markAsRead = useMarkNotificationRead()

  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = (id: number, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(id)
    }
  }

  const handleMarkAllRead = () => {
    notifications.filter(n => !n.is_read).forEach(n => {
      markAsRead.mutate(n.id)
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "error": return <AlertCircle className="w-5 h-5 text-red-500" />
      case "info": 
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "success": return "bg-emerald-50"
      case "warning": return "bg-amber-50"
      case "error": return "bg-red-50"
      case "info": 
      default: return "bg-blue-50"
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-400 hover:text-slate-700 transition-colors bg-white hover:bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Bell className="w-5 h-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-1 shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800">Notifikasi</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Anda memiliki {unreadCount} pesan belum dibaca</p>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Tandai semua dibaca
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Tidak ada notifikasi</p>
                <p className="text-xs text-slate-400 mt-1">Anda sudah melihat semuanya.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-4 ${
                      !notification.is_read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${getTypeBg(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${!notification.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-1.5"></span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 line-clamp-2 ${!notification.is_read ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-2">
                        {new Date(notification.created_at).toLocaleString('id-ID', {
                          weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
