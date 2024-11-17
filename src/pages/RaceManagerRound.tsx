import { useLocation } from "@solidjs/router";
import { Typography } from "@suid/material";
import { useBreadcrumberUpdate } from "../hooks/breadcrumb";

export default function RaceManager() {
  const l = useLocation()
  const breadcrumb = () => {
    const atoms = l.pathname.split("/")
    return atoms[atoms.length - 1]
  }
  useBreadcrumberUpdate(breadcrumb())
  return (
    <div>
      <Typography variant="h3">{l.pathname}</Typography>
    </div>
  )
}

