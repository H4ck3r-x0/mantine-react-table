import React, { useMemo, useState } from 'react';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

const Example = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching, isError } = useQuery(
    ['table-data', columnFilters, globalFilter, pagination, sorting],
    async () => {
      const url = new URL('/api/data', 'https://www.material-react-table.com');
      url.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      const { data: axiosData } = await axios.get(url.href);
      return axiosData;
    },
    { keepPreviousData: true },
  );

  const columns = useMemo(
    () => [
      {
        header: 'First Name',
        id: 'firstName',
      },
      {
        header: 'Last Name',
        id: 'lastName',
      },
      {
        header: 'Address',
        id: 'address',
      },
      {
        header: 'State',
        id: 'state',
      },
      {
        header: 'Phone Number',
        id: 'phoneNumber',
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data?.data ?? []}
      enableColumnFilterChangeMode={false}
      manualFiltering
      manualPagination
      manualSorting
      muiTableToolbarAlertBannerProps={
        isError
          ? {
              severity: 'error',
              title: 'Error loading data',
              icon: true,
            }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      rowCount={data?.meta?.totalRowCount ?? 0}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
    />
  );
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = () => (
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
