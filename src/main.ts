import { SyntaxKey, SyntaxStyle } from "./themes";
import { themes } from "./themes";

// == SET UP & PRELOAD FONTS ==

const FontStyles = {
  Inter: { family: "Inter", style: "Regular" } as FontName,
  Regular: { family: "SF Mono", style: "Regular" } as FontName,
  Bold: { family: "SF Mono", style: "Bold" } as FontName,
  Italic: { family: "SF Mono", style: "Regular Italic" } as FontName,
  BoldItalic: { family: "SF Mono", style: "Bold Italic" } as FontName,
};

function fontStyle(style: any): FontName {
  if (style.font_weight === 700 && style.font_style === "italic") {
    return FontStyles.BoldItalic;
  } else if (style.font_weight === 700) {
    return FontStyles.Bold;
  } else if (style.font_style === "italic") {
    return FontStyles.Italic;
  }

  return FontStyles.Regular;
}

async function preloadFontsForBuffer() {
  const fontLoadPromises: Promise<void>[] = [];

  Object.values(FontStyles).forEach((font) => {
    fontLoadPromises.push(figma.loadFontAsync(font));
  });

  await Promise.all(fontLoadPromises);
}

// == SET UP COLOR CONVERSIONS ==

function hexToRgbFigma(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  return { r, g, b };
}

function hexToOpacity(hex: string): number {
  return hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
}

// == RENDER TEXT LINES ==

async function renderTextLines(hBuffer: HighlightableBuffer, root: FrameNode) {
  for (const lineNodes of hBuffer) {
    const lineFrame = figma.createFrame();
    lineFrame.layoutMode = "HORIZONTAL";
    lineFrame.counterAxisSizingMode = "AUTO";
    lineFrame.primaryAxisSizingMode = "AUTO";
    lineFrame.itemSpacing = 0;
    lineFrame.fills = [];

    for (const node of lineNodes) {
      const textNode = figma.createText();
      textNode.characters = node.text;
      textNode.fontSize = 16;

      // Initialize with default style, assuming text color is the theme's foreground.
      let style: SyntaxStyle = {
        color: themes.gruvbox_dark_hard.foreground,
        font_style: null,
        font_weight: null,
      };

      // Check if a specific style is defined for the node’s highlight.
      if (node.highlight && themes.gruvbox_dark_hard.syntax[node.highlight]) {
        // If so, override the default style with the specific one.
        style = {
          ...style,
          ...themes.gruvbox_dark_hard.syntax[node.highlight],
        };
      }

      textNode.fills = [{ type: "SOLID", color: hexToRgbFigma(style.color) }];
      textNode.opacity = hexToOpacity(style.color);

      const fontConfig = fontStyle(style);
      await figma.loadFontAsync(fontConfig);
      textNode.fontName = fontConfig;

      lineFrame.appendChild(textNode);
    }

    root.appendChild(lineFrame);
  }
}

// == RUN THE APP ==

export default async function () {
  try {
    await preloadFontsForBuffer();

    const currentPage = figma.currentPage;

    const root = figma.createFrame();
    root.name = "Root";
    root.x = 0;
    root.y = 0;
    root.resize(1, 1);
    root.fills = [
      {
        type: "SOLID",
        color: hexToRgbFigma(themes.gruvbox_dark_hard.background),
      },
    ];
    root.layoutMode = "VERTICAL";
    root.counterAxisSizingMode = "AUTO";
    root.primaryAxisSizingMode = "AUTO";
    root.verticalPadding = 16;
    root.horizontalPadding = 16;

    await renderTextLines(static_json, root);

    currentPage.appendChild(root);
    figma.viewport.scrollAndZoomIntoView([root]);
  } catch (error) {
    console.error("Failed to load fonts or render text lines.", error);
    figma.closePlugin(`Error: ${error || "Failed to execute plugin."}`);
    return;
  }

  figma.closePlugin("Successfully rendered all lines.");
}

// == DEFINE A HIGHLIGHTABLE BUFFER ==

type HighlightableNode = { text: string; highlight: SyntaxKey | null };

type HighlightableLine = HighlightableNode[];

type HighlightableBuffer = HighlightableLine[];

// == TEMOPORARY STATIC JSON ==

