import { Button, CardActions, CardContent, TextField, Typography } from "@suid/material";
import { createSignal, onMount, ParentProps, Show } from "solid-js";
import KingsModal from "../ui/KingsModal";

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
  container?: Element;
}
export default function ModalConfirmAction(props: ParentProps<ModalConfirmActionProps>) {
  const [confirmText, setConfirmText] = createSignal("")
  const canConfirm = () => !props.confirmText || confirmText() == props.confirmText || confirmText() == `"${props.confirmText}"`
  return (
    <KingsModal
      open={props.open}
      onClose={props.onDiscard}
      container={props.container}
    >
      <CardContent>
        <Typography>
          {props.children}
        </Typography>
        <Show when={props.confirmText}>
          <ConfirmSection text={props.confirmText} current={confirmText()} onUpdate={setConfirmText} />
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
    </KingsModal>
  )
}

function ConfirmSection(props: {
  text: string;
  onUpdate: (v: string) => void;
  current: string;
}) {
  let ref!: HTMLInputElement
  onMount(() => ref.focus())
  return (
    <>
      <br />
      <Typography>
        Type "{props.text}" to confirm:
      </Typography>
      <TextField
        inputRef={r => ref = r}
        autoFocus
        size="small"
        color="error"
        value={props.current}
        onChange={(_, v) => props.onUpdate(v)}
      />
      <Show when={props.current == `"${props.text}"`}>
        <Typography mt="1em">
          Not with the actual quotes you muppet - I shall accept nevertheless...
        </Typography>
      </Show>
    </>
  )
}
