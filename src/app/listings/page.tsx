"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Upload, X } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Validation schema matching Appwrite collection

const listingSchema = z.object({
    // Images, IDs and Title
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description is required"),

    // Location
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pin_code: z.string().length(6, "PIN code must be 6 digits"),
    country: z.string().default("India"),

    // Pricing
    monthly_rent: z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number().min(0, "Rent must be positive")
    ),
    security_deposit: z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number().min(0, "Deposit must be positive")
    ),
    maintenance_charge: z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number().optional()
    ),

    electricity_bill_included: z.boolean().default(false),
    water_bill_included: z.boolean().default(false),

    // Room Details
    room_type: z.enum([
        "Private Room",
        "Shared",
        "PG",
        "Studio",
        "Entire Apartment",
    ]),
    available_from: z.date(),
    available_till: z.date().optional(),
    furnishing: z
        .enum(["Furnished", "Semi-Furnished", "Unfurnished"])
        .optional(),
    room_size: z.string().optional(),
    bathroom_type: z.enum(["Private", "Shared", "Attached"]).optional(),
    has_balcony: z.boolean().default(false),
    kitchen_access: z.enum(["Yes", "No", "Shared"]).optional(),

    // Contact & Verification
    contact_name: z.string().min(1, "Name is required"),
    contact_phone: z.string().min(10, "Phone is required"),
    contact_email: z.string().email("Invalid email"),

    // Availability
    available_for_visits: z.boolean().default(false),
    visiting_hours: z.string().optional(),

    // Rules & Terms
    terms: z.string().optional(),
    visibility: z.boolean().default(true),

    // Amenities — default to false so never undefined
    wifi: z.boolean().default(false),
    air_conditioning: z.boolean().default(false),
    geyser: z.boolean().default(false),
    refrigerator: z.boolean().default(false),
    washing_machine: z.boolean().default(false),
    wardrobe: z.boolean().default(false),
    ro_purifier: z.boolean().default(false),
    gas_pipeline: z.boolean().default(false),
    parking_2_wheeler: z.boolean().default(false),
    parking_4_wheeler: z.boolean().default(false),
    power_backup: z.boolean().default(false),
    elevator: z.boolean().default(false),
    housekeeping: z.boolean().default(false),
    pets_allowed: z.boolean().default(false),
    smoking_allowed_inside: z.boolean().default(false),
    party_friendly: z.boolean().default(false),
    guest_allowed: z.boolean().default(false),

    // Safety Features — default to false so never undefined
    fire_extinguisher: z.boolean().default(false),
    fire_alarm: z.boolean().default(false),
    first_aid_kit: z.boolean().default(false),
    security_guard: z.boolean().default(false),
    cctv: z.boolean().default(false),
    wheelchair_accessible: z.boolean().default(false),

    // Tenant Preferences — default ensures always defined
    preferred_gender: z
        .enum(["Male", "Female", "Any", "Others"])
        .default("Any"),
    preferred_occupation: z
        .enum(["Student", "Working Professional", "Any"])
        .default("Any"),
    age_range_min: z.number().min(0).max(99).optional(),
    age_range_max: z.number().min(0).max(99).optional(),
    tenant_religion_preference: z
        .enum([
            "Muslim",
            "Hindu",
            "Christian",
            "Sikh",
            "Buddhists",
            "Jains",
            "Others",
            "Any",
        ])
        .default("Any"),
});


