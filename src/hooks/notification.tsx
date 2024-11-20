import { Alert, Button } from "@suid/material"
import { AlertColor } from "@suid/material/Alert"
import toast from "solid-toast"

export default {
  info,
  success,
  error,
}

function info(msg: string) {
  create("info", msg)
}

function success(msg: string) {
  create("success", msg)
}

function error(msg: string) {
  create("error", msg)
}

function create(severity: AlertColor, msg: string) {
  toast.custom((t) => (
    <Alert severity={severity} action={(
      <Button color="inherit" size="small" onClick={[toast.dismiss, t.id]}>
        DISMISS
      </Button>
    )}>
      {msg}
    </Alert>
  ))
}
