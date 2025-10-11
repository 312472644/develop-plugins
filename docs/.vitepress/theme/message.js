import { createDiscreteApi, lightTheme } from 'naive-ui';

const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: {
      theme: lightTheme,
    },
  }
);

export { message, notification, dialog, loadingBar, modal };
