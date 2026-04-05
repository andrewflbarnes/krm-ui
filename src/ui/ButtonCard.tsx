import { Box, Card, CardActionArea, CardContent, Typography } from "@suid/material";
import { ComponentProps, JSX, Show } from "solid-js";

type ButtonCardProps = {
  label: string;
  description?: string;
  icon: JSX.Element;
  onClick: ComponentProps<typeof CardActionArea>["onClick"];
}

export default function ButtonCard(props: ButtonCardProps) {
  return (
    <Card variant="outlined" >
      <CardActionArea sx={{ height: "100%" }} onClick={props.onClick}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box color="primary.main">
            {props.icon}
          </Box>
          <Box>
            <Typography variant="h6">{props.label}</Typography>
            <Show when={props.description}>
              <Typography variant="body2" color="text.secondary">{props.description}</Typography>
            </Show>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
