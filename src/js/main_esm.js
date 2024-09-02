import "@/components/init.js";
import "@/js/tabs/index.js";

import "nouislider/dist/nouislider.css";
import "@/css/slider.css";

CONFIGURATOR.version = __APP_VERSION__;
CONFIGURATOR.gitChangesetId = __COMMIT_HASH__;

if (import.meta.hot) {
  import.meta.hot.data.serial = serial;

  import.meta.hot.on("vite:beforeFullReload", () => {
    import.meta.hot.data.serial.disconnect();
  });
}
