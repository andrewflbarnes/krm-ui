import { A, useLocation } from "@solidjs/router";
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
            {/**
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            */}
            <nav style={{
              display: "flex",
              "flex-grow": 1,
              "flex-direction": "row",
              "justify-content": "center"
            }}>
              <Box sx={{ flexBasis: 0, flexGrow: 1, gap: "1em", display: "flex", flex: "row", alignItems: "center" }}>
                <Link href="/">
                  <strong>[ K ]</strong>
                </Link>
                <LeagueSelector />
              </Box>
              <Box sx={{ alignItems: "center", display: "flex" }}>
                <KrmBreadcrumbs />
              </Box>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                flexBasis: 0,
                flexGrow: 1,
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
                <Link href="/tracker">
                  Tracker
                </Link>
                <Link href="/portal">
                  Portal
                </Link>
                <ClerkLoaded>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton style={{ color: "inherit", cursor: "pointer", background: "transparent", border: "none" }} mode="modal">
                      <Typography >
                        Sign In
                      </Typography>
                    </SignInButton>
                  </SignedOut>
                </ClerkLoaded>
              </Box>
            </nav>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

