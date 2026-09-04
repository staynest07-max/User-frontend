export const ENQUIRY_STATUSES = [
  'NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'CLOSED', 'CANCELLED', 'REJECTED', 'NO_RESPONSE',
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface CreateEnquiryInput {
  pgId: string;
  message?: string;
  roomType?: string;
  moveInDate?: string;
}

export interface Enquiry {
  id: string;
  publicId: string;
  pg: {
    publicId: string | null;
    name: string;
    location: { address: string; city: string; locality: string };
  };
  details: { message: string | null; roomType: string | null; moveInDate: string | null };
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}
