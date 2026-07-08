// import { useState, useEffect, useCallback, useMemo } from "react";
// import { getAppSettings, saveAppSettings } from "@/app/api";
// import { toast } from "react-hot-toast";
 
// interface AppSettingsData {
//     app_name: string;
//     app_logo: File | string | null;  
//     app_description: string;
//     support_email: string;
//     support_phone: string;
// }

// const initialData: AppSettingsData = {
//     app_name: "",
//     app_logo: null,
//     app_description: "",
//     support_email: "",
//     support_phone: "",
// };

// // const useAppSettingsForm = () => {
// //     const [originalSettings, setOriginalSettings] = useState<AppSettingsData>(initialData);
// //     const [values, setValues] = useState<AppSettingsData>(initialData);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [isSubmitting, setIsSubmitting] = useState(false);
    
// //     useEffect(() => {
// //         const fetchSettings = async () => {
// //             setIsLoading(true);
// //             try {
// //                 const response = await getAppSettings();
// //                 const data = response.data?.[0];
// //                 if (data) {
// //                     const settings = {
// //                         app_name: data.app_name || "",
// //                         app_logo: data.app_logo || null,
// //                         app_description: data.app_description || "",
// //                         support_email: data.support_email || "",
// //                         support_phone: data.support_phone || "",
// //                     };
// //                     setValues(settings);
// //                     setOriginalSettings(settings) 
// //                 }
// //             } catch (error) {
// //                 console.error("Failed to fetch settings", error);
// //                 toast.error("Could not load app settings.");
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         fetchSettings();
// //     }, []);

// //     const logoPreviewUrl = useMemo(() => {
// //         if (values.app_logo instanceof File) {
// //             return URL.createObjectURL(values.app_logo);
// //         }
// //         return values.app_logo as string | null;
// //     }, [values.app_logo]);

// //     const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //         const { id, value } = e.target;
// //         setValues((prev) => ({ ...prev, [id]: value }));
// //     }, []);

// //     const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
// //         const file = e.target.files?.[0];
// //         if (file) {
// //             setValues((prev) => ({ ...prev, app_logo: file }));
// //         }
// //     }, []);

// //     const handleReset = useCallback(() => {
// //         setValues(originalSettings);
// //     }, [originalSettings]);
    
// //     // Handle the form submission
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     const payload = new FormData();
// //     Object.entries(values).forEach(([key, value]) => {
// //         if (key === "app_logo") {
// //             if (value instanceof File) {
// //                 payload.append(key, value);
// //             }
// //         } else if (value !== null && value !== undefined) {
// //             payload.append(key, value as string);
// //         }
// //     });

// //     try {
// //         const data = await saveAppSettings(payload);
// //         if (data?.error_detail) {
// //             toast.error(data.error_detail);
// //             return;
// //         }

// //         const updatedSettings: AppSettingsData = {
// //             app_name: data.app_name || "",
// //             app_logo: data.app_logo || null,
// //             app_description: data.app_description || "",
// //             support_email: data.support_email || "",
// //             support_phone: data.support_phone || "",
// //         };

// //         setValues(updatedSettings);
// //         setOriginalSettings(updatedSettings);
// //         toast.success("Settings saved successfully!");
// //     } catch (error: unknown) {
// //         const err = error as { response?: { data?: { error_detail?: string } } };
// //         console.error("Submission error:", err);
// //         toast.error(err?.response?.data?.error_detail || "Failed to save settings.");
// //     } finally {
// //         setIsSubmitting(false);
// //     }
// // };


// //     return {
// //         values,
// //         isLoading,
// //         isSubmitting,
// //         logoPreviewUrl,
// //         handleChange,
// //         handleFileChange,
// //         handleSubmit,
// //         handleReset,
// //     };
// // };