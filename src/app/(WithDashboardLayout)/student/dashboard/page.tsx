import StudentBookingsComponents from "@/components/modules/booking/StudentBookingsComponents";
import ChartAreaInteractive from "@/components/modules/dashboard/sidebar/chart-area-interactive";

import { SectionCards } from "@/components/modules/dashboard/sidebar/section-cards";

const UserDashboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <StudentBookingsComponents />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
