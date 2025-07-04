import { useState } from "react";
import Header from "@/components/header";
import DashboardStats from "@/components/dashboard-stats";
import ApplicationTable from "@/components/application-table";
import AddApplicationModal from "@/components/add-application-modal";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardStats />
        
        <ApplicationTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onAddApplication={() => setIsAddModalOpen(true)}
        />
      </div>

      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
