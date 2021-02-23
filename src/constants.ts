import { Step } from "react-joyride";

export type LocaleOptions = {
  back: string;
  close: string;
  last: string;
  next: string;
  skip: string;
};

export type TutorialStep = Step;

export type StyleOptions = {
  arrowColor: string;
  backgroundColor: string;
  beaconSize: number;
  overlayColor: string;
  primaryColor: string;
  spotlightShadow: string;
  textColor: string;
  width: number;
  zIndex: number;
};

export type TutorialOptions = {
  continuous: boolean;
  debug: boolean;
  disableCloseOnEsc: boolean;
  disableOverlay: boolean;
  disableOverlayClose: boolean;
  disableScrolling: boolean;
  hideBackButton: boolean;
  locale: LocaleOptions;
  scrollOffset: number;
  scrollToFirstStep: boolean;
  showProgress: boolean;
  showSkipButton: boolean;
  spotlightClicks: boolean;
  spotlightPadding: number;
  styles: StyleOptions;
};

/**
 * This class contains default values that are used by the tutorials.
 * Default tutorial steps are available which give a simple overview of Jupyter Lab.
 */
export class TutorialDefault {
  private constructor() {}

  static get locale(): LocaleOptions {
    return {
      back: "Previous",
      close: "Close",
      last: "Finish",
      next: "Next",
      skip: "Skip"
    };
  }

  static get style(): StyleOptions {
    return {
      arrowColor: "#fff",
      backgroundColor: "#fff",
      beaconSize: 36,
      overlayColor: "rgba(0, 0, 0, 0.5)",
      primaryColor: "#f04",
      spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
      textColor: "#333",
      width: undefined,
      zIndex: 100
    };
  }

  static get options(): TutorialOptions {
    return {
      continuous: true,
      debug: false,
      disableCloseOnEsc: false,
      disableOverlay: false,
      disableOverlayClose: false,
      disableScrolling: false,
      hideBackButton: false,
      locale: this.locale,
      scrollOffset: undefined,
      scrollToFirstStep: undefined,
      showProgress: true,
      showSkipButton: true,
      spotlightClicks: false,
      spotlightPadding: undefined,
      styles: this.style
    };
  }

  static get steps(): TutorialStep[] {
    return [
      {
        content:
          "The following tutorial will point out some of the main UI components within JupyterLab.",
        placement: "center",
        target: "#jp-main-dock-panel",
        title: "Welcome to Jupyter Lab!"
      },
      {
        content:
          "This is the main content area where notebooks and other content can be viewed and edited.",
        placement: "left-end",
        target: "#jp-main-dock-panel",
        title: "Main Content"
      },
      {
        content: `This is the top menu bar where you can access several menus.`,
        placement: "bottom",
        target: "#jp-MainMenu",
        title: "Top Menu Options"
      },
      {
        content: `This is the left side menu bar where you can switch between functional panels.`,
        placement: "right",
        target: ".jp-SideBar.jp-mod-left",
        title: "Left Side Bar"
      }
    ];
  }
}
