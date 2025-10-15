// Extended Create Listing Page with amenities, gender preferences, and visit availability
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Upload, X } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";



// Validation schema
const listingSchema = z.object({
    title: z.string().min(3, "Title is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pin_code: z.string().min(6, "PIN code must be 6 digits"),
    rent: z.string(),
    deposit: z.string(),
    maintenance: z.string().optional(),
    available_from: z.date().optional(),
    description: z.string().optional(),
    room_type: z.string().optional(),
    furnishing: z.string().optional(),
    bathroom_type: z.string().optional(),
    kitchen_access: z.string().optional(),
    room_size: z.string().optional(),
    has_balcony: z.string().optional(),
    contact_name: z.string().min(1, "Name is required"),
    contact_phone: z.string().min(10, "Phone is required"),
    contact_email: z.string().email("Invalid email"),
    terms: z.string().optional(),
    gender_preferences: z.array(z.string()).optional(),
    amenities: z.record(z.boolean()).optional(),
    visit_available: z.boolean().optional(),
    visiting_hours: z.string().optional(),
});

const CreateListingPage = () => {
    const steps = ["Basics", "Details", "Roommates", "Images", "Rules"];
    const [currentSteps, setCurrentSteps] = useState("Basics");
    const [images, setImages] = useState<File[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [amenities, setAmenities] = useState({
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
    });

    const genderOptions = ["Male", "Female", "Any", "Others"];

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
            address: "",
            city: "",
            state: "",
            pin_code: "",
            rent: "",
            deposit: "",
            maintenance: "",
            contact_name: "",
            contact_phone: "",
            contact_email: "",
            gender_preferences: [],
            amenities: {},
            visiting_hours: "",
        },
    });

    const toggleGender = (gender: string) => {
        setSelectedGenders((prev) =>
            prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
        );
    };

    const toggleAmenity = (id: string) => {
        setAmenities((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages((prev) => [...prev, ...filesArray]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: z.infer<typeof listingSchema>) => {
        const payload = {
            ...data,
            gender_preferences: selectedGenders,
            amenities,
        };
        toast.success("Listing submitted successfully!");
        console.log(payload);
    };

    const renderBasics = () => (
        <div className="space-y-6">
            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="title" label="Title" placeholder="Spacious 2BHK near Metro Station" />
            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="address" label="Address" placeholder="Complete address" />
            <div className="grid grid-cols-2 gap-4">
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="city" label="City" placeholder="Mumbai" />
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="state" label="State" placeholder="Maharashtra" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="pin_code" label="PIN Code" placeholder="400001" />
                <CustomFormField fieldType={FormFieldType.DATE_Picker} control={form.control} name="available_from" label="Available From" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="rent" label="Monthly Rent (₹)" placeholder="10000" />
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="deposit" label="Security Deposit (₹)" placeholder="5000" />
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="maintenance" label="Maintenance (₹)" placeholder="1000" />
            </div>
        </div>
    );

    const renderDetails = () => (
        <div className="space-y-6">
            <CustomFormField fieldType={FormFieldType.SELECT} control={form.control} name="room_type" label="Room Type" placeholder="Select room type">
                <option value="Private Room">Private Room</option>
                <option value="Shared">Shared</option>
                <option value="PG">PG</option>
                <option value="Studio">Studio</option>
            </CustomFormField>
            <CustomFormField fieldType={FormFieldType.TEXTAREA} control={form.control} name="description" label="Description" placeholder="Describe your listing..." />

            <div>
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                {Object.entries(amenitiesConfig).map(([category, items]) => (
                    <div key={category} className="mb-6">
                        <h4 className="font-semibold mb-3 text-base">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {items.map((a) => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                                        amenities[a.id as keyof typeof amenities]
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <span className="text-xl">{a.icon}</span>
                                    <span className="text-sm text-left flex-1">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRoommates = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase">
                    Tenant Preferences
                </h2>
                <div className="mb-4">
                    <label className="text-base mb-3 block">Preferred Gender</label>
                    <div className="flex gap-3 flex-wrap">
                        {genderOptions.map((g) => (
                            <Badge
                                key={g}
                                variant={selectedGenders.includes(g) ? "default" : "outline"}
                                className="cursor-pointer px-4 py-2"
                                onClick={() => toggleGender(g)}
                            >
                                {g}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase">
                    Contact Information
                </h2>
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="contact_name" label="Contact Name" placeholder="Your name" />
                <div className="grid grid-cols-2 gap-4">
                    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="contact_phone" label="Contact Phone" placeholder="10-digit phone number" />
                    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="contact_email" label="Contact Email" placeholder="your@email.com" />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase">
                    Availability for Visits
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="available_for_visits" />
                        <label htmlFor="available_for_visits" className="text-base font-normal cursor-pointer">
                            Available for property visits
                        </label>
                    </div>
                    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="visiting_hours" label="Visiting Hours" placeholder="Mon-Fri 6-8 PM, Sat-Sun 10 AM-6 PM" />
                </div>
            </div>
        </div>
    );

    const renderImages = () => (
        <div className="space-y-6">
            <input type="file" id="image-upload" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            <label htmlFor="image-upload">
                <Button variant="default" onClick={() => document.getElementById("image-upload")?.click()} disabled={images.length >= 4}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Photos ({images.length}/4)
                </Button>
            </label>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <Card key={index} className="relative">
                            <CardContent className="p-2">
                                <img src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded" />
                                {index === 0 && <Badge className="absolute top-2 left-2 bg-blue-600">Cover</Badge>}
                                <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeImage(index)}>
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
            <CustomFormField fieldType={FormFieldType.TEXTAREA} control={form.control} name="terms" label="House Rules & Terms" placeholder="Describe house rules..." />
            <div className="flex items-center space-x-2">
                <Checkbox id="visibility" defaultChecked />
                <label htmlFor="visibility" className="text-base font-normal cursor-pointer">
                    Make this listing visible to public
                </label>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentSteps) {
            case "Basics":
                return renderBasics();
            case "Details":
                return renderDetails();
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
                    <Button variant="outline">Save and Close</Button>
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
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col justify-between h-full space-y-6"
                        >
                            {/* Step Content */}
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
                                >
                                    Back
                                </Button>

                                {currentSteps !== "Rules" ? (
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setCurrentSteps(
                                                steps[steps.indexOf(currentSteps) + 1] ||
                                                steps[steps.length - 1]
                                            )
                                        }
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
                                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
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
