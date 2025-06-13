export interface Navigation {
  isScrollable: boolean;
  path: string;
  label: string;
  icon?: string;
  target?: '_blank' | '_self';
}

export const SectionIds = {
  HOME: 'home',
  ACCOUNT: 'account',
  DATA_FEE: 'data_fee',
};

const navigations: Navigation[] = [
  {
    isScrollable: false,
    path: `#${SectionIds.HOME}`,
    label: 'nav.home',
    target: '_self',
  },
  {
    isScrollable: false,
    path: `/account`,
    label: 'nav.account',
    target: '_self',
  },
  {
    isScrollable: false,
    path: `#${SectionIds.DATA_FEE}`,
    label: 'nav.data_feed',
    target: '_self',
  },
];

export default navigations;
