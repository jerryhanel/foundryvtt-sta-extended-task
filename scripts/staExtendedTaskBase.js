class STAExtendedTaskGmJerry {
  static ID = 'sta-extended-task-gmjerry';
  static showBox = false;
  static taskInfo = new STAExtendedTaskInfo();
  
  static FLAGS = {
    TODOS: 'none'
  }
  
  static TEMPLATES = {
    EXTTASK: `../templates/extended-task-sheet-gmjerry.html`
  }
  
  static log(force, ...args) {  
    const shouldLog = force || (game?.modules && game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID));

    if (shouldLog) {
      console.log(this.ID, '|', ...args);
    }
  }
}

//CONFIG.debug.hooks = true;
STAExtendedTaskGmJerry.log(true, "STA Extended Tasks BASE, loaded.");

Hooks.on("init", () => {
  STAExtendedTaskGmJerry.log(true, "Initializing module...");
});

Hooks.on("ready", () => {
  STAExtendedTaskGmJerry.log(true, "Initialization complete!");
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(STAExtendedTaskGmJerry.ID);
});
