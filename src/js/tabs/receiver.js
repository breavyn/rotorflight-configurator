import { mount, unmount } from "svelte";

// import { windowWatcherUtil } from "@/js/utils/window_watchers.js";
import Receiver from "@/tabs/receiver/Receiver.svelte";

const tab = {
  tabName: "receiver",
  svelteComponent: null,

  get isDirty() {
    return this.svelteComponent?.isDirty();
  },

  initialize(callback) {
    const target = document.querySelector("#content");
    target.innerHTML = "";
    this.svelteComponent = mount(Receiver, { target });

    GUI.content_ready(callback);
  },

  cleanup(callback) {
    if (this.svelteComponent) {
      unmount(this.svelteComponent);
      this.svelteComponent = null;
    }

    callback?.();
  },

  save(callback) {
    if (this.svelteComponent) {
      this.svelteComponent.onSave().finally(callback);
    } else {
      callback?.();
    }
  },

  revert(callback) {
    this.svelteComponent?.onRevert();
    callback?.();
  },
};

// tab.temp = function (callback) {
//   const self = this;
//
//
//   function process_html() {
//     const bindBtn = $(".bind_btn");
//     const stickBtn = $(".sticks_btn");
//     const saveBtn = $(".save_btn");
//     const rebootBtn = $(".reboot_btn");
//     const revertBtn = $(".revert_btn");
//
//     function updateButtons(reboot) {
//       let enableSave = true;
//
//       if (FC.TELEMETRY_CONFIG.telemetry_sensors_list.length > 40) {
//         enableSave = false;
//       }
//
//       if (reboot) self.needReboot = true;
//       if (self.saveButtons) self.isDirty = true;
//       if (self.saveButtons || self.bindButton || self.stickButton) {
//         $(".tab-receiver").removeClass("toolbar_hidden");
//         bindBtn.toggle(self.bindButton);
//         stickBtn.toggle(self.stickButton);
//         saveBtn.toggle(!self.needReboot && self.saveButtons && enableSave);
//         rebootBtn.toggle(self.needReboot && self.saveButtons && enableSave);
//         revertBtn.toggle(self.saveButtons);
//         $(".disabled_save_reboot_btn").toggle(self.saveButtons && !enableSave);
//       }
//     }
//
//     //// Virtual Stick
//
//     $("a.sticks").click(function () {
//       const windowWidth = 370;
//       const windowHeight = 510;
//
//       // use a fully qualified url so nw doesn't look on the filesystem
//       // when using the vite dev server
//       const location = new URL(window.location.href);
//       location.pathname = "/src/tabs/receiver_msp.html";
//       nw.Window.open(
//         location.toString(),
//         {
//           id: "receiver_msp",
//           always_on_top: true,
//           max_width: windowWidth,
//           max_height: windowHeight,
//         },
//         function (createdWindow) {
//           createdWindow.resizeTo(windowWidth, windowHeight);
//           createdWindow.window.i18n = i18n;
//
//           // Give the window a callback it can use to send the channels (otherwise it can't see those objects)
//           createdWindow.window.setRawRx = function (channels) {
//             if (CONFIGURATOR.connectionValid && GUI.active_tab != "cli") {
//               const data = [];
//               FC.RC_MAP.forEach((axis, channel) => {
//                 data[axis] = channels[channel];
//               });
//               mspHelper.setRawRx(data);
//               return true;
//             } else {
//               return false;
//             }
//           };
//
//           DarkTheme.isDarkThemeEnabled(function (isEnabled) {
//             windowWatcherUtil.passValue(
//               createdWindow.window,
//               "darkTheme",
//               isEnabled,
//             );
//           });
//         },
//       );
//     });
//
//     //// Bind button
//
//     $("a.bind").click(function () {
//       MSP.send_message(MSPCodes.MSP2_BETAFLIGHT_BIND);
//       GUI.log(i18n.getMessage("receiverButtonBindMessage"));
//     });
//     GUI.content_ready(callback);
//   }
// };

TABS[tab.tabName] = tab;

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule && GUI.active_tab === tab.tabName) {
      TABS[tab.tabName].initialize();
    }
  });

  import.meta.hot.dispose(() => {
    tab.cleanup();
  });
}
