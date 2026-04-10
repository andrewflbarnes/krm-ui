import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@suid/material";
import { Search, Settings } from "@suid/icons-material";
import { For, JSX, Show } from "solid-js";

export type SidebarChip = {
  label: string;
  color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
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

type ConfigSidebarProps = {
  /** Current value of the filter text input. */
  search: string;
  /** Called when the filter text input changes. */
  onSearchChange: (value: string) => void;
  /**
   * Grouped sections to display. Sections with no items are omitted.
   * Filtering is the caller's responsibility — pass already-filtered data.
   */
  sections: SidebarSection[];
  /**
   * Custom items appended below all sections under a "Custom" heading.
   * These are always unfiltered from this component's perspective — pass
   * an already-filtered list.
   */
  customItems?: SidebarItem[];
  /** Currently selected item id. */
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  /** Icon rendered in the footer next to the selected item label. */
  footerIcon: JSX.Element;
  /** Label for the selected item shown in the footer. */
  selectedLabel: string;
};

/** Shared left-panel sidebar for config browser pages. */
export default function ConfigSidebar(props: ConfigSidebarProps) {
  const visibleSections = () => props.sections.filter(s => s.items.length > 0);
  const visibleCustom = () => props.customItems ?? [];
  const hasAnyItems = () => visibleSections().length > 0 || visibleCustom().length > 0;

  return (
    <Paper sx={{
      width: 240,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Filter input */}
      <Box sx={{ p: 1.5, pb: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Filter..."
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
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

      {/* Scrollable list */}
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
                    onSelect={props.onSelect}
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
                  onSelect={props.onSelect}
                  isCustom
                />
              )}</For>
            </List>
          </Show>
        </Show>
      </Box>

      {/* Footer */}
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
  );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

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
  /** When true renders the Settings icon prefix used for custom items. */
  isCustom?: boolean;
};

function SidebarListItem(props: SidebarListItemProps) {
  const accentColor = () =>
    props.isSelected
      ? `${props.item.accentColor ?? "primary"}.main`
      : "transparent";

  const labelColor = () =>
    props.isSelected
      ? `${props.item.accentColor ?? "primary"}.main`
      : "text.primary";

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
