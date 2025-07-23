import { IndexType, Permission } from 'node-appwrite';
import { db, listingCollection } from '../name';
import { databases } from './config';

export default async function createRoomListingCollection() {
  await databases.createCollection(db, listingCollection, listingCollection, [
    Permission.read('any'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);

  console.log('Listing collection created successfully');

  await Promise.all([
    // Images, IDs and Title
    databases.createStringAttribute(db, listingCollection, 'image_url_1', 1000, true),
    databases.createStringAttribute(db, listingCollection, 'image_url_2', 1000, false),
    databases.createStringAttribute(db, listingCollection, 'image_url_3', 1000, false),
    databases.createStringAttribute(db, listingCollection, 'image_url_4', 1000, false),
    databases.createStringAttribute(db, listingCollection, 'id', 36, true),
    databases.createStringAttribute(db, listingCollection, 'title', 150, true),
    databases.createStringAttribute(db, listingCollection, 'description', 2000, true),
    databases.createStringAttribute(db, listingCollection, 'created_by', 36, true), //  user id for searching

    // Metadata
    databases.createBooleanAttribute(db, listingCollection, 'visibility', false, true),
    databases.createDatetimeAttribute(db, listingCollection, 'created_at', true),
    databases.createDatetimeAttribute(db, listingCollection, 'updated_at', false),

    // Rules & Terms
    databases.createStringAttribute(db, listingCollection, 'rules', 2000, false),
    databases.createStringAttribute(db, listingCollection, 'additional_terms', 2000, false),

    // Contact & Verification
    databases.createEnumAttribute(db, listingCollection, 'listed_by', ['Owner', 'Agent', 'Tenant'], true),
    databases.createStringAttribute(db, listingCollection, 'contact_name', 100, true),
    databases.createStringAttribute(db, listingCollection, 'contact_phone', 20, true),
    databases.createStringAttribute(db, listingCollection, 'contact_email', 100, true),
    databases.createBooleanAttribute(db, listingCollection, 'verified_listing', false),

    // Availability
    databases.createBooleanAttribute(db, listingCollection, 'available_for_visits', false),
    databases.createStringAttribute(db, listingCollection, 'visiting_hours', 100, false),

    // Location
    databases.createStringAttribute(db, listingCollection, 'address', 1500, true),
    databases.createStringAttribute(db, listingCollection, 'city', 70, true),
    databases.createStringAttribute(db, listingCollection, 'state', 70, true),
    databases.createStringAttribute(db, listingCollection, 'pin_code', 6, true),
    databases.createStringAttribute(db, listingCollection, 'country', 50, false, 'India'),

    // Pricing
    databases.createIntegerAttribute(db, listingCollection, 'monthly_rent', true),
    databases.createIntegerAttribute(db, listingCollection, 'security_deposit', true),
    databases.createIntegerAttribute(db, listingCollection, 'maintenance_charge', false),
    databases.createBooleanAttribute(db, listingCollection, 'electricity_bill_included', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'water_bill_included', false, false),

    // Room Details
    databases.createEnumAttribute(db, listingCollection, 'room_type', ['Private Room', 'Shared', 'PG', 'Studio', 'Entire Apartment'], true),

    databases.createDatetimeAttribute(db, listingCollection, 'available_from', true),
    databases.createEnumAttribute(db, listingCollection, 'furnishing', ['Furnished', 'Semi-Furnished', 'Unfurnished'], false),
    databases.createStringAttribute(db, listingCollection, 'room_size', 30, false),
    databases.createEnumAttribute(db, listingCollection, 'bathroom_type', ['Private', 'Shared', 'Attached'], false),
    databases.createIntegerAttribute(db, listingCollection, 'balcony', false),
    databases.createEnumAttribute(db, listingCollection, 'kitchen_access', ['Yes', 'No', 'Shared'], false),

    // Amenities
    databases.createBooleanAttribute(db, listingCollection, 'wifi', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'air_conditioning', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'geyser', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'refrigerator', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'washing_machine', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'parking_2_wheeler', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'parking_4_wheeler', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'power_backup', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'elevator', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'housekeeping', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'wardrobe', false, false),
    // databases.createBooleanAttribute(db, listingCollection, 'study_table', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'pets_allowed', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'smoking_allowed_inside', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'party_friendly', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'guest_allowed', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'ro_purifier', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'gas_pipeline', false, false),
    databases.createEnumAttribute(
      db,
      listingCollection,
      'tenant_religion_preference',
      ['Muslim', 'Hindu', 'Christian', 'Sikh', 'Buddhists', 'Jains', 'Others'],
      false
    ),

    // Safety Features
    databases.createBooleanAttribute(db, listingCollection, 'fire_extinguisher', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'fire_alarm', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'first_aid_kit', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'security_guard', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'cctv', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'wheelchair_accessible', false, false),

    // Tenants Info
    databases.createEnumAttribute(db, listingCollection, 'preferred_gender', ['Male', 'Female', 'Any', 'Others'], false),
    databases.createEnumAttribute(db, listingCollection, 'preferred_occupation', ['Student', 'Working Professional', 'Any'], false),
    databases.createIntegerAttribute(db, listingCollection, 'age_range_min', false, 0, 99),
    databases.createIntegerAttribute(db, listingCollection, 'age_range_max', false, 0, 99)
  ]);

  console.log('Listings attributes created successfully');

  // Delaying so that the attributes creted successfully before index creation
  await new Promise((resolve) => setTimeout(resolve, 60000));
  // await new Promise((resolve) => setTimeout(resolve, 30000));

  // Indexes
  await Promise.all([
    databases.createIndex(db, listingCollection, 'idx_id', IndexType.Unique, ['id'], ['asc']),
    databases.createIndex(db, listingCollection, 'idx_city', IndexType.Key, ['city']),
    databases.createIndex(db, listingCollection, 'idx_visibility', IndexType.Key, ['visibility']),
    databases.createIndex(db, listingCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc']),
    databases.createIndex(db, listingCollection, 'idx_room_type', IndexType.Key, ['room_type']),
    databases.createIndex(db, listingCollection, 'idx_city_rent', IndexType.Key, ['city'], ['asc']),
    databases.createIndex(db, listingCollection, 'idx_state_type', IndexType.Key, ['state', 'room_type']),
    databases.createIndex(db, listingCollection, 'idx_rent_range', IndexType.Key, ['monthly_rent'], ['asc']),
    databases.createIndex(db, listingCollection, 'idx_visibility_verified', IndexType.Key, ['visibility', 'verified_listing']),
    databases.createIndex(db, listingCollection, 'idx_gender_preference', IndexType.Key, ['preferred_gender']),

    // Parking
    databases.createIndex(db, listingCollection, 'idx_parking', IndexType.Key, ['parking_2_wheeler', 'parking_4_wheeler']),

    // Religion Preference
    databases.createIndex(db, listingCollection, 'idx_religion_pref', IndexType.Key, ['tenant_religion_preference']),

    // Gender, Occupation, Age Range
    databases.createIndex(db, listingCollection, 'idx_gender_occupation', IndexType.Key, [
      'preferred_gender',
      'preferred_occupation',
      'age_range_min',
      'age_range_max'
    ]),

    // Security
    databases.createIndex(db, listingCollection, 'idx_security_features', IndexType.Key, [
      'cctv',
      'security_guard',
      'fire_extinguisher',
      'fire_alarm'
    ]),

    // Utilities + Furnishing
    databases.createIndex(db, listingCollection, 'idx_furnishing_elevator_power', IndexType.Key, [
      'furnishing',
      'elevator',
      'power_backup'
    ]),

    // Availability & Visibility
    databases.createIndex(db, listingCollection, 'idx_availability_visibility', IndexType.Key, ['available_for_visits', 'visibility']),

    // Lifestyle filters
    databases.createIndex(db, listingCollection, 'idx_lifestyle_filters', IndexType.Key, [
      'pets_allowed',
      'smoking_allowed_inside',
      'party_friendly',
      'guest_allowed'
    ])
  ]);

  console.log('Attributes and indexes added successfully');
}
