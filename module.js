// import { STAExtendedTaskSheetGMJerry } from "./scripts/extended-task-sheet-gmjerry.mjs";
// 
// console.log("Hello World! This code runs immediately when the file is loaded.");
// 
// Hooks.on("init", function() {
//   console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
// 
//   // Register sheet application classes
//   Actors.registerSheet("sta.STAExtendedTaskSheet.GMJerry", STAExtendedTaskSheetGMJerry, { makeDefault: false });
// });
// 
// Hooks.on("ready", function() {
//   console.log("This code runs once core initialization is ready and game data is available.");
// });

console.log("sta-gmjerry-extended-task | STA Extended Tasks by GM Jerry, loaded.");

Hooks.on("init", () => {
  console.log("sta-gmjerry-extended-task | Initializing module...");
});

Hooks.on("ready", () => {
  console.log("sta-gmjerry-extended-task | Initialization complete!");
});