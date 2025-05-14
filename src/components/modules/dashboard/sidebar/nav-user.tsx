"use client";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavUser({}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-gray-200 dark:bg-gray-800  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
            >
              <span className="dark:text-gray-300 truncate font-semibold">
                {user?.userEmail}
              </span>

              <Avatar className="h-8 w-8 rounded-lg "></Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight dark:text-gray-300"></div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger> */}
          {/* <DropdownMenuContent
            className="dark:bg-gray-800 w-[--radix-dropdown-menu-trigger-width] bg-white border-gray-500 min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal rounded-md">
              {" "}
              <div className="ml-1 my-2">
                <ModeToggle />
              </div>
              <div className="flex items-center gap-2 px-1 hover:bg-gray-400/25 dark:hover:bg-gray-900  rounded  py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 border-gray-300 border-1 rounded-full">
                  <AvatarImage alt="userImg" />
                  <AvatarFallback className=" dark:text-gray-300 rounded-lg">
                    Cn
                  </AvatarFallback>
                </Avatar>
                <div className=" dark:text-gray-300  grid flex-1 text-left text-sm leading-tight ">
                  <span className="dark:text-gray-300 truncate font-semibold">
                    {user?.userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-gray-200 dark:hover:bg-gray-900 rounded-md dark:text-gray-300"
              onClick={handleLogOut}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
