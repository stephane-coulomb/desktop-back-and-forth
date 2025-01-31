// This script is intended for users of Plasma's KWin 6. It allows to:
//  - Switch to a Virtual Desktop using some shortcut, and also to switch back
//    to the previously active desktop using the same shortcut.
//  - Move a window to a desktop using some shortcut, and also to move a window
//    to the previously active desktop using the same shortcut.
//
//  - It works on a range of at most 10 Virtual Desktops,
//    named '1,2,3,..,9,10'.

var previousDesktopName = workspace.desktop;

workspace.currentDesktopChanged.connect(desktop => {
    previousDesktopName = desktop.name;

    // Deletes desktop if it is empty.
    // Empty desktops can be an eye sore for users of the Pager widget.
    // Users who need them can safely delete this code.
    if (isDesktopEmpty(desktop)) {
        workspace.removeDesktop(desktop);
    }
    //
});

// Empty of so-called "Normal" windows.
function isDesktopEmpty(desktop) {
    var doesDesktopContainNormalWindow = false;
    for (const window of workspace.stackingOrder) {
        if (window.normalWindow) {
            for (const d of window.desktops) {
                if (d === desktop) {
                    doesDesktopContainNormalWindow = true;
                }
            }
        }
    }
    return !doesDesktopContainNormalWindow;
}

function switchToDesktop(targetDesktopName) {
    var idx = createDesktopIfNeeded(targetDesktopName);

    // Fixes an issue where the active window is not as expected
    var previouslyActiveWindow = tryGetPreviouslyActiveWindow(workspace.desktops[idx]);

    workspace.currentDesktop = workspace.desktops[idx];

    // The actual fix
    if (previouslyActiveWindow != null) {
        workspace.activeWindow = previouslyActiveWindow;
    }
}

function switchToDesktopBackAndForth(targetDesktopName) {
    switchToDesktop(
        workspace.currentDesktop.name == targetDesktopName
            ? previousDesktopName
            : targetDesktopName);
}

function moveWindowToDesktop(windowToMove, targetDesktopName) {
    var idx = createDesktopIfNeeded(targetDesktopName);
    windowToMove.desktops = [workspace.desktops[idx]];
}

// Returns the index of the target desktop, after creating it if it did not exist
function createDesktopIfNeeded(targetDesktopName) {
    var idx = 0;
    while (idx < workspace.desktops.length
        && workspace.desktops[idx].name <= targetDesktopName) {
        if (workspace.desktops[idx].name == targetDesktopName) {
            // Desktop already exists. Return its index.
            return idx;
        }
        idx++;
    }
    // Create the desktop at the right position (so that the desktops are
    // correctly ordered)
    workspace.createDesktop(idx, targetDesktopName);
    return idx;
}

function moveActiveWindowToDesktopBackAndForth(targetDesktopName) {
    const activeWindow = workspace.activeWindow;
    // We only handle the most basic case
    if (activeWindow == null || !activeWindow.normalWindow || activeWindow.desktops.length != 1) {
        return;
    }
    moveWindowToDesktop(
        activeWindow,
        workspace.currentDesktop.name == targetDesktopName ? previousDesktopName : targetDesktopName
    );
    // Fixes an issue where no window is in focus after moving a window
    var w = tryGetPreviouslyActiveWindow(workspace.currentDesktop);
    if (w != null) {
        workspace.activeWindow = w;
    }
}

function tryGetPreviouslyActiveWindow(currentDesktop) {
    // The stack of windows is ordered from older to newer
    for (var i = workspace.stackingOrder.length - 1; i >= 0; i--) {
        if (workspace.stackingOrder[i].desktops.includes(currentDesktop)) {
            return workspace.stackingOrder[i];
        }
    }
    return null;
}

// Default shortcuts that should be automatically registered when installing the
// script
const shift_number = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
for (var dn = 1; dn < 11; dn++) {
    var shortcut = dn < 10 ? dn : 0;
    registerShortcut(
        "Switch to Desktop (and back) " + dn,
        "Switch to Desktop (and back) " + dn,
        "Meta+" + shortcut,
        (i => (() => switchToDesktopBackAndForth(i)))(dn)
    );
    registerShortcut(
        "Move Window to Desktop (and back) " + dn,
        "Move Window to Desktop (and back) " + dn,
        "Meta+" + shift_number[dn - 1],
        (i => (() => moveActiveWindowToDesktopBackAndForth(i)))(dn)
    );
}