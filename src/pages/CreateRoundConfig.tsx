import CustomRoundStage from "../components/CustomRoundStage";

export default function CreateRoundConfig() {
  return (
    <div style={{ display: "flex", "align-items": "center", "flex-direction": "column" }}>
      <CustomRoundStage
        onConfigUpdated={() => { }}
      />
    </div>
  )
}
