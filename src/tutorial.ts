import { Placement, Step, CallBackProps } from "react-joyride";
import { Menu } from "@phosphor/widgets";
import { Signal, ISignal } from "@phosphor/signaling";
import { TutorialDefault, TutorialOptions, LocaleOptions } from "./constants";
import { ITutorial } from "./tokens";

export class Tutorial implements ITutorial {
  id: string;
  label: string;

  _skipped: Signal<this, CallBackProps>;
  _finished: Signal<this, CallBackProps>;
  _started: Signal<this, CallBackProps>;
  _stepChanged: Signal<this, CallBackProps>;

  private _command: string;
  private _menuButtons: Menu.IItem[];
  private _options: TutorialOptions;
  private _steps: Step[];
  static DEFAULT_LOCALE: LocaleOptions;

  constructor(
    id: string,
    command: string,
    label?: string,
    options?: TutorialOptions
  ) {
    this._command = command;
    this._skipped = new Signal<this, CallBackProps>(this);
    this._finished = new Signal<this, CallBackProps>(this);
    this.id = id;
    this.label = label;
    this._menuButtons = Array<Menu.IItem>();
    this._options = { ...options, ...TutorialDefault.options };
    this._started = new Signal<this, CallBackProps>(this);
    this._stepChanged = new Signal<this, CallBackProps>(this);
    this._steps = new Array<Step>();

    this.addStep = this.addStep.bind(this);
    this.addTutorialToMenu = this.addTutorialToMenu.bind(this);
    this.createAndAddStep = this.createAndAddStep.bind(this);
    this.removeTutorialFromMenu = this.removeTutorialFromMenu.bind(this);
    this.removeStep = this.removeStep.bind(this);
  }

  get skipped(): ISignal<this, CallBackProps> {
    return this._skipped;
  }

  get finished(): ISignal<this, CallBackProps> {
    return this._finished;
  }
  get hasSteps(): boolean {
    return this.steps.length > 0;
  }

  get menuButtons(): Menu.IItem[] {
    return this._menuButtons;
  }

  get options(): TutorialOptions {
    return this._options;
  }

  set options(options: TutorialOptions) {
    this._options = options;
  }

  get started(): ISignal<this, CallBackProps> {
    return this._started;
  }

  get stepChanged(): ISignal<this, CallBackProps> {
    return this._stepChanged;
  }

  get steps(): Step[] {
    return this._steps;
  }

  set steps(steps: Step[]) {
    this._steps = steps;
  }

  addStep(step: Step): void {
    if (step) {
      this.steps.push(step);
    }
  }

  addTutorialToMenu(menu: Menu, buttonOptions?: Menu.IItemOptions): Menu.IItem {
    const btnOptions = {
      args: {},
      command: this._command
    };
    const menuButton: Menu.IItem = menu.addItem(
      buttonOptions ? buttonOptions : btnOptions
    );
    this._menuButtons.push(menuButton);
    return menuButton;
  }

  createAndAddStep(
    target: string,
    content: string,
    placement?: Placement,
    title?: string
  ): Step {
    const newStep: Step = {
      title,
      placement,
      target,
      content
    };
    this.addStep(newStep);
    return newStep;
  }

  removeTutorialFromMenu(menu: Menu): Menu.IItem[] {
    if (
      !menu ||
      !menu.items ||
      menu.items.length <= 0 ||
      this._menuButtons.length <= 0
    ) {
      return; // No-op if menu or buttons list are empty
    }

    let menuItems: Set<Menu.IItem> = new Set(menu.items);
    let tutorialItems: Set<Menu.IItem> = new Set(this._menuButtons);
    let intersection: Set<Menu.IItem> = new Set(
      [...menuItems].filter(item => tutorialItems.has(item))
    );
    const itemsToRemove: Menu.IItem[] = Array.from(intersection);
    itemsToRemove.forEach((item: Menu.IItem, idx: number) => {
      menu.removeItem(item);
      this._menuButtons.splice(idx, 1);
    });
    return itemsToRemove;
  }

  removeStep(index: number): Step {
    if (index < 0 || index >= this.steps.length) {
      return;
    }
    return this.steps.splice(index, 1)[0];
  }
}
