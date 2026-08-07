import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Save, X, Edit2, Activity, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorService } from '../../../services/doctorService';

const DoctorQAPanelPremium = ({ patientid }) => {
    const [questions, setQuestions] = useState([]);
    const [medquestions, setMedQuestions] = useState([]);
    const [prakartiquestions, setprakartiQuestions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editValueid, setEditValueid] = useState([]);
    const [editMultiValues, setEditMultiValues] = useState([]);
    const [loading, setloading] = useState(true);
    const [loadingq, setloadingq] = useState(false);
    const [questiontype, setquestiontype] = useState('prakriti');

    const fetchquestions = useCallback(async () => {
        if (!patientid) return;
        try {
            setloading(true);
            const res = await doctorService.questionforpatient(patientid);
            const prakritiQs = res?.data?.data?.prakriti?.questions || [];
            const medicalQs = res?.data?.data?.medical_history?.questions || [];
            setprakartiQuestions(prakritiQs);
            setMedQuestions(medicalQs);
            setEditingId(null);
        } catch (error) {
            toast.error('Question fetch error.');
        } finally {
            setloading(false);
            setloadingq(false);
        }
    }, [patientid]);

    useEffect(() => {
        fetchquestions();
    }, [fetchquestions]);

    useEffect(() => {
        setQuestions(questiontype === 'prakriti' ? prakartiquestions : medquestions);
        setEditingId(null);
    }, [questiontype, prakartiquestions, medquestions]);

    const startEdit = (question) => {
        setEditingId(question.id);
        if (question.answer_type === 'multi_choice') {
            const selected = question.choices?.filter(c => c.is_selected).map(c => c.value) || [];
            const selectedIds = question.choices?.filter(c => c.is_selected).map(c => c.index) || [];
            setEditMultiValues(selected);
            setEditValueid(selectedIds);
            setEditValue('');
        } else if (question.answer_type === 'choice') {
            const selected = question.choices?.find(c => c.is_selected);
            setEditValue(selected?.value || '');
            setEditValueid(selected ? [selected.index] : []);
            setEditMultiValues([]);
        } else {
            setEditValue(question.answer || question.patient_answer || '');
            setEditMultiValues([]);
            setEditValueid([]);
        }
    };

    const saveQuestions = async (data) => {
        try {
            setloadingq(true);
            const res = await doctorService.questionfillforpatient(data);
            if (res?.data?.success) {
                toast.success('Questions saved successfully.');
                setEditValue('');
                setEditValueid([]);
                setEditMultiValues([]);
                setEditingId(null);
                await fetchquestions();
            } else {
                toast.error(res?.data?.message || 'Failed to save questions.');
            }
        } catch (error) {
            toast.error('Questions save failed.');
        } finally {
            setloadingq(false);
        }
    };

    const saveEdit = async (question) => {
        const answerPayload = question.answer_type === 'multi_choice'
            ? editValueid
            : (editValueid[0] >= 0 ? editValueid[0] : editValue);

        await saveQuestions({
            patient_id: patientid,
            experience_type: questiontype,
            answers: { [question.id]: answerPayload },
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
        setEditMultiValues([]);
        setEditValueid([]);
    };

    const toggleMultiValue = (choice) => {
        setEditMultiValues(prev =>
            prev.includes(choice.value) ? prev.filter(v => v !== choice.value) : [...prev, choice.value]
        );
        setEditValueid(prev =>
            prev.includes(choice.index) ? prev.filter(i => i !== choice.index) : [...prev, choice.index]
        );
    };

    const isAnswered = (question) => {
        if (question.choices?.some(c => c.is_selected)) return true;
        if (question.answer_type === 'multi_choice') {
            return question.patient_answer?.length > 0;
        }
        return Boolean(question.patient_answer?.trim() || question.answer?.trim());
    };

    const completedCount = questions?.filter(isAnswered).length;

    if (loading && !questions[0]) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                    <p className="text-sm text-gray-500 font-medium">Loading Questions details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="relative mb-4 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D614E] via-[#12806A] to-[#1A9C7A] p-8 text-white">
                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div className="flex gap-5 mt-2">
                            <button
                                onClick={() => setquestiontype('prakriti')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-sm font-semibold transition-all border ${questiontype === 'prakriti' ? 'text-[#0D614E] bg-white' : 'text-white border-white'}`}
                            >
                                Prakriti Questions
                            </button>
                            <button
                                onClick={() => setquestiontype('medical_history')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-sm font-semibold transition-all border ${questiontype === 'medical_history' ? 'text-[#0D614E] bg-white' : 'text-white border-white'}`}
                            >
                                Medical history
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-white">{completedCount}/{questions.length}</p>
                            <p className="text-emerald-100">Completed</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <p className="text-slate-500 text-sm">Total Questions</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{questions.length}</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <p className="text-emerald-600 text-sm">Answered</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <p className="text-orange-500 text-sm">Pending</p>
                        <h3 className="text-2xl font-bold text-orange-500 mt-1">{questions.length - completedCount}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {questions.map((question, idx) => {
                        const isEditing = editingId === question.id;
                        const answered = isAnswered(question);
                        const selectedChoices = question.choices?.filter(c => c.is_selected) || [];

                        return (
                            <div
                                key={question.id}
                                className={`group bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${answered ? 'border-[#0D614E]' : 'border-gray-200'}`}
                            >
                                <div className={`p-3 border-b rounded-t-xl ${answered ? 'bg-[#0D614E]/5' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${answered ? 'bg-[#0D614E] text-white' : 'bg-gray-300 text-gray-600'}`}>
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800">{question.question}</span>
                                        </div>
                                        {answered && <CheckCircle2 className="w-4 h-4 text-[#0D614E]" />}
                                    </div>
                                </div>

                                <div className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            {selectedChoices.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedChoices.map((ans, i) => (
                                                        <span key={i} className="text-sm text-white font-medium bg-[#0D614E]/90 px-2 py-1 rounded-[4px]">
                                                            {ans.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : question.answer ? (
                                                <span className="text-sm text-white font-medium bg-[#0D614E]/90 px-2 py-1 rounded-[4px] inline-block">{question.answer}</span>
                                            ) : (
                                                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                    <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                                                    Not answered yet - Click edit to fill
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => startEdit(question)}
                                            className="p-1.5 text-gray-400 hover:text-[#0D614E] hover:bg-[#0D614E]/5 rounded-lg transition-colors"
                                            title="Edit Answer"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            {question.answer_type === 'multi_choice' ? (
                                                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                                    {question.choices.map((choice) => (
                                                        <label key={choice.index} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                                                            <input
                                                                type="checkbox"
                                                                checked={editMultiValues.includes(choice.value)}
                                                                onChange={() => toggleMultiValue(choice)}
                                                                className="w-4 h-4 rounded accent-[#0D614E]"
                                                            />
                                                            <span className="text-sm text-gray-700 flex-1">{choice.value}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : question.answer_type === 'choice' ? (
                                                <div className="space-y-1.5">
                                                    {question.choices.map((choice) => (
                                                        <label key={choice.index} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg">
                                                            <input
                                                                type="radio"
                                                                name={`choice-${question.id}`}
                                                                checked={editValue === choice.value}
                                                                onChange={() => {
                                                                    setEditValue(choice.value);
                                                                    setEditValueid([choice.index]);
                                                                }}
                                                                className="w-4 h-4 accent-emerald-600"
                                                            />
                                                            <span className="text-sm text-gray-700 flex-1">{choice.value}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    placeholder={question.placeholder || 'Enter value...'}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    autoFocus
                                                />
                                            )}

                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => saveEdit(question)}
                                                    className="flex-1 px-3 py-1.5 bg-[#0D614E] text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-1"
                                                    disabled={loadingq}
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                    {loadingq ? 'Saving...' : 'Save'}
                                                </button>
                                                <button onClick={cancelEdit} className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
                                                    <X className="w-3.5 h-3.5" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DoctorQAPanelPremium;
