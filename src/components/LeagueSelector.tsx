import { useKings } from "../hooks/kings";
import { leagues, leagueConfigs } from "../kings";
import { type League } from "../kings";
import Selector from "../ui/Selector";

export default function LeagueSelector(props: { fullWidth?: boolean }) {
  const [k, { setLeague }] = useKings()
  const handleClose = (league?: League) => {
    if (league && !k.lock()) {
      setLeague(league)
    }
  };

  const options = leagues.map((l) => ({ label: leagueConfigs[l].name, value: l }))

  return (
    <div style={{ width: props.fullWidth ? "100%" : "auto" }}>
      <Selector
        type="input"
        fullWidth={props.fullWidth}
        current={k.league()}
        onClose={handleClose}
        locked={k.lock()}
        options={options}
      />
    </div>
  );
}
