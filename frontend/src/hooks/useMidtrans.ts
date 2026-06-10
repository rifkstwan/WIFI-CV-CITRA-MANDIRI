import { useEffect, useState } from "react"
import api from "../services/api"

type PublicSettings = {
  midtrans_client_key?: string
  midtrans_is_production?: string
}

export function useMidtrans() {
  const [settings, setSettings] = useState<PublicSettings | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // 1. Fetch public settings
    api.get("/settings/public")
      .then(res => {
        setSettings(res.data.data)
      })
      .catch(err => {
        console.error("Failed to load public settings", err)
      })
  }, [])

  useEffect(() => {
    // 2. Load Snap.js script when settings are ready
    if (!settings) return

    const clientKey = settings.midtrans_client_key || import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-XXXX"
    const isProduction = settings.midtrans_is_production === 'true'
    
    const scriptUrl = isProduction 
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js"

    // Check if script already exists
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      setIsReady(true)
      return
    }

    const script = document.createElement("script")
    script.src = scriptUrl
    script.setAttribute("data-client-key", clientKey)
    script.onload = () => {
      setIsReady(true)
    }

    document.head.appendChild(script)

    return () => {
      // Optional: Cleanup script if component unmounts, but usually we keep snap.js loaded
    }
  }, [settings])

  return { isReady }
}
