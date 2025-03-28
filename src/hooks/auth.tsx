import { ClerkProvider, useAuth as useClerkAuth, useUser } from "clerk-solidjs"
import { signInWithCustomToken, signOut, User } from "firebase/auth"
import { Accessor, batch, createComputed, createContext, createMemo, createSignal, ParentProps, useContext } from "solid-js"
import { auth, db } from "../firebase"
import notification from "./notification"
import { dark } from "@clerk/themes";
import { doc, setDoc } from "firebase/firestore"

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const AuthContext = createContext<{
  userId: Accessor<string>;
  username: Accessor<string>;
  fullName: Accessor<string>;
  firstName: Accessor<string>;
  lastName: Accessor<string>;
  roles: Accessor<string[]>;
  authenticated: Accessor<boolean>;
}>({
  userId: () => "",
  username: () => "",
  fullName: () => "",
  firstName: () => "",
  lastName: () => "",
  roles: () => [],
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
  const { user, isSignedIn } = useUser()
  const username = createMemo(() => user()?.username)
  const fullName = createMemo(() => user()?.fullName)
  const firstName = createMemo(() => user()?.firstName)
  const lastName = createMemo(() => user()?.lastName)
  const roles = createMemo<string[]>(() => user()?.publicMetadata?.roles as string[] || [])
  const { userId, getToken } = useClerkAuth()
  const [fbUser, setFbUser] = createSignal<User>()
  const [authLock, setAuthLock] = createSignal(false)
  const [authenticated, setAuthenticated] = createSignal(false)

  createComputed((saved) => {
    if (!isSignedIn() || !authenticated()) {
      return saved
    }
    const userinfo = {
      owner: userId(),
      username: username(),
      fullName: fullName(),
      firstName: firstName(),
      lastName: lastName(),
      roles: roles(),
    }
    const serialised = JSON.stringify(userinfo)
    const update = !saved || (saved && saved != serialised)
    if (update && authenticated()) {
      const ref = doc(db, "users", userId())
      setDoc(ref, userinfo)
      console.log("saved", saved, username(), userId())
      return serialised
    }
    return saved
  }, false)

  createComputed(() => {
    if (!isSignedIn()) {
      batch(() => {
        setFbUser(undefined)
        signOut(auth)
        setAuthLock(false)
        setAuthenticated(false)
      })
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

  return <AuthContext.Provider value={{ userId, username, authenticated, fullName, firstName, lastName, roles }}>
    {props.children}
  </AuthContext.Provider>
}
