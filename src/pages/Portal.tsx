import { Box } from "@suid/material";
import { createEffect, createSignal } from "solid-js";

type PortalProps = {
  league?: string;
}

export default function Portal({ league = "western" }: PortalProps) {
  const [ref, setRef] = createSignal<HTMLIFrameElement>();

  createEffect(() => {
    ref().contentWindow.document.getElementById("header").remove();
    })

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100% + 2rem)",
      margin: "-1rem",
      border: 0,
    }}>
      <iframe ref={setRef} style={{ height: "100%" }} src={`https://www.kingsski.club/${league}`} title={`Kings Ski Club ${league} results`} />
    </Box>
  )
}

