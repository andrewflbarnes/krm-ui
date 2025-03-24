import { Button, Card, CardActions, CardContent, CardHeader, Modal, Typography } from "@suid/material";
import { RoundInfo } from "../api/krm";
import { useAuth } from "../hooks/auth";
import KingsModal from "./KingsModal";

type ModalRoundInfoProps = {
  open: boolean;
  round: RoundInfo;
  onClose: () => void;
}

export default function ModalRoundInfo(props: ModalRoundInfoProps) {
  const { fullName, username } = useAuth()
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
            Owner: {username()} ({fullName()})
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
