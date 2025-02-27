import { ClerkProvider, useAuth as useClerkAuth } from "clerk-solidjs"
import { signInWithCustomToken, signOut, User } from "firebase/auth"
import { Accessor, createComputed, createContext, createSignal, ParentProps, useContext } from "solid-js"
import { auth } from "../firebase"
import notification from "./notification"
import { dark } from "@clerk/themes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const AuthContext = createContext<{
  userId: Accessor<string>;
  authenticated: Accessor<boolean>;
}>({
  userId: () => "",
  authenticated: () => false,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props: ParentProps) {
  return (
    <ClerkProvider publishableKey={clerkPubKey} appearance={{ baseTheme: dark }}>
      <FirebaseProvider>
        {props.children}
      </FirebaseProvider>
    </ClerkProvider>
  )
}

function FirebaseProvider(props: ParentProps) {
  const { userId, getToken } = useClerkAuth()
  const [fbUser, setFbUser] = createSignal<User>()
  const [authLock, setAuthLock] = createSignal(false)
  const [authenticated, setAuthenticated] = createSignal(false)

  createComputed(() => {
    if (!userId()) {
      setFbUser(undefined)
      signOut(auth)
      setAuthLock(false)
      setAuthenticated(false)
    }
    if (userId() && !fbUser() && !authLock()) {
      setAuthLock(true)
      const authFb = async () => {
        if (!authLock()) {
          return
        }
        let error = false
        while (true) {
          try {
            if (!userId()) {
              return
            }
            const t = await getToken({ template: "integration_firebase" })
            const { user } = await signInWithCustomToken(auth, t || '')
            setFbUser(user)
            setAuthenticated(true)
            if (error) {
              notification.success("Authenticated with backend")
            }
            setAuthLock(false)
            return
          } catch (e) {
            error = true
            console.error(e)
            notification.error("Failed to authenticate with backend")
            // TODO set backend failure signal and display
            await new Promise(r => setTimeout(r, 10000))
          }
        }
      }
      authFb()
    }
  })

  return <AuthContext.Provider value={{ userId, authenticated }}>
    {props.children}
  </AuthContext.Provider>
}
