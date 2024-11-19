import { Box, Button, ButtonGroup, Typography } from "@suid/material"
import { createSignal, For } from "solid-js"
import { DivisionResults as Results } from "../kings/utils"
import DivisionResults from "./DivisionResults"

export default function DivisionResultsAll(props: { results: Results, editable: boolean }) {
  const [division, setDivision] = createSignal("All")
  const results = () => Object.entries(props.results).filter(([div]) => div === division() || division() === "All")
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2em" }}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ButtonGroup>
        <For each={["All", "Mixed", "Ladies", "Board"]}>{div => (
          <Button onClick={() => setDivision(div)} variant={div == division() ? "contained" : "outlined"}>
            {div}
          </Button>
        )}</For>
      </ButtonGroup>
      </Box>
      <For each={results()}>{([division, divisionResults]) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography mb="1rem" textAlign="center" variant="h4">
              {division}
            </Typography>
            <DivisionResults results={divisionResults} />
          </Box >
        )
      }}</For>
    </Box >
  )
}
