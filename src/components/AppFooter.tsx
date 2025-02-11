import { Typography } from "@suid/material";
import { ClerkLoaded, SignedIn, useUser } from "clerk-solidjs";

export default function AppFooter() {
  const { user } = useUser()
  return (
    <footer style={{ display: "flex", "flex-direction": "row", padding: "0 1em" }}>
      <div>
        <Typography variant="subtitle2">
          Version: {__KRMUI_VERSION__}
        </Typography>
      </div>
      <div style={{ "margin-left": "auto" }}>
        <ClerkLoaded>
          <SignedIn>
            <Typography variant="subtitle2">
              {user().username}
            </Typography>
          </SignedIn>
        </ClerkLoaded>
      </div>
    </footer>
  )
}
