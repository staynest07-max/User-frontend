export const VISIT_STATUSES = [
  'REQUESTED', 'CONFIRMED', 'RESCHEDULE_REQUESTED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'NO_SHOW',
] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

export interface CreateVisitInput {
  enquiryId: string;
  visitDate: string;
  visitTime: string;
  timeZone?: string;
  note?: string;
}

export interface Visit {
  id: string;
  publicId: string;
  pg: {
    publicId: string | null;
    name: string;
    location: { address: string; city: string; locality: string };
  };
  enquiry: { publicId: string } | null;
  requestedDate: string;
  requestedTime: string;
  requestedStartAt: string;
  requestedEndAt: string;
  note: string | null;
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
}
