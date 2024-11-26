import { useCurrentMatches } from "@solidjs/router";
import { Breadcrumbs, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { useBreadcrumber } from "../hooks/breadcrumb";
import Link from "./Link";

export default function KrmBreadcrumbs() {
  const [breadcrumber] = useBreadcrumber();
  const matches = useCurrentMatches();
  const breadcrumbs = createMemo(() =>
    matches().filter(m => m.route.info?.breadcrumb).map((m, i, self) => {
      const breadcrumb = m.route.info?.breadcrumb
      return {
        crumb: breadcrumber.overrides[breadcrumb] ?? breadcrumb,
        href: m.path,
        current: i === self.length - 1,
      }
    })
  );

  return (
    <Breadcrumbs sx={{
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      color: "inherit",
    }}>
      <For each={breadcrumbs()}>{({ crumb, href, current }, i) => (
        <>
          <Show when={i() === 0}>
            &ZeroWidthSpace;
          </Show>
          <Show when={!current} fallback={<Typography mr="8px">{crumb}</Typography>}>
            <Link href={href} title={crumb} />
          </Show>
        </>
      )}</For>
    </Breadcrumbs>
  )
}