const CreateListingPage = () => {
    const steps = ["Basics", "Room Details", "Roommates", "Images", "Rules"];

    const [currentSteps, setCurrentSteps] = useState("Basics");
    const [images, setImages] = useState<File[]>([]);

    const genderOptions = ["Male", "Female", "Any", "Others", ""];
    const occupationOptions = ["Student", "Working Professional", "Any", ""];
    const religionOptions = ["Muslim", "Hindu", "Christian", "Sikh", "Buddhists", "Jains", "Others", "Any", ""];

    const amenitiesConfig = {
        "Basic Amenities": [
            { id: "wifi", label: "WiFi", icon: "📶" },
            { id: "air_conditioning", label: "Air Conditioning", icon: "❄️" },
            { id: "geyser", label: "Geyser/Water Heater", icon: "🚿" },
            { id: "refrigerator", label: "Refrigerator", icon: "🧊" },
            { id: "washing_machine", label: "Washing Machine", icon: "🧺" },
            { id: "wardrobe", label: "Wardrobe", icon: "👔" },
            { id: "ro_purifier", label: "RO Purifier", icon: "💧" },
            { id: "gas_pipeline", label: "Gas Pipeline", icon: "🔥" },
        ],
        Parking: [
            { id: "parking_2_wheeler", label: "2-Wheeler Parking", icon: "🏍️" },
            { id: "parking_4_wheeler", label: "4-Wheeler Parking", icon: "🚗" },
        ],
        "Building Amenities": [
            { id: "power_backup", label: "Power Backup", icon: "🔋" },
            { id: "elevator", label: "Elevator", icon: "🛗" },
            { id: "housekeeping", label: "Housekeeping", icon: "🧹" },
            { id: "has_balcony", label: "Balcony", icon: "🪟" }
        ],
        Lifestyle: [
            { id: "pets_allowed", label: "Pets Allowed", icon: "🐕" },
            { id: "smoking_allowed_inside", label: "Smoking Allowed Inside", icon: "🚬" },
            { id: "party_friendly", label: "Party Friendly", icon: "🎉" },
            { id: "guest_allowed", label: "Guests Allowed", icon: "👥" },
        ],
        "Safety & Security": [
            { id: "fire_extinguisher", label: "Fire Extinguisher", icon: "🧯" },
            { id: "fire_alarm", label: "Fire Alarm", icon: "🚨" },
            { id: "first_aid_kit", label: "First Aid Kit", icon: "🩹" },
            { id: "security_guard", label: "Security Guard", icon: "💂" },
            { id: "cctv", label: "CCTV", icon: "📹" },
            { id: "wheelchair_accessible", label: "Wheelchair Accessible", icon: "♿" },
        ],
    };

    const form = useForm<z.infer<typeof listingSchema>>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            title: "",
            description: "",
            address: "",
            city: "",
            state: "",
            pin_code: "",
            country: "India",
            monthly_rent: 0,
            security_deposit: 0,
            maintenance_charge: 0,
            electricity_bill_included: false,
            water_bill_included: false,

            // Room Details - ADD THESE
            room_type: "Private Room",
            available_from: new Date(),
            available_till: new Date(),
            furnishing: "Furnished",
            room_size: "",
            bathroom_type: "Private",
            has_balcony: false,
            kitchen_access: "Yes",

            // Contact
            contact_name: "",
            contact_phone: "",
            contact_email: "",

            // Availability
            available_for_visits: false,
            visiting_hours: "",

            // Rules
            terms: "",
            visibility: true,

            // All amenities
            wifi: false,
            air_conditioning: false,
            geyser: false,
            refrigerator: false,
            washing_machine: false,
            wardrobe: false,
            ro_purifier: false,
            gas_pipeline: false,
            parking_2_wheeler: false,
            parking_4_wheeler: false,
            power_backup: false,
            elevator: false,
            housekeeping: false,
            pets_allowed: false,
            smoking_allowed_inside: false,
            party_friendly: false,
            guest_allowed: false,
            fire_extinguisher: false,
            fire_alarm: false,
            first_aid_kit: false,
            security_guard: false,
            cctv: false,
            wheelchair_accessible: false,

            // Tenant Preferences - ADD THESE
            preferred_gender: "Any",
            preferred_occupation: "Any",
            // age_range_min: 18,
            // age_range_max: 99,
            tenant_religion_preference: "Any",
        },
    });


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages((prev) => [...prev, ...filesArray].slice(0, 4)); // Max 4 images
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: z.infer<typeof listingSchema>) => {
        // TODO: Upload images to Cloudinary and get URLs
        // TODO: Add created_by field with user ID
        // TODO: Add auto_deleted_at if needed

        // Mapping required fields to their section
        // const requiredFields: Record<string, string> = {
        //     title: "Basics",
        //     description: "Basics",
        //     address: "Basics",
        //     city: "Basics",
        //     state: "Basics",
        //     pin_code: "Basics",
        //     monthly_rent: "Basics",
        //     security_deposit: "Basics",
        //     contact_name: "Roommates",
        //     contact_phone: "Roommates",
        //     contact_email: "Roommates",
        //     room_type: "Details",
        //     available_from: "Details",
        // };

        // // Collect all missing required fields
        // const missingFields = Object.entries(requiredFields).filter(([field]) => {
        //     const value = (data as any)[field];
        //     return (
        //         value === undefined ||
        //         value === null ||
        //         value === "" ||
        //         (typeof value === "number" && isNaN(value))
        //     );
        // });

        // // If any required field missing → show toast and highlight section
        // if (missingFields.length > 0) {
        //     const firstMissingSection = missingFields[0][1];
        //     const fieldsList = missingFields.map(([f]) => f.replaceAll("_", " ")).join(", ");

        //     toast.error(
        //         `Please fill all required fields: ${fieldsList}. Missing in "${firstMissingSection}" section.`
        //     );

        //     // Optionally set the current step to that section
        //     setCurrentSteps(firstMissingSection);
        //     return;
        // }

        // // Image check
        // if (images.length === 0) {
        //     toast.error("Please upload at least one image before submitting.");
        //     setCurrentSteps("Images");
        //     return;
        // }
        // If all validations pass
        const payload = {
            ...data,
            // image_url_1, image_url_2... will be filled after upload
            // created_by: userId (add from auth context)
        };

        console.log(data)

        toast.success("Listing submitted successfully!");
        console.log(payload);
    };

    const renderBasics = () => (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Basic info :</h3>
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="title"
                label="Title"
                placeholder="Spacious 2BHK near Metro Station"
                required
            />

            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label="Description"
                placeholder="Describe your listing in detail..."
                required
            />

            <h3 className="font-semibold text-lg mt-6">Location Details :</h3>


            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="Complete address"
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="ex: Mumbai"
                    required

                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="state"
                    label="State"
                    placeholder="ex: Maharashtra"
                    required

                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="pin_code"
                    label="PIN Code"
                    placeholder="ex: 400001"
                    required

                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="country"
                    label="Country"
                    placeholder="India"
                />

            </div>

            <h3 className="font-semibold text-lg mt-6">Pricing Details :</h3>


            <div className="grid grid-cols-3 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.NUMBER}
                    control={form.control}
                    name="monthly_rent"
                    label="Monthly Rent (₹)"
                    required

                />
                <CustomFormField
                    fieldType={FormFieldType.NUMBER}
                    control={form.control}
                    name="security_deposit"
                    label="Security Deposit (₹)"
                    required

                />
                <CustomFormField
                    fieldType={FormFieldType.NUMBER}
                    control={form.control}
                    name="maintenance_charge"
                    label="Maintenance (₹)"
                    placeholder="1000"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX_HIDDEN}
                    control={form.control}
                    name="electricity_bill_included"
                    label="Electricity bill included"
                    iconSrc="💡"
                />

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX_HIDDEN}
                    control={form.control}
                    name="water_bill_included"
                    label="Water bill included"
                    iconSrc="💧"
                />


            </div>
        </div>
    );

    const renderRoomDetails = () => (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg mt-6">Room Details :</h3>

            <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="room_type"
                    label="Room Type"
                    placeholder="Select room type"
                    required

                >
                    <SelectItem value="Private Room">Private Room</SelectItem>
                    <SelectItem value="Shared">Shared</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Entire Apartment">Entire Apartment</SelectItem>
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="kitchen_access"
                    label="Kitchen Access"
                    placeholder="Select kitchen access"
                >
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Shared">Shared</SelectItem>
                </CustomFormField>


            </div>


            <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="furnishing"
                    label="Furnishing"
                    placeholder="Select furnishing"
                    required

                >
                    <SelectItem value="Furnished">Furnished</SelectItem>
                    <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="bathroom_type"
                    label="Bathroom Type"
                    placeholder="Select bathroom type"
                >
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Shared">Shared</SelectItem>
                    <SelectItem value="Attached">Attached</SelectItem>
                </CustomFormField>
            </div>

            <div className="grid grid-cols-2 gap-4">

                <CustomFormField
                    fieldType={FormFieldType.DATE_Picker}
                    control={form.control}
                    name="available_from"
                    label="Room Available From"
                    required

                />

                <CustomFormField
                    fieldType={FormFieldType.DATE_Picker}
                    control={form.control}
                    name="available_till"
                    label="Room Available till"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="room_size"
                    label="Room Size (sq ft)"
                    placeholder="150"
                />


            </div>


            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-1 ">Amenities</h3>
                    <p className="mb-6 text-sm text-foreground/50">Please select the fields below based on what your room have</p>

                </div>
                {Object.entries(amenitiesConfig).map(([category, items]) => (
                    <div key={category} className="mb-6">
                        <h4 className="font-semibold mb-3 text-base">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {items.map((amenity) => (
                                <CustomFormField
                                    key={amenity.id}
                                    fieldType={FormFieldType.CHECKBOX_HIDDEN}
                                    control={form.control}
                                    name={amenity.id}
                                    label={amenity.label}
                                    iconSrc={amenity.icon}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRoommates = () => (
        <div className="space-y-6">
            <div className="space-y-6">
                <h2 className="text-lg font-semibold  text-muted-foreground uppercase">
                    Tenant Preferences
                </h2>

                <div className="mb-4">
                    <Label className="text-base mb-3 block">Preferred Gender</Label>
                    <CustomFormField
                        fieldType={FormFieldType.RADIO}
                        name="preferred_gender"
                        control={form.control}
                    >
                        {genderOptions.map((gender) => (
                            <div key={gender} className="relative">
                                <RadioGroupItem
                                    value={gender}
                                    id={gender}
                                    className="sr-only peer"
                                />
                                <Label
                                    htmlFor={gender}
                                    className={cn(
                                        "cursor-pointer px-4 py-2 rounded-md border transition-all duration-200",
                                        "peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary",
                                        "hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    {gender}
                                </Label>
                            </div>
                        ))}
                    </CustomFormField>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 space-y-6">
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="preferred_occupation"
                        label="Preferred Occupation"
                        placeholder="Select preferred occupation"
                    >
                        {occupationOptions.map((occupation) => (
                            <SelectItem key={occupation} value={occupation}>
                                {occupation}
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="tenant_religion_preference"
                        label="Religion Preference"
                        placeholder="Select religion preference"
                    >
                        {religionOptions.map((religion) => (
                            <SelectItem key={religion} value={religion}>
                                {religion}
                            </SelectItem>
                        ))}
                    </CustomFormField>
                </div>



                <div className="grid grid-cols-2 gap-4 mb-4 ">
                    <CustomFormField
                        fieldType={FormFieldType.NUMBER}
                        control={form.control}
                        name="age_range_min"
                        label="Minimum Age"
                        placeholder="ex: 18"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.NUMBER}
                        control={form.control}
                        name="age_range_max"
                        label="Maximum Age"
                        placeholder="ex: 99"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase">
                    Contact Information
                </h2>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="contact_name"
                    label="Contact Name"
                    placeholder="Your name"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                        fieldType={FormFieldType.NUMBER}
                        control={form.control}
                        name="contact_phone"
                        label="Contact Phone"
                        placeholder="10-digit phone number"
                        required

                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="contact_email"
                        label="Contact Email"
                        placeholder="your@email.com"
                        required

                    />
                </div>
            </div>


        </div>
    );

    const renderImages = () => (
        <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Upload up to 4 images. First image will be the cover photo.
                </p>
            </div>

            <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* <Label htmlFor="image-upload"> */}

            <Button
                variant="default"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={images.length >= 4}
                type="button"
            >
                <Upload className="mr-2 h-4 w-4" /> Upload Photos ({images.length}/4)
            </Button>
            {/* </Label> */}

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <Card key={index} className="relative">
                            <CardContent className="p-2">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-32 object-cover rounded"
                                />
                                {index === 0 && <Badge className="absolute top-2 left-2 bg-blue-600">Cover</Badge>}
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => removeImage(index)}
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const renderRules = () => (
        <div className="space-y-6">

            <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase">
                    Availability for Visits
                </h2>
                <div className="space-y-6">

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="available_for_visits"
                        label="Available for property visits"
                        className="flex"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="visiting_hours"
                        label="Visiting Hours"
                        placeholder="Mon-Fri 6-8 PM, Sat-Sun 10 AM-6 PM"
                        disabled={!form.watch("available_for_visits")}
                    />
                </div>
                <div className="space-y-6">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="terms"
                        label="House Rules & Terms"
                        placeholder="Describe house rules..."
                        labelClassname="font-bold"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="visibility"
                        label=" Make this listing visible to public"
                        className="flex"
                    />

                </div>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentSteps) {
            case "Basics":
                return renderBasics();
            case "Room Details":
                return renderRoomDetails();
            case "Roommates":
                return renderRoommates();
            case "Images":
                return renderImages();
            case "Rules":
                return renderRules();
            default:
                return null;
        }
    };

    return (
        <main className="mt-16 min-h-screen w-full flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-7xl mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Create Room Listing</h1>
                </div>
                {/* Progress Bar */}
                <Progress
                    value={((steps.indexOf(currentSteps) + 1) / steps.length) * 100}
                    className="my-6 h-2 bg-muted transition-all duration-500 ease-in-out"
                />
            </div>

            <div className="max-w-7xl w-full flex gap-6 bg-card rounded-lg shadow-lg overflow-hidden min-h-[600px]">
                <section className="flex-1 p-8 overflow-y-auto">
                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // stop unintended submits
                                form.handleSubmit(onSubmit)(e);
                            }}
                            className="flex flex-col justify-between h-full space-y-6"
                        >
                            {/* Animated Step Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSteps}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={steps.indexOf(currentSteps) === 0}
                                    onClick={() =>
                                        setCurrentSteps(
                                            steps[steps.indexOf(currentSteps) - 1] || steps[0]
                                        )
                                    }
                                    className="hover:cursor-pointer"
                                >
                                    Back
                                </Button>

                                {currentSteps !== "Rules" ? (
                                    <Button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // 🧠 stop bubbling before DOM swap

                                            // small delay ensures the click event finishes before Rules mounts
                                            setTimeout(() => {
                                                setCurrentSteps(
                                                    steps[steps.indexOf(currentSteps) + 1] || steps[steps.length - 1]
                                                );
                                            }, 50);
                                        }}
                                    >
                                        Next
                                    </Button>
                                ) : (

                                    <Button type="submit" variant="default">
                                        Submit Listing
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </section>

                {/* Sidebar — Step Tracker */}
                <aside className="hidden md:flex flex-col w-64 border-l bg-muted/20 p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Progress</h3>
                    <div className="flex flex-col space-y-2">
                        {steps.map((step) => (
                            <button
                                key={step}
                                type="button"
                                onClick={() => setCurrentSteps(step)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer",
                                    currentSteps === step
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )}
                            >
                                {step}
                                {currentSteps === step && (
                                    <Info className="h-4 w-4 text-primary-foreground" />
                                )}
                            </button>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default CreateListingPage;
