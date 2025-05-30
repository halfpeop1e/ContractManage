import type { App } from 'vue';
import { getCurrentTime } from '../utils/time';

export default {
  install(app: App) {
    app.config.globalProperties.$getCurrentTime = getCurrentTime;
  }
};
