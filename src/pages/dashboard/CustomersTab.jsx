"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Download,
  Filter,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { app } from "../../firebase/firebaseConfig";

export default function CustomersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const firestore = getFirestore(app);
        const usersRef = collection(firestore, "users");

        // First, try to get customers without ordering (this doesn't require an index)
        const customersQuery = query(usersRef, where("role", "==", "customer"));

        let querySnapshot;
        try {
          // Try to get customers with ordering (requires index)
          const orderedQuery = query(
            usersRef,
            where("role", "==", "customer"),
            orderBy("createdAt", "desc")
          );
          querySnapshot = await getDocs(orderedQuery);
        } catch (error) {
          // If index error occurs, fall back to unordered query
          console.warn(
            "Using unordered query because index is missing. To enable sorting, create the index using the link in the console error."
          );
          querySnapshot = await getDocs(customersQuery);
        }

        let customersData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          customersData.push({
            id: doc.id,
            name: `${data.fname || ""} ${data.lname || ""}`.trim() || "Unknown",
            email: data.email || "No email",
            status: data.subscription?.status || "inactive",
            plan: data.subscription?.planName || "None",
            joined: data.createdAt,
            spent: data.subscription?.price || "$0",
          });
        });

        // Sort by createdAt if we didn't get ordered results
        customersData = customersData.sort((a, b) => {
          const dateA = a.joined ? new Date(a.joined) : new Date(0);
          const dateB = b.joined ? new Date(b.joined) : new Date(0);
          return dateB - dateA; // descending order
        });

        setCustomers(customersData);
        setFilteredCustomers(customersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setIsLoading(false);

        // Show a helpful message if it's an index error
        if (error.message && error.message.includes("index")) {
          alert(
            "This query requires a Firestore index. Please check the console for a link to create it."
          );
        }
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term and status filter
  useEffect(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((customer) => {
        return (
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.status === statusFilter
      );
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, customers]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full sm:w-[300px] pl-8 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                Name
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                Plan
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                Joined
              </TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                Subscription
              </TableHead>
              <TableHead className="text-right text-gray-600 dark:text-gray-300 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      Loading customers...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500 dark:text-gray-400"
                >
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <TableCell>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "active"
                          ? "default"
                          : customer.status === "trial"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        customer.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                          : customer.status === "trial"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-normal border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      {customer.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {formatDate(customer.joined)}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {customer.spent}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700">
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700">
                          Manage Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20">
                          Deactivate Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <strong>{filteredCustomers.length}</strong> of{" "}
          <strong>{customers.length}</strong> customers
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
