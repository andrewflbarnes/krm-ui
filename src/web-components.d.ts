import { ComponentProps } from "solid-js";
import "solid-s"

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      'json-viewer': ComponentProps<"div">;
    }
  }
}

