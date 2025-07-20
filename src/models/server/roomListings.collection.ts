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

  //   Creating attribute

  await Promise.all([
    databases.createStringAttribute(db, listingCollection, 'id', 100, true),
    databases.createStringAttribute(db, listingCollection, 'title', 1000, true),
    databases.createStringAttribute(db, listingCollection, 'description', 5000, true),

    // Location
    databases.createStringAttribute(db, listingCollection, 'address', 2000, true),
    databases.createStringAttribute(db, listingCollection, 'city', 50, true),
    databases.createStringAttribute(db, listingCollection, 'state', 50, true),
    databases.createStringAttribute(db, listingCollection, 'country', 50, true, 'India'),
    databases.createStringAttribute(db, listingCollection, 'pin_code', 50, true),

    // Pricing
    databases.createIntegerAttribute(db, listingCollection, 'monthly_rent', true),
    databases.createIntegerAttribute(db, listingCollection, 'security_deposit', true),
    databases.createIntegerAttribute(db, listingCollection, 'maintenance_charge', false),
    databases.createBooleanAttribute(db, listingCollection, 'electricity_bill_included', false, false),
    databases.createBooleanAttribute(db, listingCollection, 'water_bill_included', false, false),

    // Staying and home type
    databases.createIntegerAttribute(db, listingCollection, 'minimum_stay_months', false),
    databases.createIntegerAttribute(db, listingCollection, 'maximum_stay_months', false),
    databases.createEnumAttribute(db, listingCollection, 'home_type', ['Apartment', 'Private Home', 'Rental'], true),

    // Tenant Preference
    databases.createEnumAttribute(db, listingCollection, 'preferred_gender', ['Male', 'Female', 'Any', 'Others'], false),
    databases.createEnumAttribute(db, listingCollection, 'preferred_occupation', ['Student', 'Working Professional', 'Any'], false),
    databases.createIntegerAttribute(db, listingCollection, 'age_range_min', false, 0, 99),
    databases.createIntegerAttribute(db, listingCollection, 'age_range_max', false, 0, 99),
    databases.createBooleanAttribute(db, listingCollection, 'smoking_allowed', false),
    databases.createBooleanAttribute(db, listingCollection, 'drinking_allowed', false),
    databases.createBooleanAttribute(db, listingCollection, 'non_veg_allowed', false),
    databases.createBooleanAttribute(db, listingCollection, 'visitors_allowed', false)
  ]);

  // Creating Indexes
}
