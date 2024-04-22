import { gruvbox_dark_hard } from "./gruvbox_dark_hard";
import { one_dark } from "./one_dark";

export type SyntaxKey =
  | "attribute"
  | "boolean"
  | "comment"
  | "comment.doc"
  | "constant"
  | "constructor"
  | "embedded"
  | "emphasis"
  | "emphasis.strong"
  | "enum"
  | "function"
  | "function.builtin"
  | "hint"
  | "keyword"
  | "label"
  | "link_text"
  | "link_uri"
  | "number"
  | "operator"
  | "predictive"
  | "preproc"
  | "primary"
  | "property"
  | "punctuation"
  | "punctuation.bracket"
  | "punctuation.delimiter"
  | "punctuation.list_marker"
  | "punctuation.special"
  | "string"
  | "string.escape"
  | "string.regex"
  | "string.special"
  | "string.special.symbol"
  | "tag"
  | "text.literal"
  | "title"
  | "type"
  | "variable"
  | "variable.special"
  | "variant";

export type SyntaxStyle = {
  color: string;
  font_style: string | null;
  font_weight: number | null;
};

export type Syntax = Partial<Record<SyntaxKey, SyntaxStyle>>;

export type Theme = {
  foreground: string;
  background: string;
  syntax: Syntax;
};

export const theme_names = ["one_dark", "gruvbox_dark_hard"] as const;

export const all_theme_names: ThemeName[] = theme_names.map(
  (name) => name,
) as ThemeName[];

export type ThemeName = (typeof theme_names)[number];
export type Themes = Record<ThemeName, Theme>;

export const themes: Themes = {
  one_dark,
  gruvbox_dark_hard,
};
