'use server';

import { db, listingCollection } from '@/models/name';
import { handleServerError } from '@/utils/errorHandler';
import { createSuccessResponse } from '@/utils/responseHandler';
import { databases } from '@/models/server/config';
import { ID } from 'node-appwrite';

interface ListingPropsType {
  // Images, IDs and Title
  title: string;
  description: string;
  image_url_1: string;
  image_url_2: string;
  image_url_3: string;
  image_url_4: string;

  // Location
  address: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;

  // Pricing
  monthly_rent?: number;
  security_deposit?: number;
  maintenance_charge?: number;

  electricity_bill_included: boolean;
  water_bill_included: boolean;

  // Room Details
  room_type: 'Private Room' | 'Shared' | 'PG' | 'Studio' | 'Entire Apartment' | 'Please Select';
  available_from: Date;
  available_till?: Date;
  furnishing?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Please Select';
  room_size?: string;
  bathroom_type?: 'Private' | 'Shared' | 'Attached' | null;
  has_balcony: boolean;
  kitchen_access?: 'Yes' | 'No' | 'Shared' | null;

  // Contact & Verification
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;

  // Availability
  available_for_visits: boolean;
  visiting_hours?: string;

  // Rules & Terms
  terms?: string;
  visibility: boolean;

  // Amenities
  wifi: boolean;
  air_conditioning: boolean;
  geyser: boolean;
  refrigerator: boolean;
  washing_machine: boolean;
  wardrobe: boolean;
  ro_purifier: boolean;
  gas_pipeline: boolean;
  parking_2_wheeler: boolean;
  parking_4_wheeler: boolean;
  power_backup: boolean;
  elevator: boolean;
  housekeeping: boolean;
  pets_allowed: boolean;
  smoking_allowed_inside: boolean;
  party_friendly: boolean;
  guest_allowed: boolean;

  fire_extinguisher: boolean;
  fire_alarm: boolean;
  first_aid_kit: boolean;
  security_guard: boolean;
  cctv: boolean;
  wheelchair_accessible: boolean;

  // Tenant Preferences
  preferred_gender: 'Male' | 'Female' | 'Any' | 'Others';
  preferred_occupation: 'Please Select' | 'Student' | 'Working Professional' | 'Any';
  tenant_religion_preference: 'Please Select' | 'Muslim' | 'Hindu' | 'Christian' | 'Sikh' | 'Buddhists' | 'Jains' | 'Others' | 'Any';

  age_range_min?: number | null;
  age_range_max?: number | null;

  room_layout: '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Please Select';
  listed_by: 'House_Owner' | 'Room_Sharer' | 'Please Select';
}

const CreateListingDocument = async (listingData: ListingPropsType) => {
  const id = ID.unique();
  try {
    const response = await databases.createDocument(db, listingCollection, id, { ...listingData });
    return createSuccessResponse('Listing document created successfully', response, 'CreateListingDocument', 201);
  } catch (error) {
    handleServerError('Error while creating listing document', error, 'CreateListingDocument');
  }
};

export default CreateListingDocument;
