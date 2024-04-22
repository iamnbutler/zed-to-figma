import {
  render,
  Container,
  Text,
  TextboxMultiline,
  Dropdown,
  VerticalSpace,
  Columns,
  Stack,
  Button,
} from "@create-figma-plugin/ui";
import { h } from "preact";
import { ThemeName, all_theme_names, theme_names, themes } from "./themes";
import { DEFAULT_SETTINGS, PluginSettings, saveData } from "./main";
import { useState, useEffect } from "preact/hooks";

import {
  emit,
  loadSettingsAsync,
  saveSettingsAsync,
} from "@create-figma-plugin/utilities";

const toLabel = (name: string) =>
  name
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function Plugin(props: PluginSettings) {
  props = {
    ...DEFAULT_SETTINGS,
    ...props,
  };

  const [theme, setTheme] = useState<ThemeName>(props.theme);
  const [fontSize, setFontSize] = useState(props.fontSize || 14); // Default font size
  const [lineHeight, setLineHeight] = useState(props.lineHeight || 20); // Default line height
  const [codeToHighlight, setCodeToHighlight] = useState("");
  const [settings, setSettings] = useState(props);

  useEffect(() => {
    setSettings({
      ...props,
      theme,
      fontSize,
      lineHeight,
      codeToHighlight,
    });
  }, [theme, fontSize, lineHeight, codeToHighlight]);

  function handleClick() {
    emit("SUBMIT", settings);
  }

  const themeOptions = all_theme_names.map((name) => (
    <option key={name} value={name}>
      {toLabel(name)}
    </option>
  ));

  const handleThemeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setTheme(target.value as ThemeName);
    console.log(`Theme changed to ${target.value}`);
  };

  const handleFontSizeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFontSize(Number(target.value));
  };

  const handleLineHeightChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setLineHeight(Number(target.value));
  };

  const handleCodeToHighlightChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCodeToHighlight(target.value);
  };

  return (
    <Container space="medium" style={{ height: "100%" }}>
      <Stack space="medium">
        <select id="theme-select" value={theme} onChange={handleThemeChange}>
          {themeOptions}
        </select>
        <Columns space="medium">
          <Stack space="medium">
            <Text>Font Size</Text>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              placeholder="Font Size"
            />
          </Stack>
          <Stack space="medium">
            <Text>Line Height</Text>
            <input
              type="number"
              value={lineHeight}
              onChange={handleLineHeightChange}
              placeholder="Line Height"
            />
          </Stack>
        </Columns>

        <TextboxMultiline
          value={codeToHighlight}
          variant="border"
          placeholder="Add some text to highlight..."
          onChange={handleCodeToHighlightChange}
          grow
        />
        <Button onClick={handleClick}>Highlight!</Button>
      </Stack>
    </Container>
  );
}

export default render(Plugin);
