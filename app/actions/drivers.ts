"use server";

export type Driver = {
  id: string;
  name: string;
  phone: string;
  cnic: string;
  email: string;
  home_address: string;
  branch: string;
  status: "Active" | "Offline" | "On Delivery";
};

// High-quality mock data for 3 branches
const mockDrivers: Driver[] = [
  // Main Branch Drivers
  {
    id: "DRV-101",
    name: "Ahmed Raza",
    phone: "0300-1234567",
    cnic: "35202-1234567-1",
    email: "ahmed.raza@example.com",
    home_address: "123 Main Street, Gulberg, Lahore",
    branch: "Main Branch",
    status: "Active",
  },
  {
    id: "DRV-102",
    name: "Bilal Hasan",
    phone: "0321-7654321",
    cnic: "35202-7654321-2",
    email: "bilal.hasan@example.com",
    home_address: "456 Side Road, Model Town, Lahore",
    branch: "Main Branch",
    status: "On Delivery",
  },
  {
    id: "DRV-103",
    name: "Usman Ali",
    phone: "0333-9876543",
    cnic: "35202-9876543-3",
    email: "usman.ali@example.com",
    home_address: "789 Park Ave, Johar Town, Lahore",
    branch: "Main Branch",
    status: "Offline",
  },

  // Downtown Branch Drivers
  {
    id: "DRV-201",
    name: "Sara Khan",
    phone: "0301-1122334",
    cnic: "35201-1122334-4",
    email: "sara.khan@example.com",
    home_address: "12 Downtown Blvd, Phase 1, Lahore",
    branch: "Downtown Branch",
    status: "Active",
  },
  {
    id: "DRV-202",
    name: "Hamza Butt",
    phone: "0345-5566778",
    cnic: "35201-5566778-5",
    email: "hamza.butt@example.com",
    home_address: "88 Commercial Zone, Phase 5, Lahore",
    branch: "Downtown Branch",
    status: "On Delivery",
  },

  // Uptown Branch Drivers
  {
    id: "DRV-301",
    name: "Talha Mehmood",
    phone: "0311-9988776",
    cnic: "35203-9988776-6",
    email: "talha.mehmood@example.com",
    home_address: "55 Uptown Street, Defence, Lahore",
    branch: "Uptown Branch",
    status: "Active",
  },
  {
    id: "DRV-302",
    name: "Zainab Ali",
    phone: "0322-4433221",
    cnic: "35203-4433221-7",
    email: "zainab.ali@example.com",
    home_address: "22 Elite Way, Cantt, Lahore",
    branch: "Uptown Branch",
    status: "Offline",
  },
];

export async function getDriversByBranch(branchName: string): Promise<Driver[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (branchName === "All Branches") {
    return mockDrivers;
  }

  return mockDrivers.filter((driver) => driver.branch === branchName);
}
