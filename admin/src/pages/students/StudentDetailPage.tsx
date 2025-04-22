import Heading from "@/components/shared/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "@/routes/hooks";
import { ChevronLeftIcon, MailWarning, ShieldAlert, UserRoundCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetUserAnalytics, useRestrictUser, useUnblockUser } from "./queries/queries";
import { PieWithLabel } from "@/components/charts/pie-with-label";
import { convertToMonthDayCurrentFormat } from "@/utils/date";
import { AlertModal } from "@/components/shared/alert-modal";
import { useState } from "react";
import { ModelTypeProps, RestrictUserProps } from "@/types";
import { ToastContainer, toast } from 'react-toastify';
import { MessageTrendLineChart } from "@/components/charts/line-chart";


export default function StudentDetailPage() {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: ModelTypeProps | undefined;
  }>({
    message: "",
    type: undefined,
  });
  const { id } = useParams() ?? "";
  const router = useRouter();
  const successNotify = (message: string) => toast.success(message, { 
    autoClose: 1000,
    hideProgressBar: true,
  });
  const errorNotify = (message: string) => toast.error(message, { 
    autoClose: 1000,
    hideProgressBar: true,
  });

  // api functions using react query
  const { data: userData, isLoading } = useGetUserAnalytics(id || "");
  const unblockUser = useUnblockUser("Analytics");
  const restrictUser = useRestrictUser();

  const basicDetails = ["age", "email", "parent_email", "username", "phone"];

  const restrictUserPayload: RestrictUserProps = {
    type: "WARN_CHILD",
    email: userData?.user?.email ?? "",
    child_name: `${userData?.user?.firstname ?? ""} ${userData?.user?.lastname ?? ""}`,
    parent_email: userData?.user?.parent_email ?? "",
    id: userData?.user?.id ?? "",
  };
  
  const onConfirm = async (modelType?: ModelTypeProps) => {
    if (!modelType) {
      console.error("No model type provided");
      return;
    }
  
    try {
      switch (modelType) {
        case "warn":
          await restrictUser.mutateAsync(restrictUserPayload);
          console.log("Warning sent successfully!");
          successNotify("Warning sent successfully!")
          break;
  
        case "block":
          await restrictUser.mutateAsync({ ...restrictUserPayload, type: "INFORM_PARENT_AND_BLOCK" });
          console.log("User blocked and parent informed successfully!");
          successNotify("User blocked and parent informed successfully!")
          break;
  
        case "unblock":
          await unblockUser.mutateAsync(restrictUserPayload.id);
          successNotify("User unblocked successfully!")
          break;
  
        default:
          console.error("Unknown model type");
          errorNotify("Unknown model type")
      }
    } catch (error) {
      console.error("Error occurred:", error);
      errorNotify("There was a problem with your request. check log for more details");
    }
  
    setOpen(false);
  };
  

  const handleAlertModel = async (modelType: ModelTypeProps) => {
    let message = "";
    switch (modelType) {
      case "warn":
        message = "Send a warning email to this user?";
        break;
      case "block":
        message = "Block this user and inform their parent?";
        break;
      case "unblock":
        message = "Unblock this user?";
        break;
    }
    setAlertMessage((prev) => ({ ...prev, message, type: modelType }));
    setOpen(true);
  };

  if (isLoading) {
    return <h1>Loading!!!</h1>;
  }

  return (
    <div className="p-10">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onConfirm(alertMessage.type)}
        title={alertMessage.message}
        loading={isLoading}
        type={alertMessage.type}
      />
      <ToastContainer />
      <div className="flex items-center justify-between">
        <Heading
          title={"User Analytics"}
          messageCount={userData?.messages.total}
          flaggedCount={userData?.messages.flagged}
        />
        <div className="flex justify-end gap-3">
          <Button
            className="disabled:bg-gray-400 bg-yellow-400 hover:bg-yellow-600"
            onClick={() => handleAlertModel("warn")}
          >
            <MailWarning className="h-4 w-4" />
            <span className="ml-2">Send warning mail</span>
          </Button>
          {userData?.user?.is_flagged === true ? (
            <Button
              onClick={() => handleAlertModel("unblock")}
              className="disabled:bg-gray-400 bg-green-500 hover:bg-green-700"
            >
              <UserRoundCheck className="h-4 w-4" />
              <span className="ml-2">Unblock user</span>
            </Button>
          ) : (
            <Button
              onClick={() => handleAlertModel("block")}
              className="disabled:bg-gray-400 bg-red-400 hover:bg-red-600"
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="ml-2">Block & Inform parent</span>
            </Button>
          )}
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-4">
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-1">
          <Card className="bg-secondary h-full shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between font-bold">
              <div className="truncate">
                <p className="text-xl">{userData.user?.username}</p>
              </div>
              {userData.user?.is_online ? (
                <Badge className="bg-green-600">Active</Badge>
              ) : (
                <Badge className="bg-red-600">InActive</Badge>
              )}
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <img
                src={userData.user?.avatarImage}
                className="rounded-l-[40%] rounded-r-[40%]"
              />
            </CardContent>
          </Card>
          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="pb-2 text-center font-bold">Basic Info</CardHeader>
            <CardContent className="text-sm text-[12px]">
              <span className="flex gap-2">
                <p className="font-semibold text-gray-400 capitalize">Name: </p>
                <p>
                  {userData.user?.firstname}
                  {userData.user?.lastname}
                </p>
              </span>
              {basicDetails.map((detail, i) => (
                <div key={i} className="flex gap-2 truncate">
                  <p className="font-semibold text-gray-400 capitalize">{detail}: </p>
                  <p>{userData.user[detail]}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-1 bg-secondary custom-scroll overflow-y-scroll h-[81dvh] shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm lg:col-span-3">
          <CardContent className="mt-2">
            {userData?.messages.total > 0 ? (
            <div>
              <div className="grid grid-cols-2 gap-4">
              <PieWithLabel
                name="Emotion classification with ML Models"
                date={convertToMonthDayCurrentFormat(userData.user.createdAt)}
                data={userData.mlEmotionsObj}
              />
              <PieWithLabel
                name="Emotion classification with DL Models"
                date={convertToMonthDayCurrentFormat(userData.user.createdAt)}
                data={userData.dlEmotionsObj}
              />
            </div>
              <div className="mt-2">
              <MessageTrendLineChart 
              name="Message Activity"
              date={convertToMonthDayCurrentFormat(userData.user.createdAt)}
              data={userData.messageTrend}
            />
              </div>
            </div>
              ):(
                <div className="text-center mt-5">No Chats found!</div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}