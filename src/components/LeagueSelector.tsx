import { useKings } from "../kings";
import kings, { leagues, type League } from "../kings";
import Selector from "../ui/Selector";

export default function LeagueSelector() {
  const [k, { setLeague }] = useKings()
  const handleClose = (league?: League) => {
    if (league && !k.lock()) {
      setLeague(league)
    }
  };

  const options = leagues.map((l) => ({ label: kings[l].name, value: l }))

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
