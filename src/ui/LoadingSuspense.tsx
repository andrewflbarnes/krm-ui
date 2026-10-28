import { Box, LinearProgress } from "@suid/material";
import { ParentProps, Suspense } from "solid-js";


export default function LoadingSuspense(props: ParentProps) {
  return (
    <Suspense fallback={<Loading />}>
      {props.children}
    </Suspense>
  )
}

function Loading() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  )
}
