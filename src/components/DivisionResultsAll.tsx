import { Box, Button, ButtonGroup, Typography } from "@suid/material"
import { createSignal, For } from "solid-js"
import { Result, DivisionResults as Results, Division } from "../kings"
import DivisionResults from "./DivisionResults"

type Props = {
  results: Results;
  editable?: boolean;
  onEdit?: (division: string, row: Result) => void;
}

export default function DivisionResultsAll(props: Props) {
  const [division, setDivision] = createSignal<Division | "all">("all")
  const results = () => Object.entries(props.results).filter(([div]) => div === division() || division() === "all")
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2em", height: "100%" }}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <ButtonGroup>
          <For each={["all", "mixed", "ladies", "board"] as const}>{div => (
            <Button onClick={() => setDivision(div)} variant={div == division() ? "contained" : "outlined"}>
              {div}
            </Button>
          )}</For>
        </ButtonGroup>
      </Box>
      <Box overflow="auto">
        <For each={results()}>{([division, divisionResults]) => {
          const handleEdit = (row: Result) => props.onEdit?.(division, row)
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography mb="1rem" textAlign="center" variant="h4">
                {division.capitalize()}
              </Typography>
              <DivisionResults results={divisionResults} editable={props.editable} onEdit={handleEdit} />
            </Box >
          )
        }}</For>
      </Box >
    </Box >
  )
}
