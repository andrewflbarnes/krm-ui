import { Box } from "@suid/material";
import { useKings } from "../kings";

export default function Portal() {
  const [{ key: league }] = useKings()

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100% + 2rem)",
      margin: "-1rem",
      border: 0,
    }}>
      <iframe style={{ height: "100%" }} src={`https://www.kingsski.club/${league()}`} title={`Kings Ski Club ${league()} results`} />
    </Box>
  )
}

