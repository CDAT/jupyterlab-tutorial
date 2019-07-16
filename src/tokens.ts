import { Step, CallBackProps, Placement } from "react-joyride";
import { Menu } from "@phosphor/widgets";
import { ISignal } from "@phosphor/signaling";
import { Token } from "@phosphor/coreutils";

import { TutorialOptions } from "./constants";

export const ITutorial = new Token<ITutorial>(
  "@cdat/jupyterlab-tutorial:ITutorial"
);

export const ITutorialManager = new Token<ITutorialManager>(
  "@cdat/jupyterlab-tutorial:ITutorialManager"
);

export interface ITutorial {
  /**
   * Adds a step to the tutorial.
   * @param step Step - The step to add to the current tutorial.
   */
  addStep(step: Step): void;
  /**
   * Adds the tutorial command to the specified menu. Note: The label used when
   * the tutorial was created will be the text of the button added to the menu.
   * @param menu The menu to add a tutorial button to.
   */
  addTutorialToMenu(menu: Menu): Menu.IItem;
  /** The ID of the command that will launch the tutorial. */
  readonly commandID: string;
  /**
   * Creates a tutorial step and adds it to this tutorial.
   * @param target A css selector that will specify which area/component to highlight with this step.
   * @param content The text content to use for this tutorial step.
   * @param placement The position of the content when it is displayed for this step.
   * @param title The title to use for the the tutorial step.
   */
  createAndAddStep(
    target: string,
    content: string,
    placement?: Placement,
    title?: string
  ): Step;
  /**
   * A signal emitted when all the steps of the tutorial have been seen and tutorial is finished.
   */
  readonly finished: ISignal<this, CallBackProps>;
  /**
   * True if the tutorial has steps, otherwise false. Launching a tutorial without steps is a no-op.
   */
  readonly hasSteps: boolean;
  /**
   * The id of the tutorial, used by the tutorial manager to track different tutorials.
   */
  readonly id: string;
  /**
   * Each tutorial can have it's behavior, attributes and css styling customized
   * by accessing and setting its options.
   */
  options: TutorialOptions;
  /**
   * Will remove the tutorial from the specified menu so that its button is no longer there.
   * @param menu The menu to remove the tutorial from. this is a no-op ff the tutorial is not in the menu.
   */
  removeTutorialFromMenu(menu: Menu): void;
  /**
   * Removes a step from the tutorial, no-op if the index is out of range.
   * @param index The index of the step to remove.
   */
  removeStep(index: number): Step;
  /**
   * A signal emitted when the tutorial is first launched.
   */
  readonly started: ISignal<this, CallBackProps>;
  /**
   * A signal emitted when the tutorial step has changed.
   */
  readonly stepChanged: ISignal<this, CallBackProps>;
  /**
   * A signal emitted if the user skips or ends the tutorial prematurely.
   */
  readonly skipped: ISignal<this, CallBackProps>;
  /**
   * The array of steps the tutorial currently contains. Each step will be followed
   * in order as the tutorial progresses.
   */
  steps: Step[];
}

export interface ITutorialManager {
  /**
   * Creates an interactive Tutorial object that can be customized and run by the TutorialManager.
   * @param id The id used to track the tutorial.
   * @param label The label to use for the tutorial. If added to help menu, this would be the button text.
   * @param addToHelpMenu If true, the tutorial will be added as a button on the help menu. Default = True.
   */
  createTutorial(id: string, label: string, addToHelpMenu: boolean): ITutorial;

    /**
   * Launches a tutorial or series of tutorials one after another in order of the array provided.
   * If the array is empty or no tutorials have steps, this will be a no-op.
   * @param tutorials An array of tutorials or tutorialIDs to launch.
   */
  launch(...tutorials: ITutorial[]): Promise<void>;
  launch(...tutorialIDs: string[]): Promise<void>;
  launch(...tutorials: ITutorial[] | string[]): Promise<void>;

  /**
   * Removes the tutorial and its associated command from the application. 
   * @param tutorial The Tutorial object or the id of the tutorial object to remove
   */
  removeTutorial(tutorial: ITutorial): void;
  removeTutorial(tutorialID: string): void;
  removeTutorial(tutorial: string | ITutorial): void;

  readonly tutorials: Map<string, ITutorial>;
}
