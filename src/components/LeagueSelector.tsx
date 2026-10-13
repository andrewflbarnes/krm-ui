import { useKings } from "../hooks/kings";
import { leagues, leagueConfigs } from "../kings";
import { type League } from "../kings";
import Selector from "../ui/Selector";

export default function LeagueSelector() {
  const [k, { setLeague }] = useKings()
  const handleClose = (league?: League) => {
    if (league && !k.lock()) {
      setLeague(league)
    }
  };

  const options = leagues.map((l) => ({ label: leagueConfigs[l].name, value: l }))

  return (
    <div>
      <Selector
        type="input"
        current={k.league()}
        onClose={handleClose}
        locked={k.lock()}
        options={options}
      />
    </div>
  );
}
