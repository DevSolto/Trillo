"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type Notification = {
  type: "success" | "error"
  title?: string
  message: string
}

type NotifyFn = (n: Notification) => void

const NotificationContext = createContext<NotifyFn | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null)

  const notify = useCallback<NotifyFn>((n) => {
    setNotification(n)
    setTimeout(() => setNotification(null), 3000)
  }, [])

  return (
    <NotificationContext.Provider value={notify}>
      {notification && (
        <div className="fixed top-4 right-4 z-50 w-80">
          <Alert variant={notification.type === "error" ? "destructive" : "success"}>
            {notification.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider")
  return ctx
}
