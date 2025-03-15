import { A, useLocation } from "@solidjs/router";
import { AccountCircle } from "@suid/icons-material";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@suid/material";
import { ClerkLoaded, SignedIn, SignedOut, SignInButton, UserButton } from "clerk-solidjs";
import { createMemo, ParentProps } from "solid-js";
import KrmBreadcrumbs from "./Breadcrumbs";
import LeagueSelector from "./LeagueSelector";

function Link(props: ParentProps<{ href: string }>) {
  const location = useLocation()
  const search = createMemo(() => {
    return location.search
  })
  return (
    <A
      style={{
        color: "inherit",
        "text-decoration": "inherit",
      }}
      href={props.href + search()}
    >
      <Typography>
        {props.children}
      </Typography>
    </A>
  )
}

export default function KrmAppBar() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="relative">
          <Toolbar>
            <Box
              as={"nav"}
              style={{
                display: "grid",
                width: "100%",
              }}
              sx={{
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                }
              }}
            >
              <Box sx={{ gap: "1em", display: "flex", alignItems: "center" }}>
                <Link href="/">
                  <strong>[ K ]</strong>
                </Link>
                <LeagueSelector />
              </Box>
              <Box sx={{
                alignItems: "center",
                display: { xs: "none", md: "flex" },
              }}>
                <KrmBreadcrumbs />
              </Box>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                justifyContent: "flex-end",
                alignItems: "center",
              }}>
                <Link href="/manage/continue">
                  Race
                </Link>
                <Link href="/teams">
                  Teams
                </Link>
                <Box
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  <Link href="/tracker">
                    Tracker
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  <Link href="/portal">
                    Portal
                  </Link>
                </Box>
                <ClerkLoaded>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton style={{ color: "inherit", cursor: "pointer", background: "transparent", border: "none" }} mode="modal">
                      <div>
                        <Typography sx={{
                          display: { xs: "none", sm: "flex" },
                        }} >
                          Sign In
                        </Typography>
                        <AccountCircle sx={{
                          display: { xs: "block", sm: "none" },
                        }} />
                      </div>
                    </SignInButton>
                  </SignedOut>
                </ClerkLoaded>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

