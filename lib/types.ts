import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";


type IUser = {
    success: boolean,
    message: string,
    data: {
        profile: {
            id: string,
            name: string,
            email: string,
            activeStatus: string,
            role: string,
            createdAt: string,
            updatedAt: string,
            profile: {
                id: string,
                profilePhoto: string,
                bio: string | null,
                userId: string,
                createdAt: string,
                updatedAt: string
            }
        }
    }
}

export type NavbarProps = {
    user: IUser
}

export type ISidebarItem = {
    label: string,
    href: string,
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export interface Property {
  id: string;
  landlordId: string;
  categoryId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  rentAmount: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  message: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
}

export interface ApiResponse {
  message: string;
  data: RentalRequest[];
}