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
        type="menu"
        current={k.config().name}
        onClose={handleClose}
        disabled={k.lock()}
        options={options}
      />
    </div>
  );
}
