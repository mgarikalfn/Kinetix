import { Navbar } from "@/components/NavBar";
import { Sidebar } from "@/components/sidebar";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#E4E1E6] flex flex-col selection:bg-[#6366F1]/30">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="flex w-full flex-1">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto bg-[#121216] border-r border-white/[0.06] z-40">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full min-h-screen flex flex-col bg-[#09090B]">
          <div className="mx-auto max-w-screen-2xl w-full flex flex-col flex-1">
            <Navbar />
            <main className="flex-1 py-6 px-4 lg:px-8 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
