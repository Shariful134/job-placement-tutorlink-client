import TutorBookingsHistoryComponents from "@/components/modules/booking/TutorBookingsHistoryComponents";

import TChartAreaInteractive from "@/components/modules/dashboard/sidebar/TChatrtArea";
import { TSectionCards } from "@/components/modules/dashboard/sidebar/tsection-cards";

const UserDashboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <TSectionCards />
          <div className="px-4 lg:px-6">
            <TChartAreaInteractive />
          </div>
          <TutorBookingsHistoryComponents />
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

{
  /* <UpdateProfile></UpdateProfile> */
}
{
  /* <TutorBookingsHistoryComponents /> */
}
