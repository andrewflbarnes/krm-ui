import { Box } from "@suid/material"
import ManageNewSelect from "./ManageNewSelect"
import { ClubSeeding, Division } from "../kings"
import ManageNewDetail, { Details } from "./ManageNewDetail"

type ComponentProps = {
  details: Details;
  onDetailUpdate: (details: Details) => void;
  config: ClubSeeding;
  onUpdate: (club: string, division: Division, num: number) => void;
  onErrorUpdate?: (errors: string[]) => void;
}

export default function ManageNewSetup(props: ComponentProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        width: "100%",
        alignItems: "start",
      }}
    >

      <ManageNewDetail
        details={props.details}
        onDetailUpdate={props.onDetailUpdate}
      />

      <ManageNewSelect
        config={props.config}
        onUpdate={props.onUpdate}
        onErrorUpdate={props.onErrorUpdate}
      />
    </Box>
  )
}
