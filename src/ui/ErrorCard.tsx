import { Error as ErrorIcon, ExpandLess, ExpandMore } from "@suid/icons-material"
import { Box, Button, Card, CardContent, Typography } from "@suid/material"
import { createSignal, Show } from "solid-js"

export default function ErrorCard(props: { error: Error }) {
  const [expanded, setExpanded] = createSignal(false)
  const copyStack = () => {
    navigator.clipboard.writeText(props.error.stack ?? `${props.error.name}: ${props.error.message}`)
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 8 }}>
      <Card sx={{ maxWidth: 520, width: "100%" }}>
        <CardContent sx={{ py: 5, px: 4, textAlign: "center" }}>
          <ErrorIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>Something went wrong</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please reload or contact the maintainer.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: expanded() ? 2 : 0 }}>
            <Button variant="outlined" size="small" onClick={copyStack}>
              Copy stack trace
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => setExpanded(v => !v)}
              endIcon={expanded() ? <ExpandLess /> : <ExpandMore />}
            >
              {expanded() ? "Hide details" : "Show details"}
            </Button>
          </Box>
          <Show when={expanded()}>
            <Box
              sx={{
                bgcolor: "action.hover",
                borderRadius: 1,
                p: 2,
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              <Typography variant="body2" color="error.main" sx={{ fontFamily: "monospace", fontWeight: "bold", mb: 0.5 }}>
                {props.error.name}: {props.error.message}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="pre"
                sx={{ fontFamily: "monospace", fontSize: "0.75rem", m: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {props.error.stack?.replace(`${props.error.name}: ${props.error.message}\n`, "")}
              </Typography>
            </Box>
          </Show>
        </CardContent>
      </Card>
    </Box>
  )
}
