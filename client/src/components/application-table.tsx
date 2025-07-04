import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/status-badge";
import EditApplicationModal from "@/components/edit-application-modal";
import { formatDate, getCompanyInitials } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Application } from "@shared/schema";

interface ApplicationTableProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onAddApplication: () => void;
}

export default function ApplicationTable({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onAddApplication,
}: ApplicationTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const { data: rawApplications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications", { search: searchQuery, status: statusFilter }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      
      const url = `/api/applications${params.toString() ? `?${params.toString()}` : ""}`;
      return fetch(url, { credentials: "include" }).then(res => res.json());
    },
  });

  // Sort applications by application date (recent first)
  const applications = rawApplications?.sort((a, b) => 
    new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
  );

  const deleteApplicationMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      deleteApplicationMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-text-dark">Job Applications</h3>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={onAddApplication} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No applications found</p>
                    <p className="text-sm">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search or filter criteria"
                        : "Get started by adding your first job application"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              applications?.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-dark">{application.jobTitle}</div>
                    <div className="text-sm text-gray-500">{application.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-gray-600">
                          {getCompanyInitials(application.company)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-text-dark">{application.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.applicationDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingApplication(application)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(application.id)}
                        disabled={deleteApplicationMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination placeholder */}
      {applications && applications.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Showing</span>
              <span className="font-medium text-text-dark">1-{applications.length}</span>
              <span>of</span>
              <span className="font-medium text-text-dark">{applications.length}</span>
              <span>applications</span>
            </div>
          </div>
        </div>
      )}

      <EditApplicationModal
        isOpen={!!editingApplication}
        onClose={() => setEditingApplication(null)}
        application={editingApplication}
      />
    </Card>
  );
}
