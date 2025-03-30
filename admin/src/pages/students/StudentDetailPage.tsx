import Heading from '@/components/shared/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from '@/routes/hooks';
import { ChevronLeftIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGetSingleUser } from './queries/queries';

export default function StudentDetailPage() {
  const { id } = useParams() ?? "";
  const router = useRouter();
  const { data: user, isLoading } = useGetSingleUser(id || "");
  const basicDetails = ["age", "email", "parent_email", "username", "phone"]
  
  if (isLoading) {
    return <h1>Loading!!!</h1>;
  }
  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <Heading title={'User Analytics'} />
        <div className="flex justify-end gap-3">
          {/* <Button>
            <ShareIcon className="h-4 w-4" />
            Share
          </Button> */}
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      <div className="grid  grid-cols-1 gap-6 py-6 lg:grid-cols-4">
        <div className=" col-span-1 flex flex-col gap-6 lg:col-span-1">
          <Card className="bg-secondary  shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between font-bold">
              <p className="text-xl">{user?.firstname}{user?.lastname}</p>
              {user?.is_online ? (
                <Badge className="bg-green-600">Active</Badge>
              ):(
                <Badge className="bg-red-600">InActive</Badge>
              )}
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <img
                src={user?.avatarImage}
                className="rounded-l-[40%] rounded-r-[40%] "
              />
            </CardContent>
          </Card>
          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="pb-2 text-center font-bold">
              Basic Info
            </CardHeader>
            <CardContent className="text-sm text-[12px]">
              {basicDetails.map((detail, i) => (
                <span key={i} className='flex gap-2'>
                  <p className='font-semibold text-gray-400 capitalize'>{detail}: </p> 
                  <p >{user[detail]}</p>
                </span>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* contact information  */}
        <Card className=" col-span-1 bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm lg:col-span-3">
          <CardHeader className="text-xl font-bold">
            Contact Information
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="font-bold text-black">First Name</p>
                <p className="text-muted-foreground">John</p>
              </div>
              <div>
                <p className="font-bold text-black">Last Name</p>
                <p className="text-muted-foreground">Doe</p>
              </div>
              <div>
                <p className="font-bold text-black">User Name</p>
                <p className="text-muted-foreground">John</p>
              </div>
              <div>
                <p className="font-bold text-black">Sex</p>
                <p className="text-muted-foreground">Male</p>
              </div>
              <div>
                <p className="font-bold text-black">Position</p>
                <p className="text-muted-foreground">Super Admin</p>
              </div>
              <div>
                <p className="font-bold text-black">Department</p>
                <p className="text-muted-foreground">Kutubi</p>
              </div>
              <div>
                <p className="font-bold text-black">Contact Email</p>
                <p className="text-muted-foreground">ElonMusk@x.com</p>
              </div>
              <div>
                <p className="font-bold text-black">Contact Number</p>
                <p className="text-muted-foreground">Nil</p>
              </div>
              <div>
                <p className="font-bold text-black">City</p>
                <p className="text-muted-foreground">Dubai</p>
              </div>
              <div>
                <p className="font-bold text-black">Language</p>
                <p className="text-muted-foreground">English</p>
              </div>
              <div>
                <p className="font-bold text-black">Date of Birth</p>
                <p className="text-muted-foreground">26/4/1989</p>
              </div>
              <div>
                <p className="font-bold text-black">Social Media</p>
                <p className="text-muted-foreground">x</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
