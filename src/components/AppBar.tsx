import { A, useLocation } from "@solidjs/router";
import { AccountCircle, Code, DownhillSkiing, Group, Home, Menu, Tune } from "@suid/icons-material";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@suid/material";
import { ClerkLoaded, SignedIn, SignedOut, SignInButton, UserButton } from "clerk-solidjs";
import { createMemo, createSignal, For, JSX, ParentProps, Show } from "solid-js";
import { useFeatureFlags } from "../hooks/flags";
import LeagueSelector from "./LeagueSelector";
import { useAuth } from "../hooks/auth";

type NavItem = { name: string; href: string; icon: JSX.Element }

const drawerIconSize = "2.5rem"

function Link(props: ParentProps<{ href: string }>) {
  const location = useLocation()
  const search = createMemo(() => {
    return location.search
  })
  return (
    <A
      style={{
        color: "inherit",
        "text-decoration": "none",
      }}
      href={props.href + search()}
    >
      <Typography fontWeight={500}>
        {props.children}
      </Typography>
    </A>
  )
}

function DrawerLink(props: ParentProps<{
  href: string;
  onClick: () => void;
  icon: JSX.Element;
}>) {
  const location = useLocation()
  const search = createMemo(() => location.search)
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={A}
        href={props.href + search()}
        onClick={props.onClick}
        style={{
          color: "inherit",
          "text-decoration": "none",
        }}
      >
        <ListItemIcon>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: drawerIconSize,
          }}>
            {props.icon}
          </Box>
        </ListItemIcon>
        <ListItemText primary={props.children} />
      </ListItemButton>
    </ListItem>
  )
}

function DrawerHeader() {
  const auth = useAuth()
  return (
    <>
      <ListItem>
        <ListItemText primary={(
          <>
            <strong>[ K ]</strong>
            &nbsp;
            Kings Race Manager
          </>
        )} />
      </ListItem>
      <Show when={auth.authenticated()}>
        <ListItem>
          <ListItemAvatar style={{ "pointer-events": "none" }}>
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: drawerIconSize,
                  height: drawerIconSize,
                },
                userButtonAvatarImage: {
                  width: drawerIconSize,
                  height: drawerIconSize,
                },
              }
            }} />
          </ListItemAvatar>
          <ListItemText
            primary={auth.fullName()}
            secondary={auth.username()}
          />
        </ListItem>
      </Show>
    </>
  )
}

function ClerkMenuItem() {
  return (
    <ClerkLoaded>
      <SignedIn>
        <UserButton
          aria-label="Account details"
        />
      </SignedIn>
      <SignedOut>
        <SignInButton
          style={{
            color: "inherit",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: 0,
          }}
          mode="modal"
          aria-label="Sign in to your account"
        >
          <Box>
            <Typography
              sx={{
                display: { xs: "none", sm: "flex" },
              }}
              noWrap
              fontWeight={500}
            >
              Sign In
            </Typography>
            <AccountCircle sx={{
              display: { xs: "block", sm: "none" },
            }} />
          </Box>
        </SignInButton>
      </SignedOut>
    </ClerkLoaded>
  )
}

export default function KrmAppBar() {
  const { developer } = useFeatureFlags()
  const [drawerOpen, setDrawerOpen] = createSignal(false)

  const navConfig: (NavItem & { devOnly?: true })[] = [
    { name: "Dev", href: "/dev", icon: <Code />, devOnly: true },
    { name: "Race", href: "/races", icon: <DownhillSkiing /> },
    { name: "Teams", href: "/teams", icon: <Group /> },
    { name: "Config", href: "/config", icon: <Tune /> },
  ]
  const navs = createMemo(() => navConfig.filter(nav => !nav.devOnly || developer()))

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="relative">
          <Toolbar>
            <Box
              as={"nav"}
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                }
              }}
            >
              <Box sx={{ gap: "1em", display: "flex", alignItems: "center" }}>
                <IconButton
                  color="inherit"
                  aria-label="open navigation menu"
                  edge="start"
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    padding: 0,
                    ml: 1,
                  }}
                >
                  <Menu />
                </IconButton>
                <Link href="/">
                  <strong style={{ "white-space": "nowrap" }}>[ K ]</strong>
                </Link>
                <LeagueSelector />
              </Box>
              <Box sx={{
                alignItems: "center",
                display: { xs: "none", md: "flex" },
              }}>
              {/*
                Don't really like how this workss and renders
                <KrmBreadcrumbs />
              */}
              </Box>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                justifyContent: "flex-end",
                alignItems: "center",
              }}>
                <Box sx={{ display: { xs: "none", sm: "flex" }, gap: "1rem", alignItems: "center" }}>
                  <For each={navs()}>{(nav) => (
                    <Link href={nav.href}>
                      {nav.name}
                    </Link>
                  )}</For>
                </Box>
                <ClerkMenuItem />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        anchor="left"
        open={drawerOpen()}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <DrawerHeader />
            <Divider />
            <DrawerLink
              href="/"
              onClick={() => setDrawerOpen(false)}
              icon={<Home />}
            >
              Home
            </DrawerLink>
            <For each={navs()}>{(nav) => (
              <DrawerLink
                href={nav.href}
                onClick={() => setDrawerOpen(false)}
                icon={nav.icon}
              >
                {nav.name}
              </DrawerLink>
            )}</For>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
