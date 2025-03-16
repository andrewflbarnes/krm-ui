import { Button, Card, CardActions, CardContent, Modal, TextField, Typography } from "@suid/material";
import { createSignal, ParentProps, Show } from "solid-js";

type ModalConfirmActionProps = {
  open: boolean;
  confirmLabel?: string;
  onConfirm: () => void;
  confirmVariant?: "text" | "outlined" | "contained";
  confirmColor?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
  confirmText?: string;
  discardLabel?: string;
  onDiscard: () => void;
  discardVariant?: "text" | "outlined" | "contained";
  discardColor?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
}
export default function ModalConfirmAction(props: ParentProps<ModalConfirmActionProps>) {
  const [confirmText, setConfirmText] = createSignal()
  const canConfirm = () => !props.confirmText || confirmText() == props.confirmText || confirmText() == `"${props.confirmText}"`
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
          <Show when={props.confirmText}>
            <br />
            <Typography>
              Type "{props.confirmText}" to confirm:
            </Typography>
            <TextField
              size="small"
              color="error"
              value={confirmText()}
              onChange={(_, v) => setConfirmText(v)}
            />
            <Show when={confirmText() == `"${props.confirmText}"`}>
              <Typography mt="1em">
                Not with the actual quotes you muppet - I shall accept nevertheless...
              </Typography>
            </Show>
          </Show>
        </CardContent>
        <CardActions>
          <Button
            onClick={props.onConfirm}
            variant={props.confirmVariant || "text"}
            color={props.confirmColor || "primary"}
            disabled={!canConfirm()}
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
