export type UserRole = 'guest' | 'user' | 'merchant' | 'admin';

export type PgType = 'men' | 'women' | 'coliving' | 'hostel' | 'family';

export type SharingType = 'private' | '2-sharing' | '3-sharing' | '4-sharing' | 'dormitory';

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'photo-verified'
  | 'field-verified'
  | 'assured'
  | 'rejected';

export type ListingStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'live'
  | 'paused'
  | 'rejected'
  | 'suspended';

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'visit_scheduled'
  | 'booked'
  | 'lost'
  | 'closed';

export type VisitStatus =
  | 'requested'
  | 'accepted'
  | 'suggested'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'interested'
  | 'not_interested';

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'payment_pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface Amenity {
  id: string;
  name: string;
  category: 'room' | 'property' | 'food' | 'service' | 'safety';
  icon: string;
}

export interface RoomType {
  id: string;
  name: string;
  sharing: SharingType;
  rent: number;
  deposit: number;
  availableBeds: number;
  totalBeds: number;
  features: string[];
  availableFrom?: string;
}

export interface PricingBreakdown {
  rent: number;
  deposit: number;
  maintenance: number;
  food: number;
  electricity: number;
  parking: number;
  other: number;
  otherLabel?: string;
}

export interface HouseRules {
  entryTime: string;
  visitors: string;
  smoking: boolean;
  alcohol: boolean;
  pets: boolean;
  cooking: boolean;
  minimumStay: string;
  noticePeriod: string;
}

export interface SafetyInfo {
  cctv: boolean;
  guard: boolean;
  biometric: boolean;
  fireSafety: boolean;
  womenFriendly: boolean;
  verified: boolean;
}

export interface FoodInfo {
  included: boolean;
  dietTypes: string[];
  meals: string[];
  timings: string;
  sampleMenu?: string[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  food: number;
  cleanliness: number;
  safety: number;
  wifi: number;
  management: number;
  comment: string;
  date: string;
  verifiedStay: boolean;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  area: string;
  city: string;
  address: string;
  landmark: string;
  latitude: number;
  longitude: number;
  pgType: PgType;
  startingRent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  coverImage: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  amenities: string[];
  sharingTypes: SharingType[];
  available: boolean;
  availableFrom: string;
  availabilityConfirmedAt: string;
  roomTypes: RoomType[];
  pricing: PricingBreakdown;
  rules: HouseRules;
  safety: SafetyInfo;
  food: FoodInfo;
  distanceKm?: number;
  matchScore?: number;
  merchantId: string;
  merchantName: string;
  merchantPhone: string;
  status: ListingStatus;
  nearbyPlaces?: { name: string; type: string; distance: string }[];
  reviews: Review[];
}

export interface UserPreferences {
  city: string;
  budgetMin: number;
  budgetMax: number;
  pgType: PgType | 'any';
  sharing: SharingType | 'any';
  moveInDate?: string;
  foodIncluded?: boolean;
  verifiedOnly?: boolean;
  amenities?: string[];
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  roomTypeId: string;
  roomTypeName: string;
  moveInDate: string;
  duration: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface Visit {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  propertyArea: string;
  date: string;
  time: string;
  status: VisitStatus;
  suggestedDate?: string;
  suggestedTime?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  roomTypeName: string;
  moveInDate: string;
  rent: number;
  deposit: number;
  status: BookingStatus;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'enquiry' | 'visit' | 'booking' | 'payment' | 'support' | 'system';
  read: boolean;
  createdAt: string;
  actionRoute?: string;
}

export interface ChatThread {
  id: string;
  propertyName: string;
  propertyImage: string;
  otherPartyName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  text: string;
  sender: 'me' | 'them';
  createdAt: string;
}

export interface MerchantStats {
  totalPgs: number;
  liveListings: number;
  vacancies: number;
  enquiries: number;
  upcomingVisits: number;
}

export interface MerchantEnquiry {
  id: string;
  userName: string;
  userPhone: string;
  propertyName: string;
  roomPreference: string;
  moveInDate: string;
  duration: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}
