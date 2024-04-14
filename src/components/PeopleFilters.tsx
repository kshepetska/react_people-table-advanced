import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';

import { SearchParams, getSearchWith } from '../utils/searchHelper';
import { SearchLink } from './SearchLink';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const FEMALE = searchParams.get('sex') === 'f';
  const MALE = searchParams.get('sex') === 'm';

  const query = searchParams.get('query') || '';
  const sex = searchParams.get('sex') || null;
  const centuries = searchParams.getAll('centuries') || [];

  const setSearchWith = useCallback(
    (params: SearchParams) => {
      const search = getSearchWith(searchParams, params);

      setSearchParams(search);
    },
    [searchParams, setSearchParams],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWith({ query: event.target.value || null });
  };

  const getNewCenturies = (newCentury: string) => {
    const newCenturies = centuries.includes(newCentury)
      ? centuries.filter(century => century !== newCentury)
      : [...centuries, newCentury];

    return newCenturies;
  };

  const handleSortBySex = (gender: string | null) => {
    if (gender === 'f' || gender === 'm') {
      setSearchWith({ sex: gender });
    } else {
      setSearchWith({});
    }
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <SearchLink
          params={{ sex: null }}
          className={cn({ 'is-active': !sex })}
          onClick={() => handleSortBySex(null)}
        >
          All
        </SearchLink>

        <SearchLink
          params={{ sex: 'm' }}
          className={cn({ 'is-active': MALE })}
          onClick={() => handleSortBySex('m')}
        >
          Male
        </SearchLink>

        <SearchLink
          params={{ sex: 'f' }}
          className={cn({ 'is-active': FEMALE })}
          onClick={() => handleSortBySex('f')}
        >
          Female
        </SearchLink>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={handleQueryChange}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>
      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {['16', '17', '18', '19', '20'].map(century => (
              <SearchLink
                key={century}
                params={{ centuries: getNewCenturies(century) }}
                className={cn('button mr-1', {
                  'is-info': centuries.includes(century),
                })}
              >
                {century}
              </SearchLink>
            ))}
          </div>

          <div className="level-right ml-4">
            <SearchLink
              params={{ centuries: [] }}
              className={cn('button mr-1 is-success', {
                'is-outlined': centuries.length,
              })}
              data-cy="centuryALL"
            >
              All
            </SearchLink>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <SearchLink
          params={{
            sex: [],
            query: [],
            centuries: [],
          }}
          className={cn('button is-link is-outlined is-fullwidth')}
        >
          Reset all filters
        </SearchLink>
      </div>
    </nav>
  );
};
