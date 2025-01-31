# Desktop back-and-forth
KWin script to switch, or move window, to previously active virtual desktop.

This script is intended for users of Plasma's KWin 6. It allows to:
 - Switch to a Virtual Desktop using some shortcut, and also to switch back
   to the previously active desktop using the same shortcut.
 - Move a window to a desktop using some shortcut, and also to move a window
   to the previously active desktop using the same shortcut.
   
 - It works on a range of at most 10 Virtual Desktops,
   named '1,2,3,..,9,10'.
   
## Installation
- From the directory where you want to install, run
   ```
     git clone https://github.com/stephane-coulomb/desktop-back-and-forth.git
   ```
- then run
   ```
     kpackagetool6 --type=KWin/Script --install ./package/
   ```
- The script can then be activated in Plasma's System Settings application, in 'Window Management'>'KWin Scripts'

## Shortcuts and usage
The shortcuts can be modified in Plasma's System Settings application, in 'Keyboard'>'Shortcuts'>'KWin'.

- **Switch to Desktop (and back) i** (i=0..9)
  - Default is `Meta+i`.
  - Creates Virtual Desktop i (except for i=0, which refers to Virtual Desktop 10) if it does not exist and
    - switches to Virtual Desktop i from another Virtual Desktop **or**,
    - from Virtual Desktop i, switches to the previously active Virtual Desktop.
- **Move Window to Desktop (and back) i**
  - Default is `Meta+Shift+i`.
  - Creates Virtual Desktop i if it does not exist and
    - moves the currently active window to Desktop i from another Virtual Desktop **or**,
    - from Virtual Desktop i, moves the currenctly active window to the previously active Virtual Desktop.

As noted above, this script creates the target Virtual Desktop if it does not exist.
Similarly, it deletes empty desktops upon leaving them. This is convenient for users of Plasma's Pager widget, which does not offer the option to hide empty Virtual Desktops from the view.

This script also handles window activation, as follows:
- When switching to a non-empty Virtual Desktop, it activates the window in that desktop that was the most recently activated.
- When moving a window to another Virtual Desktop, it activates the most recently activated window in the current desktop.

So, for instance, from a starting situation where there is only Virtual Desktop 1, with only two windows,
- Pressing `Meta+2` creates Virtual Desktop 2 and switches to it.
- Pressing `Meta+2` again (or `Meta+1`) switches back to Virtual Desktop 1, deletes Virtual Desktop 2 (because it is empty), and the active window in Virtual Desktop 1 should be unchanged. Note that even if none of the two windows were active before leaving Virtual Desktop 1, one of them will be active when returning to it.
- Pressing `Meta+Shift+2` creates Virtual Desktop 2 again, moves the active window to it, and activates the remaining window.
- Pressing `Meta+Shift+2` again moves that window to Virtual Desktop 2.
- Pressing `Meta+2` moves to Virtual Desktop 2 and deletes Virtual Desktop 1, because it is now empty.


The starting point for this script was [desktop-auto-back-and-forth](https://github.com/Sporif/desktop-auto-back-and-forth) by @Sporif.
