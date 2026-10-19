import { z } from "zod";

/**
 * Shared zod schemas for widget/block creation and update tools.
 * Each widget type has its own config schema; tools discriminate on the
 * `widgetType` field so the config shape is validated per type.
 */

const alignmentSchema = z.enum(["left", "center", "right"]);

/** Grid position and dimensions of a home dashboard widget. */
export const positionSchema = z.object({
  x: z.number().describe("Horizontal grid column (0-indexed)"),
  y: z.number().describe("Vertical grid row (0-indexed)"),
  w: z.number().describe("Width in grid columns"),
  h: z.number().describe("Height in grid rows"),
  minW: z.number().optional().describe("Minimum width constraint"),
  minH: z.number().optional().describe("Minimum height constraint"),
});

/** Grid position and size of a document block on the A4 sheet (12 columns grid). */
export const blockPositionSchema = z.object({
  x: z.number().describe("Horizontal grid column (0-indexed)"),
  y: z.number().describe("Vertical grid row (0-indexed)"),
  w: z.number().describe("Grid width in columns"),
  h: z.number().describe("Grid height in rows"),
  minW: z.number().optional().describe("Minimum grid width allowed when resizing"),
  minH: z.number().optional().describe("Minimum grid height allowed when resizing"),
  maxW: z.number().optional().describe("Maximum grid width allowed when resizing"),
  maxH: z.number().optional().describe("Maximum grid height allowed when resizing"),
});

/** Config of a metrics widget: a key value with unit and trend indicator. */
export const metricsConfigSchema = z.object({
  title: z.string().describe("Display title above the metric value"),
  value: z.union([z.string(), z.number()]).describe("The metric value, can be a number or formatted string"),
  unit: z.string().describe("Unit label shown next to the value (e.g. USD, users)"),
  trend: z.enum(["up", "down", "neutral"]).describe("Trend direction indicator"),
  prefix: z.string().describe("Prefix prepended to the value (e.g. $)"),
  suffix: z.string().describe("Suffix appended to the value (e.g. %)"),
});

/** Config of a title/heading widget. */
export const titleConfigSchema = z.object({
  content: z.string().describe("The heading text content"),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).describe("HTML heading level: 1 (largest) through 5 (smallest)"),
  alignment: alignmentSchema.describe("Horizontal alignment of the heading text"),
});

/** Config of a toggle switch widget. */
export const toggleConfigSchema = z.object({
  label: z.string().describe("Label text displayed next to the toggle"),
  defaultValue: z.boolean().describe("Default state when the widget is first rendered"),
  currentValue: z.boolean().describe("Current live state of the toggle"),
  onLabel: z.string().describe("Label displayed when the toggle is in the ON position"),
  offLabel: z.string().describe("Label displayed when the toggle is in the OFF position"),
});

/** Config of a button widget with variant styling. */
export const buttonConfigSchema = z.object({
  label: z.string().describe("Text displayed on the button"),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).describe("Visual variant"),
  size: z.enum(["sm", "md", "lg"]).describe("Button size"),
  action: z.string().describe("URL or action triggered on click"),
  icon: z.string().describe("Optional icon identifier to display alongside the label"),
});

/** Config of an image widget. */
export const imageConfigSchema = z.object({
  src: z.string().describe("Source URL of the image"),
  alt: z.string().describe("Alternative text for accessibility and fallback display"),
  fit: z.enum(["cover", "contain", "fill", "scroll"]).describe("CSS object-fit mode"),
  rounded: z.boolean().describe("Whether to apply rounded corners to the image"),
});

/** Config of a textarea/rich text widget. */
export const textareaConfigSchema = z.object({
  content: z.string().describe("The text content displayed in the widget"),
});

/** Config of a code editor widget. */
export const codeConfigSchema = z.object({
  code: z.string().describe("The source code content"),
  language: z.string().describe("Programming language identifier for syntax highlighting (e.g. javascript, python)"),
});

/** Config of a chart widget. */
export const chartConfigSchema = z.object({
  type: z.enum(["bar", "line", "pie", "area"]).describe("Chart type"),
  title: z.string().describe("Display title above the chart"),
  labels: z.string().describe("Comma-separated labels for the X-axis or legend"),
  data: z.string().describe("Comma-separated data values corresponding to the labels"),
});

/** Config of a single progress bar widget. */
export const progressBarConfigSchema = z.object({
  label: z.string().describe("Label text displayed above or beside the bar"),
  value: z.number().describe("Numeric value determining the bar fill percentage (0-100)"),
  color: z.string().describe("Hex color code for the bar fill color"),
  showPercentage: z.boolean().describe("Whether to display the percentage value on the bar"),
});

/** Config of a progress bar list widget containing multiple bars. */
export const progressBarListConfigSchema = z.object({
  items: z.array(z.object({
    label: z.string().describe("Label text displayed alongside the bar"),
    value: z.number().describe("Numeric value determining the bar fill percentage (0-100)"),
    color: z.string().describe("Hex color code for the bar fill color"),
  })).describe("Individual progress bar items"),
  showPercentage: z.boolean().describe("Whether to display percentage values on each bar"),
});

