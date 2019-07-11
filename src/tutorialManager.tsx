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

export class TutorialManager extends Widget implements ITutorialManager {
  private app: JupyterFrontEnd;
  private mainDiv: HTMLDivElement; // The main container for this widget
  private menu: MainMenu;

  private _tutorialLauncher: TutorialLauncher;
  private _tutorials: Tutorial[];

  constructor(app: JupyterFrontEnd, menu: MainMenu, options?: TutorialOptions) {
    super();
    this.app = app;
    this.id = "tutorial-manager";
    this.mainDiv = document.createElement("div");
    this.mainDiv.id = "jupyterlab-tutorial-manager-main";
    this.menu = menu;
    this.node.appendChild(this.mainDiv);
    this._tutorials = Array<Tutorial>();
    this.title.closable = true;

    this.createTutorial = this.createTutorial.bind(this);
    this.launch = this.launch.bind(this);

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

  get tutorials(): ITutorial[] {
    return this._tutorials;
  }

  createTutorial(
    id: string,
    label: string,
    addToHelpMenu: boolean = true
  ): ITutorial {
    const tutorialExists: boolean = this._tutorials.some(tutorial => {
      return tutorial.id === id;
    });
    if (tutorialExists) {
      throw new Error(
        `Error creating new tutorial. Tutorial id's must be unique.\nTutorial with the id: '${id}' already exists.`
      );
    }

    const commandID: string = `tutorial-manager:${id}`;
    let newTutorial: Tutorial = new Tutorial(id, commandID, label);
    newTutorial;
    this.app.commands.addCommand(commandID, {
      execute: () => {
        // Start the tutorial
        this.menu.helpMenu.menu.activate();
        this._tutorialLauncher.launchTutorial(newTutorial);
      },
      label: label,
      className: id
    });

    if (addToHelpMenu) {
      newTutorial.addTutorialToMenu(this.menu.helpMenu.menu);
    }

    this._tutorials.push(newTutorial);

    return newTutorial;
  }

  async launch(...tutorials: ITutorial[]): Promise<void>;
  async launch(...tutorialIDs: string[]): Promise<void>;
  async launch(...tutorials: ITutorial[] | string[]): Promise<void> {
    if (!tutorials || tutorials.length === 0) {
      return;
    }

    const tutorialGroup = Array<Tutorial>();
    if (typeof tutorials[0] === "object") {
      (tutorials as Tutorial[]).forEach((tutorial: Tutorial) => {
        if (tutorial && tutorial.hasSteps) {
          tutorialGroup.push(tutorial);
        }
      });
    } else {
      (tutorials as string[]).forEach((tutorialID: string) => {
        let tutorial: Tutorial = this._tutorials.find((tutorial: Tutorial) => {
          return tutorial.id === tutorialID;
        });
        if (tutorial && tutorial.hasSteps) {
          tutorialGroup.push(tutorial);
        }
      });
    }

    await this._tutorialLauncher.launchTutorialGroup(tutorialGroup);
  }
}
