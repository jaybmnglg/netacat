---
version: alpha
name: Netacad
description: |
  Cisco Networking Academy's design system embodies professional educational
  authority with an approachable, modern aesthetic. The palette emphasizes
  vibrant green as the primary brand driver, signaling growth, learning, and
  opportunity. Typography relies on the elegant CiscoSans font family at
  generous weights, creating a clean, minimal visual language that prioritizes
  readability and content hierarchy. The layout embraces substantial whitespace
  and subtle color blocking—depth emerges from surface colour changes rather
  than heavy shadows, establishing a calm, distraction-free learning
  environment. Decorative elements like wavy lines and photo galleries humanize
  technical subjects and reinforce the institution's commitment to diverse
  learners worldwide.
source:
  url: "https://www.netacad.com/"
  pagesAnalyzed: 1
  extractedAt: 2026-10-05
  tokensMeasured: true
colors:
  primary: "#6ABF4B"
  accent: "#6ABF4B"
  main-bg: "#242629"
  unselected-choice: "#212328"
  unselected-choice-border: "#3C4148"
  selected-choice: "#D9F8FF"
  selected-choice-border: "#00BCEB"
  buttons-and-accents-green: "#6ABF4B"
  on-primary: "#212529"
  ink: "#FFFFFF"
typography:
  display-lg:
    fontFamily: CiscoSans
    fontSize: 56px
    fontWeight: 100
    lineHeight: 1.5
    letterSpacing: 0px
  display-md:
    fontFamily: CiscoSans
    fontSize: 54px
    fontWeight: 100
    lineHeight: 1.37
    letterSpacing: 0px
  display-md-tight:
    fontFamily: CiscoSans
    fontSize: 54px
    fontWeight: 100
    lineHeight: 1.3
    letterSpacing: 0px
  display-md-strong:
    fontFamily: CiscoSans
    fontSize: 54px
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: 0px
  display-sm:
    fontFamily: CiscoSans
    fontSize: 40px
    fontWeight: 100
    lineHeight: 1.25
    letterSpacing: 0px
  display-sm-tight:
    fontFamily: CiscoSans
    fontSize: 40px
    fontWeight: 100
    lineHeight: 1.2
    letterSpacing: 0px
  heading-md:
    fontFamily: CiscoSans
    fontSize: 36px
    fontWeight: 100
    lineHeight: 1.39
    letterSpacing: 0px
  heading-sm:
    fontFamily: CiscoSans
    fontSize: 32px
    fontWeight: 100
    lineHeight: 1.2
    letterSpacing: 0px
  body-xl:
    fontFamily: CiscoSans
    fontSize: 26px
    fontWeight: 200
    lineHeight: 1.5
    letterSpacing: 0px
  body-lg:
    fontFamily: CiscoSans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.63
    letterSpacing: 0px
  body-lg-strong:
    fontFamily: CiscoSans
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0px
  body-md:
    fontFamily: CiscoSans
    fontSize: 15px
    fontWeight: 300
    lineHeight: 1.47
    letterSpacing: 0px
  body-sm:
    fontFamily: CiscoSans
    fontSize: 14px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm-strong:
    fontFamily: CiscoSans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  button-sm:
    fontFamily: CiscoSans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0px
  button-sm-loose:
    fontFamily: CiscoSans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 2
    letterSpacing: 0px
  label-sm:
    fontFamily: CiscoSans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0px
  label-sm-loose:
    fontFamily: CiscoSans
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.71
    letterSpacing: 0px
  caption-xs:
    fontFamily: CiscoSans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  caption-xs-strong:
    fontFamily: CiscoSans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0px
  caption-xs-uppercase:
    fontFamily: CiscoSans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 1px
    textTransform: uppercase
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 5px
  lg: 10px
  xl: 20px
  full: 9999px
spacing:
  xxs: 4px
  xs: 12px
  sm: 16px
  md: 20px
  lg: 24px
  xl: 28px
  xxl: 32px
  xxxl: 40px
  section: 44px
  band: 56px
borderWidths:
  thin: 1px
  medium: 2px
elevationStrategy: color-blocking
themes:
  derived: dark
  light:
    bg: "#FFFFFF"
    surface: "#FFFFFF"
    surfaceRaised: "#F4F6F8"
    text: "#212529"
    textMuted: "#6F7174"
    border: "#D1D5DB"
    accent: "#487B32"
    accentFg: "#FFFFFF"
    focusRing: "#6ABF4B"
    elevation: shadow
  dark:
    bg: "#242629"
    surface: "#212328"
    surfaceRaised: "#282B31"
    choiceBorder: "#3C4148"
    choiceSelected: "#D9F8FF"
    choiceSelectedBorder: "#00BCEB"
    text: "#FFFFFF"
    textMuted: "#8E949E"
    border: "#3C4148"
    accent: "#6ABF4B"
    accentFg: "#212529"
    focusRing: "#6ABF4B"
    elevation: "border+surface"
---

# Design System Inspired by Cisco Networking Academy (Netacad)

## Layout & Component Rules
- **Typography**: Standard Arial (`Arial, sans-serif`) across all text, headings, and buttons.
- **Color Scheme**:
  - Main BG: `#242629`
  - Unselected Choice: `#212328`
  - Unselected Choice Border: `#3C4148`
  - Selected Choice: `#D9F8FF` (with `#00BCEB` border and high-contrast `#1A202C` bold text)
  - Selected Choice Border: `#00BCEB`
  - Buttons and Accents Green: `#6ABF4B`
- **Question Layout**:
  - Reduced visual gap between question header/prompt and the first choice.
  - Question counter/tracker at the bottom: fixed above choices and explanation, bound to the bottom black bar with an 18px gap.