/** Config of a YouTube video embed widget. */
export const youtubeConfigSchema = z.object({
  url: z.string().describe("Full YouTube video URL (e.g. https://www.youtube.com/watch?v=...)"),
});

/** Config of a link/hyperlink widget. */
export const linkConfigSchema = z.object({
  label: z.string().describe("Clickable label text for the link"),
  url: z.string().describe("Target URL the link navigates to"),
});

/** Config of a table widget with editable cells. */
export const tableConfigSchema = z.object({
  columns: z.array(z.string()).describe("Labels of the table columns"),
  rows: z.array(z.array(z.string())).describe("Cell values as rows of the same length as columns"),
  columnAlignments: z.array(alignmentSchema).optional().describe("Horizontal alignment per column; applies only to the column header text"),
  cellAlignments: z.array(z.array(alignmentSchema)).optional().describe("Horizontal alignment per cell"),
});

/** Config of a list widget. */
export const listConfigSchema = z.object({
  items: z.array(z.object({
    text: z.string().describe("Text of the list item"),
    checked: z.boolean().describe("Whether the item is checked (only used by the checklist style)"),
  })).describe("Items rendered by the list"),
  style: z.enum(["bullets", "numbered", "checklist"]).describe("Visual style of the list"),
  itemAlignments: z.array(alignmentSchema).optional().describe("Horizontal alignment per item"),
});

/** Config of a divider widget. */
export const dividerConfigSchema = z.object({
  color: z.string().describe("CSS border color of the divider"),
});

/** Config of an embed widget referencing a platform resource. */
export const embedConfigSchema = z.object({
  resourceType: z.enum(["kanban_dashboard", "form", "database", "diagram", "storage_file"]).describe("Type of platform resource being embedded"),
  resourceId: z.string().describe("Unique identifier of the embedded resource"),
  showTitle: z.boolean().describe("Whether the resource title is shown in the card"),
});

/** Widget creation schema with per-type config validation (config/position fall back to server defaults). */
export const createWidgetSchema = z.discriminatedUnion("widgetType", [
  z.object({ widgetType: z.literal("metrics"), config: metricsConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("title"), config: titleConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("container"), config: z.record(z.any(), z.any()).optional().describe("Container-specific configuration"), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("toggle"), config: toggleConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("button"), config: buttonConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("image"), config: imageConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("textarea"), config: textareaConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("code"), config: codeConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("chart"), config: chartConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("progress_bar"), config: progressBarConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("progress_bar_list"), config: progressBarListConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("youtube"), config: youtubeConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("link"), config: linkConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("table"), config: tableConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("list"), config: listConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("divider"), config: dividerConfigSchema.optional(), position: positionSchema.optional() }),
  z.object({ widgetType: z.literal("embed"), config: embedConfigSchema.optional(), position: positionSchema.optional() }),
]);

/** Document block creation schema with per-type config validation. */
export const createBlockSchema = z.discriminatedUnion("widgetType", [
  z.object({ widgetType: z.literal("metrics"), config: metricsConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("title"), config: titleConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("container"), config: z.record(z.any(), z.any()).describe("Container-specific configuration"), position: blockPositionSchema }),
  z.object({ widgetType: z.literal("toggle"), config: toggleConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("button"), config: buttonConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("image"), config: imageConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("textarea"), config: textareaConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("code"), config: codeConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("chart"), config: chartConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("progress_bar"), config: progressBarConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("progress_bar_list"), config: progressBarListConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("youtube"), config: youtubeConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("link"), config: linkConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("table"), config: tableConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("list"), config: listConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("divider"), config: dividerConfigSchema, position: blockPositionSchema }),
  z.object({ widgetType: z.literal("embed"), config: embedConfigSchema, position: blockPositionSchema }),
]);

/** Widget update schema: per-type partial config validation keyed by widgetType. */
export const updateWidgetSchema = z.discriminatedUnion("widgetType", [
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("metrics"), config: metricsConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("title"), config: titleConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("container"), config: z.record(z.any(), z.any()).optional().describe("Container-specific configuration"), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("toggle"), config: toggleConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("button"), config: buttonConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("image"), config: imageConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("textarea"), config: textareaConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("code"), config: codeConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("chart"), config: chartConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("progress_bar"), config: progressBarConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("progress_bar_list"), config: progressBarListConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("youtube"), config: youtubeConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("link"), config: linkConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("table"), config: tableConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("list"), config: listConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("divider"), config: dividerConfigSchema.partial().optional(), position: positionSchema.optional() }),
  z.object({ id: z.string().describe("Widget identifier"), widgetType: z.literal("embed"), config: embedConfigSchema.partial().optional(), position: positionSchema.optional() }),
]);