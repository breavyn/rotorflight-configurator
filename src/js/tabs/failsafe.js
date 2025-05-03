import { mount, unmount } from "svelte";

import Failsafe from "@/tabs/failsafe/Failsafe.svelte";

const tab = {
  tabName: "failsafe",
  svelteComponent: null,
  isDirty: false,

  cleanup(callback) {
    if (this.svelteComponent) {
      unmount(this.svelteComponent);
      this.svelteComponent = null;
    }

    callback?.();
  },
};

tab.initialize = function (callback) {
  const target = document.querySelector("#content");
  target.innerHTML = "";
  this.svelteComponent = mount(Failsafe, { target });

  GUI.content_ready(callback);

  return;
};

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
