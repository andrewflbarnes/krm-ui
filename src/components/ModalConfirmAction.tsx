import { Button, Card, CardActions, CardContent, Modal, Typography } from "@suid/material";
import { ParentProps } from "solid-js";

type ModalConfirmActionProps = {
  open: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  discardLabel?: string;
}
export default function ModalConfirmAction(props: ParentProps<ModalConfirmActionProps>) {
  return (
    <Modal
      open={props.open}
      sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}
    >
      <Card>
        <CardContent>
          <Typography>
            {props.children}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={props.onConfirm}>
            {props.confirmLabel || "Yes"}
          </Button>
          <Button onClick={props.onDiscard}>
            {props.discardLabel || "No"}
          </Button>
        </CardActions>
      </Card>
    </Modal>
  )
}
