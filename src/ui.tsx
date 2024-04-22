import {
  render,
  Container,
  Text,
  TextboxMultiline,
  VerticalSpace,
  Columns,
  Stack,
  Checkbox,
  Button,
} from "@create-figma-plugin/ui";
import { h } from "preact";
import { ThemeName, all_theme_names } from "./themes";
import { DEFAULT_SETTINGS, PluginSettings } from "./main";
import { useState, useEffect } from "preact/hooks";

import { emit } from "@create-figma-plugin/utilities";

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

  const [codeToHighlight, setCodeToHighlight] = useState("");
  const [editable, setEditable] = useState(props.editable || false);
  const [fontSize, setFontSize] = useState(props.fontSize || 14); // Default font size
  const [lineHeight, setLineHeight] = useState(props.lineHeight || 20); // Default line height
  const [startLineNumber, setStartLineNumber] = useState(props.startLineNumber);
  const [theme, setTheme] = useState<ThemeName>(props.theme);

  const [settings, setSettings] = useState(props);

  useEffect(() => {
    setSettings({
      ...props,
      theme,
      fontSize,
      lineHeight,
      codeToHighlight,
      editable,
      startLineNumber,
    });
  }, [theme, fontSize, lineHeight, codeToHighlight, editable, startLineNumber]);

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

  const handleEditableChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setEditable(target.checked);
  };

  const handleStartLineNumberChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setStartLineNumber(Number(target.value));
  };

  return (
    <Container space="medium" style={{ height: "100%" }}>
      <VerticalSpace space="medium" />

      <Stack space="small">
        <Text>1. Open Zed</Text>
        <Text>2. Select some text</Text>
        <Text>{`3. CMD+SHIFT+P -> editor: copy highlight json`}</Text>
        <Text>4. Paste the JSON below</Text>
      </Stack>

      <VerticalSpace space="extraLarge" />
      <select id="theme-select" value={theme} onChange={handleThemeChange}>
        {themeOptions}
      </select>
      <VerticalSpace space="medium" />

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
      <VerticalSpace space="medium" />

      <Text>Line Settings</Text>
      <VerticalSpace space="medium" />

      <Stack space="extraSmall">
        <Text>Start Line Number</Text>
        <input
          type="number"
          value={startLineNumber}
          onChange={handleStartLineNumberChange}
        />
      </Stack>

      <VerticalSpace space="medium" />

      <Columns space="medium">
        <Checkbox value={editable} onChange={handleEditableChange}>
          <Text>Editable</Text>
        </Checkbox>
      </Columns>

      <VerticalSpace space="medium" />

      <TextboxMultiline
        value={codeToHighlight}
        variant="border"
        placeholder="Add some text to highlight..."
        onChange={handleCodeToHighlightChange}
        grow
      />

      <VerticalSpace space="medium" />

      <Button fullWidth onClick={handleClick}>
        Highlight!
      </Button>
    </Container>
  );
}

export default render(Plugin);
