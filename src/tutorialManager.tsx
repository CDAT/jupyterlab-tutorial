import * as React from "react";
import * as ReactDOM from "react-dom";
import { Widget } from "@phosphor/widgets";
import { MainMenu } from "@jupyterlab/mainmenu";
import { JupyterFrontEnd } from "@jupyterlab/application";
import ErrorBoundary from "./ErrorBoundary";
import { TutorialLauncher } from "./TutorialLauncher";
import { Tutorial } from "./tutorial";
import { TutorialOptions } from "./constants";
import { ITutorialManager, ITutorial } from "./tokens";

/**
 * The TutorialManager is needed to manage creation, removal and launching of Tutorials
 */
export class TutorialManager extends Widget implements ITutorialManager {
  private app: JupyterFrontEnd;
  private mainDiv: HTMLDivElement; // The main container for this widget
  private menu: MainMenu;

  private _tutorialLauncher: TutorialLauncher;
  private _tutorials: Map<string, Tutorial>;

  constructor(
    app: JupyterFrontEnd,
    mainMenu: MainMenu,
    options?: TutorialOptions
  ) {
    super();
    this.app = app;
    this.id = "tutorial-manager";
    this.mainDiv = document.createElement("div");
    this.mainDiv.id = "jupyterlab-tutorial-manager-main";
    this.menu = mainMenu;
    this.node.appendChild(this.mainDiv);
    this._tutorials = new Map<string, Tutorial>();
    this.title.closable = true;

    this.createTutorial = this.createTutorial.bind(this);
    this.launch = this.launch.bind(this);
    this.removeTutorial = this.removeTutorial.bind(this);

    ReactDOM.render(
      <ErrorBoundary>
        <div id="joyride-tutorial">
          <TutorialLauncher
            initialTutorialOptions={options}
            ref={loader => (this._tutorialLauncher = loader)}
          />
        </div>
      </ErrorBoundary>,
      this.mainDiv
    );
  }

  get tutorials(): Map<string, ITutorial> {
    return this._tutorials;
  }

  createTutorial(
    id: string,
    label: string,
    addToHelpMenu: boolean = true
  ): ITutorial {
    if (this._tutorials.has(id)) {
      throw new Error(
        `Error creating new tutorial. Tutorial id's must be unique.\nTutorial with the id: '${id}' already exists.`
      );
    }

    // Create the command that will launch the tutorial when executed
    const commandID: string = `tutorial-manager:${id}`;
    const commandDisposable = this.app.commands.addCommand(commandID, {
      execute: () => {
        this._tutorialLauncher.launchTutorial(newTutorial);
      },
      label: label,
      className: id
    });

    // Create tutorial and add it to help menu if needed
    let newTutorial: Tutorial = new Tutorial(id, commandID, commandDisposable);
    if (addToHelpMenu) {
      newTutorial.addTutorialToMenu(this.menu.helpMenu.menu);
    }

    // Add tutorial to current set
    this._tutorials.set(id, newTutorial);

    return newTutorial;
  }

  async launch(...tutorials: ITutorial[]): Promise<void>;
  async launch(...tutorialIDs: string[]): Promise<void>;
  async launch(...tutorials: ITutorial[] | string[]): Promise<void> {
    if (!tutorials || tutorials.length === 0) {
      return;
    }

    const tutorialGroup = Array<Tutorial>();

    // If the array provided consists of tutorials already, add tutorials that have steps.
    if (typeof tutorials[0] === "object") {
      (tutorials as Tutorial[]).forEach((tutorial: Tutorial) => {
        if (tutorial && tutorial.hasSteps) {
          tutorialGroup.push(tutorial);
        }
      });
    } else {
      // Tutorials provided as tutorial IDs, first get the tutorial, then add to group if it has steps
      (tutorials as string[]).forEach((tutorialID: string) => {
        let tutorial: Tutorial = this._tutorials.get(tutorialID);
        if (tutorial && tutorial.hasSteps) {
          tutorialGroup.push(tutorial);
        }
      });
    }

    await this._tutorialLauncher.launchTutorialGroup(tutorialGroup);
  }

  removeTutorial(tutorial: ITutorial): void;
  removeTutorial(tutorialID: string): void;
  removeTutorial(t: string | ITutorial): void {
    if (!t) {
      return;
    }

    let id: string;
    if (typeof t === "string") {
      id = t;
    } else {
      id = t.id;
    }

    let tutorial: Tutorial = this._tutorials.get(id);
    if (!tutorial) {
      return;
    }
    // Remove the tutorial's command
    tutorial.commandDisposable.dispose();
    // Remove tutorial from the list
    this._tutorials.delete(id);
  }
}
