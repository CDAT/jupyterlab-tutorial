import * as React from "react";
// tslint:disable-next-line
import ReactJoyride, { CallBackProps, STATUS } from "react-joyride";
import { Tutorial } from "./tutorial";
import { TutorialDefault, TutorialOptions } from "./constants";
import { ITutorial } from "./tokens";

interface ITutorialLauncherProps {
  initialTutorialOptions?: TutorialOptions;
}

interface ITutorialLauncherState {
  options: TutorialOptions;
  run: boolean;
  runOnStart: boolean;
  tutorial: Tutorial;
}

export class TutorialLauncher extends React.Component<
  ITutorialLauncherProps,
  ITutorialLauncherState
> {
  private _prevStatus: string;
  private _prevStepIndex: number;
  constructor(props: ITutorialLauncherProps) {
    super(props);
    this._prevStatus = STATUS.READY;
    this._prevStepIndex = -1;

    this.state = {
      options: props.initialTutorialOptions
        ? props.initialTutorialOptions
        : TutorialDefault.options,
      run: false,
      runOnStart: false,
      tutorial: null
    };

    this.handleJoyrideEvents = this.handleJoyrideEvents.bind(this);
    this.launchTutorial = this.launchTutorial.bind(this);
    this.launchTutorialGroup = this.launchTutorialGroup.bind(this);
    this.refreshTutorial = this.refreshTutorial.bind(this);
  }

  async launchTutorial(tutorial: Tutorial): Promise<void> {
    if (!tutorial) {
      throw new Error("The tutorial was null or undefined!");
    }
    if (!tutorial.hasSteps) {
      return;
    }

    // If a previous tutorial was launched, end it early and fire started signal for new tutorial
    if (this.state.run && this.state.tutorial) {
      await this.setState({ run: false });
    }

    // If options were specified in tutorial, set options as well
    if (tutorial.options) {
      await this.setState({
        options: tutorial.options,
        run: true,
        tutorial: tutorial
      });
    } else {
      await this.setState({
        run: true,
        tutorial: tutorial
      });
    }
  }

  launchTutorialGroup(tutorials: Tutorial[]): void {
    if (!tutorials || tutorials.length <= 0) {
      return;
    }
    if (tutorials.length === 1) {
      this.launchTutorial(tutorials[0]);
    } else {
      let callback = (tutorial: ITutorial) => {
        if (tutorial) {
          const newTutorials: Tutorial[] = tutorials.slice(1);
          this.launchTutorialGroup(newTutorials);
        }
        tutorial.finished.disconnect(callback);
      };
      this.launchTutorial(tutorials[0]);
      tutorials[0].finished.connect(callback);
    }
  }

  refreshTutorial(tutorial: Tutorial): void {
    this.setState({ tutorial: tutorial });
  }

  render(): JSX.Element {
    return (
      <div>
        <ReactJoyride
          callback={this.handleJoyrideEvents}
          continuous={this.state.options.continuous}
          debug={this.state.options.debug}
          disableCloseOnEsc={this.state.options.disableCloseOnEsc}
          disableOverlay={this.state.options.disableOverlay}
          disableOverlayClose={this.state.options.disableOverlayClose}
          disableScrolling={this.state.options.disableScrolling}
          hideBackButton={this.state.options.hideBackButton}
          locale={this.state.options.locale}
          run={this.state.run}
          scrollToFirstStep={this.state.options.scrollToFirstStep}
          showProgress={this.state.options.showProgress}
          showSkipButton={this.state.options.showSkipButton}
          spotlightClicks={this.state.options.spotlightClicks}
          steps={
            this.state.tutorial
              ? this.state.tutorial.steps
              : TutorialDefault.steps
          }
          styles={
            this.state.options.styles
              ? { options: this.state.options.styles }
              : { options: TutorialDefault.style }
          }
        />
      </div>
    );
  }

  private async handleJoyrideEvents(data: CallBackProps): Promise<void> {
    if (!data) {
      return;
    }
    const { status, step, index } = data;

    // Handle status changes when they occur
    if (status !== this._prevStatus) {
      this._prevStatus = status;
      if (status === STATUS.FINISHED) {
        this.state.tutorial._finished.emit(data);
        this.setState({ run: false });
      } else if (status === STATUS.SKIPPED) {
        this.state.tutorial._skipped.emit(data);
        this.setState({ run: false });
      } else if (status === STATUS.RUNNING) {
        this.state.tutorial._started.emit(data);
      } else if (status === STATUS.ERROR) {
        console.error(`An error occurred with the tutorial at step: ${step}`);
      }
    }

    // Emit step change event
    if (status === STATUS.RUNNING && index !== this._prevStepIndex) {
      this._prevStepIndex = index;
      this.state.tutorial._stepChanged.emit(data);
    }
  }
}