const static_json: HighlightableBuffer = [
  [
    {
      text: "#",
      highlight: null,
    },
    {
      text: "[",
      highlight: "punctuation.bracket",
    },
    {
      text: "derive",
      highlight: null,
    },
    {
      text: "(",
      highlight: "punctuation.bracket",
    },
    {
      text: "Debug",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "PartialEq",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "Eq",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "PartialOrd",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "Ord",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "Hash",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "Clone",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "Copy",
      highlight: "type",
    },
    {
      text: ", ",
      highlight: null,
    },
    {
      text: "Default",
      highlight: "type",
    },
    {
      text: ")]",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "pub",
      highlight: "keyword",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "enum",
      highlight: "keyword",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "TintColor",
      highlight: "type",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "    #",
      highlight: null,
    },
    {
      text: "[",
      highlight: "punctuation.bracket",
    },
    {
      text: "default",
      highlight: null,
    },
    {
      text: "]",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "    ",
      highlight: null,
    },
    {
      text: "Accent",
      highlight: "type",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "    ",
      highlight: null,
    },
    {
      text: "Negative",
      highlight: "type",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "    ",
      highlight: null,
    },
    {
      text: "Warning",
      highlight: "type",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "}",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "",
      highlight: null,
    },
  ],
  [
    {
      text: "impl",
      highlight: "keyword",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "TintColor",
      highlight: "type",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "    ",
      highlight: null,
    },
    {
      text: "fn",
      highlight: "keyword",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "button_like_style",
      highlight: "function",
    },
    {
      text: "(",
      highlight: "punctuation.bracket",
    },
    {
      text: "self",
      highlight: "variable.special",
    },
    {
      text: ", cx: &",
      highlight: null,
    },
    {
      text: "mut",
      highlight: "keyword",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "WindowContext",
      highlight: "type",
    },
    {
      text: ")",
      highlight: "punctuation.bracket",
    },
    {
      text: " -> ",
      highlight: null,
    },
    {
      text: "ButtonLikeStyles",
      highlight: "type",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "        ",
      highlight: null,
    },
    {
      text: "match",
      highlight: "keyword",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "self",
      highlight: "variable.special",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "            ",
      highlight: null,
    },
    {
      text: "TintColor",
      highlight: "type",
    },
    {
      text: "::",
      highlight: null,
    },
    {
      text: "Accent",
      highlight: "type",
    },
    {
      text: " => ",
      highlight: null,
    },
    {
      text: "ButtonLikeStyles",
      highlight: "type",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "background",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "status",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "info_background",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "border_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "status",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "info_border",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "label_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "colors",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "text",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "icon_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "colors",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "text",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "            ",
      highlight: null,
    },
    {
      text: "}",
      highlight: "punctuation.bracket",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "            ",
      highlight: null,
    },
    {
      text: "TintColor",
      highlight: "type",
    },
    {
      text: "::",
      highlight: null,
    },
    {
      text: "Negative",
      highlight: "type",
    },
    {
      text: " => ",
      highlight: null,
    },
    {
      text: "ButtonLikeStyles",
      highlight: "type",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "background",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "status",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "error_background",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "border_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "status",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "error_border",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "label_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "colors",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "text",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "icon_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "colors",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "text",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "            ",
      highlight: null,
    },
    {
      text: "}",
      highlight: "punctuation.bracket",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "            ",
      highlight: null,
    },
    {
      text: "TintColor",
      highlight: "type",
    },
    {
      text: "::",
      highlight: null,
    },
    {
      text: "Warning",
      highlight: "type",
    },
    {
      text: " => ",
      highlight: null,
    },
    {
      text: "ButtonLikeStyles",
      highlight: "type",
    },
    {
      text: " ",
      highlight: null,
    },
    {
      text: "{",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "background",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "status",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "warning_background",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "border_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "status",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "warning_border",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "label_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "colors",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "text",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "                ",
      highlight: null,
    },
    {
      text: "icon_color",
      highlight: "property",
    },
    {
      text: ": cx.",
      highlight: null,
    },
    {
      text: "theme",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "colors",
      highlight: "function",
    },
    {
      text: "()",
      highlight: "punctuation.bracket",
    },
    {
      text: ".",
      highlight: null,
    },
    {
      text: "text",
      highlight: "property",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "            ",
      highlight: null,
    },
    {
      text: "}",
      highlight: "punctuation.bracket",
    },
    {
      text: ",",
      highlight: null,
    },
  ],
  [
    {
      text: "        ",
      highlight: null,
    },
    {
      text: "}",
      highlight: "punctuation.bracket",
    },
  ],
  [
    {
      text: "    ",
      highlight: null,
    },
    {
      text: "}",
      highlight: "punctuation.bracket",
    },
  ],
];
