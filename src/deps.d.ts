import { ComponentProps } from "solid-js";
import "solid-js"

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      //  @alenaksu/json-viewer
      'json-viewer': ComponentProps<"div">;
    }
    interface Directives {
      // @thisbeyond/solid-dnd
      draggable: boolean;
      droppable: boolean;
      sortable: boolean;
    }
  }
}
