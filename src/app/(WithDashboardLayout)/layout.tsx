import { AppSidebar } from "@/components/modules/dashboard/sidebar/app-sidebar";
import { SiteHeader } from "@/components/modules/dashboard/sidebar/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="w-[80%]">
        <SiteHeader />
        <header className="flex  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb></Breadcrumb>
          </div>
        </header>
        <div className="p-4 pt-0 min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
