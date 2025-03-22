import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    // accessorKey: 'firstname + lastname',
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    header: 'NAME',
  },
  {
    accessorKey: 'username',
    header: 'USERNAME'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'age',
    header: 'AGE'
  },
  {
    id: 'is_flagged', 
    accessorFn: (row) => row.is_flagged,  // Accessor function for raw value
    header: 'STATUS',
    cell: ({ row }) => (
      row.getValue('is_flagged') ? (
        <span className="bg-red-500 text-white p-1 rounded">Blocked</span>
      ) : (
        <span className="bg-green-500 text-white p-1 rounded">Active</span>
      )
    )
  },
  {
    accessorKey: 'flag_count',
    header: 'FLAG COUNT'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
