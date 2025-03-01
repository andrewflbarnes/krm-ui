import { Button, Card, CardActions, CardContent, CardHeader, Modal, Typography } from "@suid/material";
import { RoundInfo } from "../api/krm";
import { useAuth } from "../hooks/auth";

type ModalRoundInfoProps = {
  open: boolean;
  round: RoundInfo;
  onClose: () => void;
}

export default function ModalRoundInfo(props: ModalRoundInfoProps) {
  const { fullName, username } = useAuth()
  return (
    <Modal
      open={props.open}
      sx={{ display: "grid", placeItems: "center" }}
      onClose={props.onClose}
    >
      <Card>
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
      </Card>
    </Modal>
  )
}
