import CustomRoundStage from "../components/CustomRoundStage";

export default function CreateRoundConfig() {
  return (
    <div style={{ display: "flex", "align-items": "center", "flex-direction": "column" }}>
      <div style={{ margin: "0 auto" }}>
        <CustomRoundStage
          onConfigUpdated={() => { }}
        />
      </div>
    </div>
  )
}
