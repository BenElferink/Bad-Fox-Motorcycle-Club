import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import MultipleLinks from './MultipleLinks';
import SingleLink from './SingleLink';
import collectionsData from '@/data/collections.json';

export const navCollections = collectionsData
  .map((x) => ({
    label: x.name,
    url: x.policyId ? `https://www.jpg.store/collection/${x.policyId}` : '',
    logoSrc: x.image,
    deprecated: x.deprecated,
  }))
  .filter((x) => !!x);

export const navTokens = [
  { label: 'BANK', logoSrc: '/media/tokens/bank.png', url: 'https://bankerlabs.io' },
  { label: 'C4', logoSrc: '/media/tokens/c4.png', url: 'https://cportal.io/nft-staking' },
  { label: 'CSWAP', logoSrc: '/media/tokens/cswap.png', url: '' }, // https://app.cswap.fi/nftstaking
  { label: 'HEXO', logoSrc: '/media/tokens/hexo.png', url: '' }, // https://app.cardanolands.com/collection/bfmc
  { label: 'IDP', logoSrc: '/media/tokens/idp.png', url: 'https://dapp.ada-anvil.io' },
  { label: 'SCALE', logoSrc: '/media/tokens/scale.png', url: '' }, // https://pangolin.ada-anvil.io
];

export const limitedEvents = [
  { label: '2D Trade-In', path: '/trade' },
  { label: '3D Previews', path: '/sneak3d' },
  { label: '3D Reservations', path: '' },
];

const Navigation = () => {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openDropdownName, setOpenDropdownName] = useState('');

  useEffect(() => {
    if (!openDropdownName) {
      setIsNavOpen(false);
    }
  }, [openDropdownName]);

  return (
    <nav className='flex items-center'>
      <button
        type='button'
        onClick={() => setIsNavOpen((prev) => !prev)}
        className='xl:hidden flex items-center p-1 mx-1 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-gray-600 focus:ring-2'
      >
        <Bars3Icon className='w-7 h-7' />
      </button>

      <div className={(isNavOpen ? 'block' : 'hidden') + ' xl:block'}>
        <ul className='flex flex-col xl:flex-row absolute right-0 xl:static overflow-auto xl:overflow-visible max-h-[80vh] xl:max-h-auto w-80 xl:w-auto mt-8 xl:mt-0 p-4 bg-gray-900 border xl:border-0 rounded-lg border-gray-700 xl:space-x-8'>
          <li
            onClick={() => {
              if (router.pathname === '/') window.scrollTo({ top: 0 });
              setIsNavOpen(false);
            }}
          >
            <SingleLink label='Home' path={'/'} />
          </li>
          <li onClick={() => setIsNavOpen(false)} className='text-orange-300'>
            <SingleLink label='Lab/Tools' url='https://labs.badfoxmc.com' />
          </li>
          <li>
            <MultipleLinks title='Collections' links={navCollections} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks title='Staking' links={navTokens} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks title='Events' links={limitedEvents} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
        </ul>
      </div>

      <div className='hidden md:block'>
        <Link
          href='/wallet'
          onClick={() => window.scroll({ top: 0, left: 0 })}
          className={
            'mx-2 p-4 rounded-lg text-sm ' +
            (router.pathname === '/wallet' ? 'bg-gray-700 text-white' : 'bg-gray-900 hover:bg-gray-700 hover:text-white')
          }
        >
          Wallet
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
