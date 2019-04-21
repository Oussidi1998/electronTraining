const { app, BrowserWindow, Menu, ipcMain } = require("electron");

let mainWindow;
let addWindow;

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile("main.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("close", function() {
    app.quit();
  });
}

function createAddWindow() {
  // Create the browser window.
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWindow.loadFile("add.html");
  addWindow.on("close", function() {
    addWindow = null;
  });
}

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "ouvrir"
      },
      {
        label: "nouveau",
        accelarator: process.platform == "darwin" ? "Command+n" : "Ctrl+n"
      },
      {
        label: "enregistrer",
        accelarator: process.platform == "darwin" ? "Command+s" : "Ctrl+s"
      },
      {
        label: "enregistrer sous",
        accelarator:
          process.platform == "darwin" ? "Command+alt+s" : "Ctrl+alt+s"
      },
      {
        label: "exit",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "options",
    submenu: [
      {
        label: "add item",
        accelarator: process.platform == "darwin" ? "Command+ +" : "Ctrl+ +",
        click() {
          createAddWindow();
        }
      },
      {
        label: "delete all items",
        click() {
          mainWindow.webContents.send("item:clear");
        }
      }
    ]
  }
];

// send item to main html page when we click on add item
ipcMain.on("item:add", function(e, item) {
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// check if production mode env
// if (process.env.NODE_ENV !== "production") {
//   mainMenuTemplate.push({
//     label: "Developers Tools",
//     submenu: [
//       {
//         label: "Toggle DevTools",
//         accelarator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
//         click(item, focusedWindow) {
//           focusedWindow.toggleDevTools();
//         }
//       },
//       {
//         role: "reload"
//       }
//     ]
//   });
// }

// lunch the app
app.on("ready", createMainWindow);
