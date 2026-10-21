import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'PulseUI',
    brandUrl: 'https://github.com/eloriente/pulseui-react',
    brandImage: 'wordmark.svg',
    brandTarget: '_self',
  }),
});
