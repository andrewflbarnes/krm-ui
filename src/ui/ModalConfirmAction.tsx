import { Button, Card, CardActions, CardContent, Modal, Typography } from "@suid/material";
import { ParentProps } from "solid-js";

type ModalConfirmActionProps = {
  open: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
  confirmVariant?: "text" | "outlined" | "contained";
  confirmColor?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
  discardLabel?: string;
  onDiscard: () => void;
  discardVariant?: "text" | "outlined" | "contained";
  discardColor?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
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
          <Button
            onClick={props.onConfirm}
            variant={props.confirmVariant || "text"}
            color={props.confirmColor || "primary"}
          >
            {props.confirmLabel || "Yes"}
          </Button>
          <Button
            onClick={props.onDiscard}
            variant={props.discardVariant || "text"}
            color={props.discardColor || "primary"}
          >
            {props.discardLabel || "No"}
          </Button>
        </CardActions>
      </Card>
    </Modal>
  )
}
