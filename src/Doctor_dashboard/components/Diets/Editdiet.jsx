import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { vendorService } from '../../../services/vendorService';
import toast from 'react-hot-toast';
import { doctorService } from '../../../services/doctorService';
import {
    Star,
    X,
    Plus,
    ImageIcon,
    ChevronDown,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sunrise,
    Coffee,
    Sun,
    UtensilsCrossed,
    Moon,
    Info,
    Trash2,
    Pencil,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Small shared UI primitives (kept local so this file stays a drop-in swap)
// ---------------------------------------------------------------------------

const Toggle = ({ checked, onChange, label, id, name }) => (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer select-none">
        <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />
            <span className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-[#0D614E] transition-colors" />
            <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
);

const SectionHeader = ({ title, description, action }) => (
    <div className="flex items-start justify-between gap-4 mb-4">
        <div>
            <h4 className="text-base font-semibold text-gray-900">{title}</h4>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        {action}
    </div>
);

const mealMeta = {
    morning: { label: 'Morning', Icon: Sunrise },
    breakfast: { label: 'Breakfast', Icon: Coffee },
    midday: { label: 'Midday', Icon: Sun },
    lunch: { label: 'Lunch', Icon: UtensilsCrossed },
    dinner: { label: 'Dinner', Icon: Moon },
};

const DietPlanManager = () => {
    const { id } = useParams();


    const [formData, setFormData] = useState({
        name: '',
        prakriti: '',
        season: '',
        health_diseases: [],
        is_paid: false,
        price: '',
        is_common: false,
        diet_plan_gallery: [],
        schedule: {}
    });

    const [numberOfDays, setNumberOfDays] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditMode, setIsEditMode] = useState((id ? true : false));
    const [dietPlanId, setDietPlanId] = useState(id || '');
    const [activeDay, setActiveDay] = useState('day_1');
    const [diseasesCategories, setDiseasesCategories] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    // UI-only: which meal accordions are open per day (key = `${dayKey}-${meal}`)
    const [expandedMeals, setExpandedMeals] = useState(new Set(['day_1-morning']));
    const fileInputRef = useRef(null);

    // Meal types for each day
    const mealTypes = ['morning', 'breakfast', 'midday', 'lunch', 'dinner'];

    useEffect(() => {
        fetchdatabrandcat();
        if (id) {
            fetchDietPlanData(id);
        }
    }, []);

    const fetchDietPlanData = async (id) => {
        try {
            const response = await doctorService.getdietbyid(id);
            const dietPlan = response?.data?.data || response?.data || {};
            setFormData(dietPlan);
            setGalleryImages(dietPlan?.diet_plan_gallery || []);
            setNumberOfDays(Object.keys(dietPlan.schedule).length || 1);
        } catch (error) {
            console.error("Error fetching diet plan data:", error);
            toast.error(error?.message || "Failed to fetch diet plan data");
        }
    };

    const fetchdatabrandcat = async () => {
        try {
            // const data = await doctorService.getdiet();
            const [diseasescat] = await Promise.all([
                vendorService.getbrandandcategory("health-diseases"),
            ]);
            const diseasescate = diseasescat?.data?.data || diseasescat?.data || [];
            setDiseasesCategories(diseasescate);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(error?.message || "Failed to fetch data");
        }
    };

    // Initialize schedule with empty days
    const initializeSchedule = (days) => {
        const schedule = {};
        for (let i = 1; i <= days; i++) {
            const dayKey = `day_${i}`;
            schedule[dayKey] = {};
            mealTypes.forEach(meal => {
                schedule[dayKey][meal] = {
                    diet: [''],
                    preparation_steps: [''],
                    nutrition: {
                        total_calories: { value: '', unit: 'kcal' },
                        carbs: { value: '', unit: 'g' },
                        protein: { value: '', unit: 'g' },
                        fat: { value: '', unit: 'g' }
                    }
                };
            });
        }
        return schedule;
    };

    // Initialize form
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            schedule: initializeSchedule(numberOfDays)
        }));
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle disease selection
    const handleDiseaseChange = (e) => {
        const selectedDiseaseId = e.target.value;
        const selectedDisease = diseasesCategories.find(cat => cat.id === selectedDiseaseId);

        if (selectedDisease) {
            setFormData(prev => ({
                ...prev,
                health_diseases: [{
                    id: selectedDisease.id,
                    name: selectedDisease.name
                }]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                health_diseases: []
            }));
        }
    };

    // Upload images to S3
    const handleGalleryUpload = async (e, type = 'diet') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const uploadedUrls = [];

        try {
            const validFiles = Array.from(files).filter(file => file && file.type && file.type.startsWith('image/'));

            if (validFiles.length === 0) {
                toast.error('Please select valid image files');
                setUploadingImages(false);
                return;
            }

            for (let i = 0; i < validFiles.length; i++) {
                try {
                    const file = validFiles[i];
                    const response = await vendorService.uploadfiles(file, "diet_plan_images");
                    const imageUrl = response?.data?.data?.url || response?.data?.url;

                    if (imageUrl) {
                        uploadedUrls.push(imageUrl);
                    } else {
                        console.error('No URL in response for image', i);
                        toast.error(`Failed to upload image ${i + 1}`);
                    }
                } catch (error) {
                    console.error(`Error uploading image ${i + 1}:`, error);
                    toast.error(`Error uploading image ${i + 1}: ${error.message || 'Unknown error'}`);
                }
            }

            if (uploadedUrls.length > 0) {
                const newImages = uploadedUrls.map((url, index) => ({
                    id: `temp_${Date.now()}_${index}`,
                    image_url: url,
                    is_cover: galleryImages.length === 0 && index === 0,
                    caption: `Image ${galleryImages.length + index + 1}`
                }));

                setGalleryImages(prev => [...prev, ...newImages]);
                toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
            } else {
                toast.error('No images were uploaded successfully');
            }
        } catch (error) {
            console.error('Error in upload process:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploadingImages(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        handleGalleryUpload(e, 'diet');
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Create a synthetic event for handleGalleryUpload
            const syntheticEvent = { target: { files } };
            handleGalleryUpload(syntheticEvent, 'diet');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Drag and drop reordering
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOverItem = (e, index, type = 'diet') => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...galleryImages];
        const draggedItem = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);
        setGalleryImages(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Handle gallery image management
    const addGalleryImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSetAsCover = (index) => {
        const updatedImages = galleryImages.map((img, idx) => ({
            ...img,
            is_cover: idx === index
        }));
        setGalleryImages(updatedImages);
        toast.success('Cover image updated successfully');
    };

    const handleRemoveImage = (index) => {
        setGalleryImages(prev => prev.filter((_, idx) => idx !== index));
        toast.success('Image removed successfully');
    };

    // Handle day schedule changes
    const handleDayScheduleChange = (dayKey, mealType, field, value, subField = null, subSubField = null) => {
        setFormData(prev => {
            const updatedSchedule = { ...prev.schedule };

            if (field === 'diet' || field === 'preparation_steps') {
                if (subField !== null) {
                    const newArray = [...updatedSchedule[dayKey][mealType][field]];
                    newArray[subField] = value;
                    updatedSchedule[dayKey][mealType][field] = newArray;
                }
            } else if (field === 'nutrition') {
                if (subField && subSubField !== null) {
                    updatedSchedule[dayKey][mealType].nutrition[subField][subSubField] = value;
                }
            }

            return { ...prev, schedule: updatedSchedule };
        });
    };

    // Add item to diet or preparation steps
    const addScheduleItem = (dayKey, mealType, field) => {
        setFormData(prev => {
            const updatedSchedule = { ...prev.schedule };
            updatedSchedule[dayKey][mealType][field].push('');
            return { ...prev, schedule: updatedSchedule };
        });
    };

    // Remove item from diet or preparation steps
    const removeScheduleItem = (dayKey, mealType, field, index) => {
        if (formData.schedule[dayKey][mealType][field].length <= 1) return;
        setFormData(prev => {
            const updatedSchedule = { ...prev.schedule };
            updatedSchedule[dayKey][mealType][field].splice(index, 1);
            return { ...prev, schedule: updatedSchedule };
        });
    };

    // Add new day
    const addDay = () => {
        const newDayCount = numberOfDays + 1;
        setNumberOfDays(newDayCount);
        const newDayKey = `day_${newDayCount}`;
        setFormData(prev => {
            const updatedSchedule = { ...prev.schedule };
            updatedSchedule[newDayKey] = {};
            mealTypes.forEach(meal => {
                updatedSchedule[newDayKey][meal] = {
                    diet: [''],
                    preparation_steps: [''],
                    nutrition: {
                        total_calories: { value: '', unit: 'kcal' },
                        carbs: { value: '', unit: 'g' },
                        protein: { value: '', unit: 'g' },
                        fat: { value: '', unit: 'g' }
                    }
                };
            });
            console.log('Added new day:', updatedSchedule);
            return { ...prev, schedule: updatedSchedule };
        });

        setActiveDay(newDayKey);
        setExpandedMeals(new Set([`${newDayKey}-morning`]));
    };

    // Remove last day
    const removeDay = () => {
        if (numberOfDays <= 1) return;
        const dayKey = `day_${numberOfDays}`;
        setFormData(prev => {
            const updatedSchedule = { ...prev.schedule };
            delete updatedSchedule[dayKey];
            return { ...prev, schedule: updatedSchedule };
        });
        setNumberOfDays(prev => prev - 1);
        setActiveDay(`day_${numberOfDays - 1}`);
    };

    // Submit form (Create)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const validGallery = galleryImages
                .filter(img => img.image_url && img.image_url.trim() !== '')
                .map(img => ({
                    image_url: img.image_url,
                    is_cover: img.is_cover || false,
                    caption: img.caption || ''
                }));

            const payload = {
                name: formData.name,
                prakriti: formData.prakriti,
                season: formData.season,
                health_diseases: formData.health_diseases,
                diet_plan_gallery: validGallery,
                is_paid: formData.is_paid,
                price: parseFloat(formData.price) || 0,
                is_common: formData.is_common,
                schedule: formData.schedule
            };

            const response = await doctorService.adddiet(payload);
            setMessage({ type: 'success', text: 'Diet plan created successfully!' });
            toast.success('Diet plan created successfully!');
            resetForm();
        } catch (error) {
            console.error('Error creating diet plan:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create diet plan' });
        } finally {
            setLoading(false);
        }
    };

    // Update form (Edit)
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!dietPlanId) {
            setMessage({ type: 'error', text: 'Please provide a diet plan ID to update' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const validGallery = galleryImages
                .filter(img => img.image_url && img.image_url.trim() !== '')
                .map(img => ({
                    image_url: img.image_url,
                    is_cover: img.is_cover || false,
                    caption: img.caption || ''
                }));

            const payload = {
                name: formData.name,
                prakriti: formData.prakriti,
                season: formData.season,
                health_diseases: formData.health_diseases,
                diet_plan_gallery: validGallery,
                is_paid: formData.is_paid,
                price: parseFloat(formData.price) || 0,
                is_common: formData.is_common,
                schedule: formData.schedule
            };

            const response = await doctorService.updatediet(dietPlanId, payload);
            setMessage({ type: 'success', text: 'Diet plan updated successfully!' });
            toast.success('Diet plan updated successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error updating diet plan:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update diet plan' });
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            prakriti: '',
            season: '',
            health_diseases: [],
            is_paid: false,
            price: '',
            is_common: false,
            diet_plan_gallery: [],
            schedule: initializeSchedule(1)
        });
        setGalleryImages([]);
        setNumberOfDays(7);
        setActiveDay('day_1');
        setIsEditMode(false);
        setDietPlanId('');
        setExpandedMeals(new Set(['day_1-morning']));
    };

    // Load data for edit mode
    const loadEditData = (data) => {
        setIsEditMode(true);
        setFormData(data);
        const gallery = data.diet_plan_gallery || [];
        setGalleryImages(gallery.map((img, index) => ({
            ...img,
            id: img.id || `existing_${index}`
        })));
        const days = Object.keys(data.schedule).length;
        setNumberOfDays(days);
        setActiveDay('day_1');
    };

    // Get cover image
    const getCoverImage = () => {
        return galleryImages.find(img => img.is_cover) || galleryImages[0] || null;
    };

    // UI-only: toggle a meal accordion open/closed
    const toggleMeal = (dayKey, mealType) => {
        const key = `${dayKey}-${mealType}`;
        setExpandedMeals(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    // UI-only: how many diet items have real content, for the meal summary chip
    const filledCount = (arr) => arr.filter(v => v && v?.trim() !== '').length;

    // Render meal section for a day
    const renderMealSection = (dayKey, mealType) => {
        console.log('Rendering meal section for', dayKey, mealType);
        const mealData = formData.schedule[dayKey]?.[mealType];
        console.log(formData, 'Current schedule data');


        if (!mealData) return null;

        const { label: mealLabel, Icon: MealIcon } = mealMeta[mealType] || { label: mealType, Icon: UtensilsCrossed };
        const isOpen = expandedMeals.has(`${dayKey}-${mealType}`);
        const dietCount = 1 || filledCount(mealData.diet);
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleMeal(dayKey, mealType)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D614E]/10 text-[#0D614E]">
                            <MealIcon size={16} />
                        </span>
                        <span className="font-semibold text-gray-800">{mealLabel}</span>
                        {dietCount > 0 && (
                            <span className="text-xs text-gray-400">
                                {dietCount} item{dietCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4">
                        {/* Diet Items */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Diet Items
                            </label>
                            <div className="space-y-2">
                                {mealData.diet.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item?.name ? item?.name : item}
                                            onChange={(e) => handleDayScheduleChange(dayKey, mealType, 'diet', e.target.value, idx)}
                                            className=""
                                            placeholder={`Item ${idx + 1}`}
                                        />
                                        {mealData.diet.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeScheduleItem(dayKey, mealType, 'diet', idx)}
                                                className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Remove item"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => addScheduleItem(dayKey, mealType, 'diet')}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#0D614E] hover:text-[#0A4D3D]"
                            >
                                <Plus size={14} /> Add item
                            </button>
                        </div>

                        {/* Preparation Steps */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Preparation Steps
                            </label>
                            <div className="space-y-2">
                                {mealData.preparation_steps.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold flex items-center justify-center">
                                            {idx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={step}
                                            onChange={(e) => handleDayScheduleChange(dayKey, mealType, 'preparation_steps', e.target.value, idx)}
                                            className=""
                                            placeholder={`Step ${idx + 1}`}
                                        />
                                        {mealData.preparation_steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeScheduleItem(dayKey, mealType, 'preparation_steps', idx)}
                                                className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Remove step"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => addScheduleItem(dayKey, mealType, 'preparation_steps')}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#0D614E] hover:text-[#0A4D3D]"
                            >
                                <Plus size={14} /> Add step
                            </button>
                        </div>

                        {/* Nutrition */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Nutrition
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                {['total_calories', 'carbs', 'protein', 'fat'].map((nutrient) => (
                                    <div key={nutrient}>
                                        <label className="block text-xs text-gray-500 mb-1 capitalize">
                                            {nutrient.replace('_', ' ')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={mealData.nutrition[nutrient].value}
                                                onChange={(e) => handleDayScheduleChange(dayKey, mealType, 'nutrition', e.target.value, nutrient, 'value')}
                                                className=""
                                                placeholder="0"
                                            />
                                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
                                                {mealData.nutrition[nutrient].unit}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const cover = getCoverImage();

    return (
        <div className="max-w-8xl mx-auto p-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold  text-[#0D614E]  bg-clip-text">
                        {isEditMode ? 'Update Diet Plan' : 'Create New Diet Plan'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEditMode ? 'Editing an existing plan.' : 'Build a day-by-day diet plan for your patients.'}
                    </p>
                </div>

                {/* Mode switch, moved up next to the title */}
                {/* <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${!isEditMode ? 'bg-white text-[#0D614E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Create
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditMode(true)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${isEditMode ? 'bg-white text-[#0D614E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Pencil size={13} /> Edit
                    </button>
                </div> */}
            </div>

            {/* {isEditMode && (
                <div className="mb-6 flex items-center gap-2">
                    <input
                        type="text"
                        value={dietPlanId}
                        onChange={(e) => setDietPlanId(e.target.value)}
                        placeholder="Enter Diet Plan ID to update"
                        className="w-72 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D614E] focus:border-transparent"
                    />
                </div>
            )} */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Message */}
                {message.text && (
                    <div
                        className={`flex items-start gap-2.5 p-3.5 rounded-lg mb-5 border ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm flex-1">{message.text}</p>
                        <button
                            type="button"
                            onClick={() => setMessage({ type: '', text: '' })}
                            className="shrink-0 text-current opacity-60 hover:opacity-100"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
                    {/* ---------------------------------------------------- */}
                    {/* Gallery Section                                      */}
                    {/* ---------------------------------------------------- */}
                    <div className="pb-6 mb-6 border-b border-gray-100">
                        <SectionHeader
                            title="Diet Plan Images"
                            description="Upload high-quality images. The first image will be your cover image."
                            action={<span className="text-xs text-gray-400 shrink-0">Max 8 images · JPG/PNG up to 5MB</span>}
                        />

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Cover + tips */}
                        <div className="flex flex-col sm:flex-row gap-5 mb-5">
                            <div className="items-center relative w-1/2 max-h-[450px]  shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                {cover ? (
                                    <>
                                        <img
                                            src={cover.image_url}
                                            alt="Cover"
                                            className=" object-cover mx-auto min-h-[300px] "
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const coverIndex = galleryImages.findIndex(img => img.is_cover);
                                                if (coverIndex !== -1) handleRemoveImage(coverIndex);
                                            }}
                                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/55 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                                            title="Remove cover image"
                                        >
                                            <X size={11} />
                                        </button>
                                        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-white text-gray-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                                            <Star size={8} className="text-amber-400 fill-amber-400" />
                                            Cover
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={addGalleryImage}
                                        className="w-full h-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0D614E] hover:bg-gray-50 transition-colors"
                                    >
                                        <ImageIcon className="w-6 h-6 text-gray-300" />
                                        <span className="text-[10px] text-gray-400">Add cover</span>
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 space-y-2.5 min-w-0">
                                <div className="rounded-lg bg-blue-50/70 border border-blue-100 px-3 py-2.5">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Star size={12} className="text-blue-500 fill-blue-500" />
                                        <p className="text-xs font-semibold text-gray-800">Cover Image</p>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-snug">
                                        This image will be displayed as the main image for this diet plan.
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50/70 border border-blue-100 px-3 py-2.5">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Info size={12} className="text-blue-500" />
                                        <p className="text-[11px] font-semibold tracking-wide text-blue-700">
                                            TIPS FOR BEST RESULTS
                                        </p>
                                    </div>
                                    <ul className="space-y-1">
                                        {[
                                            'Use high resolution images',
                                            'Good lighting and clear background',
                                            'Show the meal clearly',
                                            'Recommended background (100% white)',
                                        ].map((tip) => (
                                            <li key={tip} className="flex items-start gap-1.5 text-xs text-gray-600">
                                                <span className="text-blue-500 mt-0.5">✓</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Gallery grid */}
                        <div>
                            <div className="flex items-baseline gap-2 mb-2.5">
                                <p className="text-sm font-medium text-gray-800">
                                    Diet Gallery
                                    {galleryImages.length > 0 && (
                                        <span className="text-gray-400 font-normal"> ({galleryImages.length}/8)</span>
                                    )}
                                </p>
                                <span className="text-xs text-gray-400">Drag to reorder</span>
                            </div>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-w-6xl"
                            >
                                {galleryImages.map((image, index) => (
                                    <div
                                        key={image.id || index}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOverItem(e, index, 'diet')}
                                        onDragEnd={handleDragEnd}
                                        className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 cursor-move transition-all ${image.is_cover ? 'border-[#0D614E] ring-2 ring-[#0D614E]/25' : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

                                        {image.is_cover && (
                                            <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-white text-gray-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                                                <Star size={8} className="text-amber-400 fill-amber-400" />
                                                Cover
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/55 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove image"
                                        >
                                            <X size={9} />
                                        </button>

                                        {!image.is_cover && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetAsCover(index)}
                                                className="absolute bottom-1 left-1 right-1 flex items-center justify-center gap-0.5 bg-white/90 hover:bg-white text-gray-700 text-[8px] font-medium py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                            >
                                                <Star size={8} />
                                                Cover
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {galleryImages.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={addGalleryImage}
                                        disabled={uploadingImages}
                                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0D614E] hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                                    >
                                        {uploadingImages ? (
                                            <Loader2 className="w-4 h-4 text-[#0D614E] animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 text-gray-400" />
                                                <span className="text-[9px] font-medium text-gray-600">Upload</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {uploadingImages && (
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Uploading images…
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Basic Information                                    */}
                    {/* ---------------------------------------------------- */}
                    <div className="pb-6 mb-6 border-b border-gray-100">
                        <SectionHeader title="Basic Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Plan Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Weight Loss Diet Plan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prakriti <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="prakriti"
                                    value={formData.prakriti}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Prakriti</option>
                                    <option value="Vata">Vata</option>
                                    <option value="Pitta">Pitta</option>
                                    <option value="Kapha">Kapha</option>
                                    <option value="Vata-Pitta">Vata-Pitta</option>
                                    <option value="Vata-Kapha">Vata-Kapha</option>
                                    <option value="Pitta-Kapha">Pitta-Kapha</option>
                                    <option value="Tridoshic">Tridoshic</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Season <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="season"
                                    value={formData.season}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Season</option>
                                    <option value="summer">Summer</option>
                                    <option value="winter">Winter</option>
                                    <option value="spring">Spring</option>
                                    <option value="autumn">Autumn</option>
                                    <option value="rainy">Rainy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Health Disease <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.health_diseases[0]?.id || ''}
                                    onChange={handleDiseaseChange}
                                    required
                                >
                                    <option value="">Select Health Disease</option>
                                    {diseasesCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Pricing & Settings                                   */}
                    {/* ---------------------------------------------------- */}
                    <div className="pb-6 mb-6 border-b border-gray-100">
                        <SectionHeader title="Pricing & Visibility" />
                        <div className="flex flex-wrap items-center gap-6 mb-4">
                            <Toggle
                                id="is_paid"
                                name="is_paid"
                                checked={formData.is_paid}
                                onChange={handleInputChange}
                                label="Paid Plan"
                            />
                            <Toggle
                                id="is_common"
                                name="is_common"
                                checked={formData.is_common}
                                onChange={handleInputChange}
                                label="Common Plan"
                            />
                        </div>

                        {formData.is_paid && (
                            <div className="max-w-xs animate-in fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Day-by-day schedule                                  */}
                    {/* ---------------------------------------------------- */}
                    <div className="pb-2">
                        <SectionHeader
                            title="Daily Schedule"
                            description="Add meals and nutrition details for each day of the plan."
                        />

                        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                {Array.from({ length: numberOfDays }, (_, i) => i + 1).map((dayNum) => {
                                    const dayKey = `day_${dayNum}`;
                                    return (
                                        <button
                                            key={dayKey}
                                            type="button"
                                            onClick={() => setActiveDay(dayKey)}
                                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDay === dayKey
                                                ? 'bg-[#0D614E] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            Day {dayNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={addDay}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0D614E] text-white rounded-md hover:bg-[#0A4D3D] text-sm font-medium"
                                >
                                    <Plus size={14} /> Add Day
                                </button>
                                {numberOfDays > 1 && (
                                    <button
                                        type="button"
                                        onClick={removeDay}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-md hover:bg-red-50 text-sm font-medium"
                                    >
                                        <Trash2 size={14} /> Remove Day
                                    </button>
                                )}
                            </div>
                        </div>

                        {console.log(activeDay, formData.schedule[activeDay])}
                        {activeDay && formData.schedule[activeDay] && (
                            <div className="space-y-2.5">

                                {mealTypes.map((meal) => (
                                    <div key={meal}>{renderMealSection(activeDay, meal)}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Form Actions — sticky within the card                */}
                    {/* ---------------------------------------------------- */}
                    <div className="sticky bottom-0 -mx-6 mt-6 px-6 py-4 bg-white/95 backdrop-blur border-t border-gray-100 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={loading || uploadingImages}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0D614E] text-white rounded-lg hover:bg-[#0A4D3D] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Processing…' : isEditMode ? 'Update Plan' : 'Create Plan'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DietPlanManager;