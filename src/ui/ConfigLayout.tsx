import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@suid/material";
import { Menu, MenuOpen, Search, Settings } from "@suid/icons-material";
import { createEffect, createMemo, createSignal, For, JSX, ParentProps, Show } from "solid-js";
import { BaseColor } from "../theme";

export type SidebarChip = {
  label: string;
  color: BaseColor;
};

export type SidebarItem = {
  id: string;
  label: string;
  chip?: SidebarChip;
  secondary?: string;
  /** Accent color for the left border and label when selected. Defaults to "primary". */
  accentColor?: "primary" | "secondary";
};

export type SidebarSection = {
  /** Section heading shown in the overline+rule header. */
  label: string;
  /** Optional sub-label shown at the right end of the header rule. */
  description?: string;
  items: SidebarItem[];
};

type ConfigLayoutProps = ParentProps<{
  /**
   * When falsy the right panel shows the empty state; when truthy the children
   * are wrapped in a scrollable Paper and rendered.
   */
  selectedId: string | undefined;
  /** Large icon shown in the empty state (e.g. <Tune sx={{ fontSize: 64 }} />). */
  emptyIcon: JSX.Element;
  /** Primary heading in the empty state. */
  emptyHeading: string;
  /** Secondary description line in the empty state. */
  emptyDescription: string;
  /**
   * Grouped sections to display. Sections with no items (after internal search
   * filtering) are omitted automatically.
   */
  sections: SidebarSection[];
  /** Custom items appended below all sections under a "Custom" heading. */
  customItems?: SidebarItem[];
  onSelect: (id: string) => void;
  /** Icon rendered in the footer next to the selected item label. */
  footerIcon: JSX.Element;
  /** Label for the selected item shown in the footer. */
  selectedLabel: string;
}>;

/**
 * Two-panel layout shared by config browser pages.
 *
 * Left panel: built-in sidebar with filter, scrollable list, and footer.
 * Right panel: children wrapped in a scrollable Paper, or an empty state when
 * nothing is selected.
 */
export default function ConfigLayout(props: ConfigLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = createSignal("");
  const [sidebarOpen, setSidebarOpen] = createSignal(true);

  createEffect(() => {
    setSidebarOpen(!props.selectedId || !isMobile());
  });

  const matchesSearch = (item: SidebarItem, q: string) =>
    item.label.toLowerCase().includes(q) ||
    (item.chip?.label.toLowerCase().includes(q) ?? false);

  const visibleSections = createMemo(() => {
    const q = search().trim().toLowerCase();
    return props.sections
      .map(s => ({ ...s, items: q ? s.items.filter(item => matchesSearch(item, q)) : s.items }))
      .filter(s => s.items.length > 0);
  });
  const visibleCustom = createMemo(() => {
    const q = search().trim().toLowerCase();
    const items = props.customItems ?? [];
    return q ? items.filter(item => matchesSearch(item, q)) : items;
  });
  const hasAnyItems = () => visibleSections().length > 0 || visibleCustom().length > 0;

  const handleSelect = (id: string) => {
    if (isMobile()) {
      setSidebarOpen(false);
    }
    props.onSelect(id);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Show when={isMobile()}>
        <Box sx={{ pb: 1 }}>
          <IconButton onClick={() => setSidebarOpen(o => !o)} size="small">
            <Show when={sidebarOpen()} fallback={<Menu />}>
              <MenuOpen />
            </Show>
          </IconButton>
        </Box>
      </Show>

      <Box sx={{ display: "flex", gap: 2, flexGrow: 1, overflow: "hidden" }}>
        <Paper sx={{
          width: isMobile() ? "100%" : 240,
          flexShrink: 0,
          display: (!isMobile() || sidebarOpen()) ? "flex" : "none",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          <Box sx={{ p: 1.5, pb: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Filter..."
              value={search()}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Box sx={{ overflowY: "auto", flexGrow: 1, pb: 1 }}>
            <Show
              when={hasAnyItems()}
              fallback={
                <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.disabled">
                    No configs match
                  </Typography>
                </Box>
              }
            >
              <For each={visibleSections()}>{(section) => (
                <>
                  <SectionHeader label={section.label} description={section.description} />
                  <List disablePadding dense>
                    <For each={section.items}>{(item) => (
                      <SidebarListItem
                        item={item}
                        isSelected={props.selectedId === item.id}
                        onSelect={handleSelect}
                      />
                    )}</For>
                  </List>
                </>
              )}</For>

              <Show when={visibleCustom().length > 0}>
                <SectionHeader label="Custom" />
                <List disablePadding dense>
                  <For each={visibleCustom()}>{(item) => (
                    <SidebarListItem
                      item={item}
                      isSelected={props.selectedId === item.id}
                      onSelect={handleSelect}
                      isCustom
                    />
                  )}</For>
                </List>
              </Show>
            </Show>
          </Box>

          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Show
              when={props.selectedId}
              fallback={
                <Typography variant="caption" color="text.disabled">
                  Select a config to preview
                </Typography>
              }
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {props.footerIcon}
                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                  {props.selectedLabel}
                </Typography>
              </Box>
            </Show>
          </Box>
        </Paper>

        <Show when={!isMobile() || !sidebarOpen()}>
          <Show
            when={props.selectedId}
            fallback={
              <Box sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
                opacity: 0.4,
              }}>
                {props.emptyIcon}
                <Typography variant="h6" color="text.disabled">
                  {props.emptyHeading}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {props.emptyDescription}
                </Typography>
              </Box>
            }
          >
            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
              {props.children}
            </Box>
          </Show>
        </Show>
      </Box>
    </Box>
  );
}

// -----------------------
// Internal sub-components
// -----------------------

type SectionHeaderProps = {
  label: string;
  description?: string;
};

function SectionHeader(props: SectionHeaderProps) {
  return (
    <Box sx={{
      px: 2,
      pt: 1.5,
      pb: 0.5,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}>
      <Typography
        variant="overline"
        sx={{
          lineHeight: 1,
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          color: "text.disabled",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {props.label}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
      <Show when={props.description}>
        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.6rem" }}>
          {props.description}
        </Typography>
      </Show>
    </Box>
  );
}

type SidebarListItemProps = {
  item: SidebarItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isCustom?: boolean;
};

function SidebarListItem(props: SidebarListItemProps) {
  const accent = () => props.item.accentColor ?? "primary";
  const accentColor = () => props.isSelected ? `${accent()}.main` : "transparent";
  const labelColor = () => props.isSelected ? `${accent()}.main` : "text.primary";

  return (
    <ListItemButton
      selected={props.isSelected}
      onClick={() => props.onSelect(props.item.id)}
      sx={{
        py: 0.75,
        px: 2,
        borderLeft: "3px solid",
        borderColor: accentColor(),
        transition: "border-color 0.15s ease",
        "&.Mui-selected": {
          bgcolor: "action.selected",
        },
        "&.Mui-selected:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Show when={props.isCustom}>
                <Settings sx={{ fontSize: 12, color: labelColor() }} />
              </Show>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: props.isSelected ? 700 : 400,
                  color: labelColor(),
                  lineHeight: 1.3,
                }}
              >
                {props.item.label}
              </Typography>
            </Box>
            <Show when={props.item.chip}>
              {(chip) => (
                <Chip
                  label={chip().label}
                  color={chip().color}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              )}
            </Show>
          </Box>
        }
        secondary={
          <Show when={props.item.secondary}>
            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.65rem" }}>
              {props.item.secondary}
            </Typography>
          </Show>
        }
      />
    </ListItemButton>
  );
}
