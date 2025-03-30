import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Employee } from '@/constants/data';
import { BarChart2, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from '@/routes/hooks';
import { useState } from 'react';
import { useBlockUser, useDeleteUser, useUnblockUser } from '../../queries/queries';
import { cn } from '@/lib/utils';

interface CellActionProps {
  data: Employee;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const deleteUser = useDeleteUser();

  const toggleBlockUser = (id: string, isBlocked: boolean) => {
    if (isBlocked) {
      unblockUser.mutate(id);
    } else {
      blockUser.mutate(id);
    }
  };

  const onConfirm = async () => deleteUser.mutate(data._id);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => router.push(`/user/details/${data._id}`)}
          >
            <BarChart2 className="mr-2 h-4 w-4" /> Analytics
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(data.is_flagged ? 'text-green-500' : 'text-yellow-500', 'cursor-pointer')}
            onClick={() => toggleBlockUser(data._id, data.is_flagged)}
          >
            <Edit className="mr-2 h-4 w-4" /> {data.is_flagged ? 'Unblock' : 'Block'}
          </DropdownMenuItem>
          <DropdownMenuItem className='text-red-500 cursor-pointer' onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
