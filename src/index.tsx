import { render } from 'preact';
import { Home } from './components/home';
import { SMM } from './types/SMM';

// https://github.com/flathub/linux-store-frontend/issues/292
// https://flathub.org/api/v1/apps/collection/recently-updated
// https://flathub.org/api/v1/apps/org.sugarlabs.AbacusActivity
// https://flathub.org/api/v1/apps/collection/popular

export const load = (smm: SMM) => {
  console.info('Flathub plugin loaded!');

  smm.MenuManager.addMenuItem({
    id: 'flathub',
    label: 'Flathub',
    fontSize: 16,
    render: async (smm: SMM, root: HTMLElement) =>
      render(<Home smm={smm} />, root),
  });
};

export const unload = (smm: SMM) => {
  console.info('Flathub plugin unloaded!');
  smm.MenuManager.removeMenuItem('flathub');
};
