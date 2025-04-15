import { Button, CardActions, CardContent, CardHeader, Typography } from "@suid/material";
import { useQuery } from "@tanstack/solid-query";
import { doc, getDoc } from "firebase/firestore";
import { Match, Switch } from "solid-js";
import { RoundInfo } from "../api/krm";
import { db } from "../firebase";
import KingsModal from "./KingsModal";

type ModalRoundInfoProps = {
  open: boolean;
  round: RoundInfo;
  onClose: () => void;
}

export default function ModalRoundInfo(props: ModalRoundInfoProps) {
  const ownerId = () => props.round?.owner
  const user = useQuery(() => ({
    queryKey: ["user", ownerId()],
    queryFn: async () => {
      const userRef = doc(db, "users", props.round.owner)
      const user = await getDoc(userRef)
      if (user.exists()) {
        return user.data()
      }
      return {
        fullName: "Unknown",
        username: "Unknown",
      }
    },
    enabled: !!ownerId() && ownerId() !== "local",
    staleTime: 1000 * 60,
    retry: 3,
  }))

  return (
    <KingsModal
      open={props.open}
      onClose={props.onClose}
    >
      <CardHeader title="Round information" subheader={props.round.status} />
      <CardContent>
        <Typography>
          <p>
            Venue: {props.round.venue}
          </p>
          <p>
            Description: {props.round.description}
          </p>
          <p>
            Mixed: {props.round.teams.mixed.length}
          </p>
          <p>
            Ladies: {props.round.teams.ladies.length}
          </p>
          <p>
            Board: {props.round.teams.board.length}
          </p>
          <p>
            Owner:&nbsp;
            <Switch fallback={"Unable to load user"}>
              <Match when={ownerId() === "local"}>
                Local user (you)
              </Match>
              <Match when={user.isPending}>
                Loading user info...
              </Match>
              <Match when={user.data}>
                {user.data.username} ({user.data.fullName})
              </Match>
            </Switch>
          </p>
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={props.onClose}
        >
          Close
        </Button>
      </CardActions>
    </KingsModal>
  )
}
