import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';


/**
 * Initialization data for the jupyterlab_tutorial extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_tutorial',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_tutorial is activated!');
  }
};

export default extension;
