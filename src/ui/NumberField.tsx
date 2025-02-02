import { TextField } from "@suid/material";
import { StandardTextFieldProps } from "@suid/material/TextField";

export default function NumberField(props: {
  onChange: StandardTextFieldProps["onChange"];
  value: unknown;
  zeroBlank?: boolean;
}) {
  return (
    <TextField
      type="number"
      size="small"
      onChange={props.onChange}
      variant="standard"
      value={props.value === 0 && props.zeroBlank ? "" : props.value}
      inputProps={{ style: { "text-align": "center" } }}
      sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          display: "none",
        },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
      }}
    />
  )
}
