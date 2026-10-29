import { useTheme } from "@suid/material"

export default function CellStatusIndicator(props: { complete: boolean }) {
  const theme = useTheme()
  const color = () => theme.palette.success.main
  return (
    <div
      style={{
        display: "table-cell",
        width: "0.2em",
        padding: 0,
        height: "100%",
        "background-color": props.complete ? color() : undefined
      }}
    />
  )
}
