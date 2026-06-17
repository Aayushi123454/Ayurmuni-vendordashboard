import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Save, X, Edit2, User, Activity, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorService } from '../../../services/doctorService';

const DoctorQAPanelPremium = ({ patientid }) => {
    const [questions, setQuestions] = useState([]);
    const [medquestions, setMedQuestions] = useState([]);
    const [prakartiquestions, setprakartiQuestions] = useState([]);
    const [patientInfo, setPatientInfo] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editValueid, setEditValueid] = useState([]);
    const [editMultiValues, setEditMultiValues] = useState([]);
    const [loading, setloading] = useState(true)
    const [loadingq, setloadingq] = useState(false)
    const [questiontype, setquestiontype] = useState('prakriti')


    React.useEffect(() => {
        if (questiontype == "prakriti") {
            setQuestions(prakartiquestions)
        } else {
            setQuestions(medquestions)
        }
    }, [questiontype]);

    React.useEffect(() => {
        fetchquestions()
    }, []);

    const fetchquestions = async () => {
        try {
            setloading(true)
            const res = await doctorService.questionforpatient(patientid)
            setPatientInfo(res?.data?.data?.prakriti?.patient);
            setQuestions((questiontype == "prakriti" ? res?.data?.data?.prakriti?.questions : res?.data?.data?.medical_history?.questions));
            setprakartiQuestions(res?.data?.data?.prakriti?.questions)
            setMedQuestions(res?.data?.data?.medical_history?.questions)
            setloading(false)
            setloadingq(false)
            setEditingId(null);
        } catch (error) {
            toast.error("Question fetch error.")
            setloading(false)
        }
    }

    const startEdit = (question) => {
        setEditingId(question.id);
        if (question.answer_type === 'multi_choice') {
            setEditMultiValues(question.patient_answer || []);
            setEditValue('');
        } else {
            setEditValue(question.patient_answer || '');
            setEditMultiValues([]);
        }
    };

    const saveEdit = (id) => {
        setQuestions(prev => {
            const updated = prev.map(q => {
                if (q.id === id) {
                    saveQuestions({
                        "patient_id": patientid,
                        "experience_type": questiontype,
                        "answers": {
                            [id]: (editValueid[0] >= 0 ? q.answer_type == "multi_choice"
                                ? [...editValueid]
                                : editValueid[0] : editValue),
                        }
                    })
                    return {
                        ...q,
                        patient_answer:
                            q.answer_type == "multi_choice"
                                ? [...editMultiValues]
                                : editValue
                    };
                }

                return q;
            });
            return updated;
        });


    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
        setEditMultiValues([]);
    };

    const toggleMultiValue = (value) => {
        setEditMultiValues(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const isAnswered = (question) => {
        if (question.answer_type == 'multi_choice') {
            return question.patient_answer?.length > 0;
        }
        return question.patient_answer && question.patient_answer.trim() !== '';
    };

    const getPatientDisplay = (question) => {
        if (question.patient_answer) {
            if (Array.isArray(question.patient_answer)) {
                return question.patient_answer.join(', ');
            }
            return question.patient_answer;
        }
        return null;
    };

    const saveQuestions = async (data) => {
        try {
            setloadingq(true)
            const res = await doctorService.questionfillforpatient(data);
            if (res?.data?.success) {
                toast.success("Questions saved successfully.");
                setEditValue('');
                setEditValueid([])
                setEditMultiValues([]);
                fetchquestions()
            } else {
                toast.error(res?.data?.message || "Failed to save questions.");
            }
        } catch (error) {
            console.error("Save Questions Error:", error);
            toast.error("Questions save failed.");
        }
    };

    const completedCount = questions?.filter(q =>
        (q.choices
            ?.some(r => r.is_selected)) ||
        (q.answer && q.answer !== "")
    ).length;

    if (loading && !questions[0]) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                    <p className="text-sm text-gray-500 font-medium">Loading Questions details...</p>
                </div>
            </div>
        );
    }
    return (

        <div className="min-h-screen ">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="relative mb-4 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D614E] via-[#12806A] to-[#1A9C7A] p-8 text-white">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-24 translate-x-24" />

                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-5">

                            <div>
                                <div className='flex gap-5 mt-2'>
                                    <button onClick={e => setquestiontype("prakriti")} className={"flex items-center gap-2 px-3 py-1.5 rounded-[5px]  text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 border " + (questiontype == "prakriti" ? "text-[#0D614E] bg-white" : "text-white border-white border")} >
                                        Prakriti Questions
                                    </button>
                                    <button onClick={e => setquestiontype("medical_history")} className={"flex items-center gap-2 px-3 py-1.5 rounded-[5px]  text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50 border " + (questiontype == "medical_history" ? "text-[#0D614E] bg-white" : "text-white border-white border")} >
                                        Medical history
                                    </button>
                                    <div />
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-white">
                                {completedCount}/{questions.length}
                            </p>
                            <p className="text-emerald-100">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <p className="text-slate-500 text-sm">Total Questions</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                            {questions.length}
                        </h3>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <p className="text-emerald-600 text-sm">Answered</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                            {completedCount}
                        </h3>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <p className="text-orange-500 text-sm">Pending</p>
                        <h3 className="text-2xl font-bold text-orange-500 mt-1">
                            {questions.length - completedCount}
                        </h3>
                    </div>
                </div>

                {/* Questions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {questions.map((question, idx) => {
                        const isEditing = editingId === question.id;
                        const answered = question.choices.filter((data) => data?.is_selected)[0] || question.answer
                        const patientAnswer = getPatientDisplay(question);

                        return (

                            <div
                                key={question.id}
                                className={`group bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${answered ? 'border-[#0D614E] shadow-sm' : 'border-gray-200'
                                    }`}
                            >
                                {/* Question Header */}
                                <div className={`p-3 border-b rounded-t-xl ${answered ? 'bg-[#0D614E]/5' : 'bg-gray-50'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${answered ? 'bg-[#0D614E] text-white' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800 ">
                                                {question.question}
                                                {/* <span className={`ml-3 text-[8px] px-1 py-0.5 rounded ${question.answer_type === 'multi_choice'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : question.answer_type === 'choice'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {question.answer_type === 'multi_choice' ? 'Multiple Select' :
                                                        question.answer_type === 'choice' ? 'Single Choice' : 'Text Input'}
                                                </span> */}
                                            </span>
                                        </div>
                                        {answered && (
                                            <CheckCircle2 className="w-4 h-4 text-[#0D614E] flex-shrink-0" />
                                        )}
                                    </div>

                                    {/* Answer Type Badge */}
                                    {/* <div className="ml-8 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${question.answer_type === 'multi_choice'
                                            ? 'bg-purple-100 text-purple-700'
                                            : question.answer_type === 'choice'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {question.answer_type === 'multi_choice' ? 'Multiple Select' :
                                                question.answer_type === 'choice' ? 'Single Choice' : 'Text Input'}
                                        </span>
                                    </div> */}
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    {/* Current Answer Display */}
                                    <div className="mb-0">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                {question.choices.filter((data) => data?.is_selected)[0] ? (
                                                    <div className="text-sm  p-2">
                                                        {question.answer_type == 'multi_choice' ? (
                                                            <div className="flex flex-wrap gap-1 ">
                                                                {question.choices.filter((data) => data?.is_selected)?.map((ans, i) => (
                                                                    <span key={i} className="text-sm text-white font-medium bg-[#0D614E]/90 px-2 py-1 rounded-[4px]">
                                                                        {ans?.value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-white font-medium bg-[#0D614E]/90 px-2 py-1 rounded-[4px] inline-block">{question.choices.filter((data) => data?.is_selected)[0]?.value}</span>
                                                        )}
                                                    </div>
                                                ) : question?.answer ?
                                                    <span className="text-sm text-white font-medium bg-[#0D614E]/90 px-2 py-1 rounded-[4px] inline-block">{question?.answer}</span>
                                                    : (
                                                        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                            <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                                                            Not answered yet - Click edit to fill
                                                        </div>
                                                    )}
                                            </div>
                                            <button
                                                onClick={() => startEdit(question)}
                                                className="p-1.5 text-gray-400 hover:text-[#0D614E] hover:bg-[#0D614E]/5 rounded-lg transition-colors flex-shrink-0"
                                                title="Edit Answer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Edit Mode */}
                                    {isEditing && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="mb-2">
                                                <span className="text-xs font-medium text-[#0D614E] bg-[#0D614E]/5 px-2 py-0.5 rounded">
                                                    {patientAnswer ? 'Edit Answer' : 'Fill Answer'}
                                                </span>
                                            </div>

                                            {question.answer_type == 'multi_choice' ? (
                                                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                                    {question.choices.map((choice) => (
                                                        <label key={choice.index} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                // defaultChecked={editMultiValues.includes(choice.value) || choice?.is_selected}
                                                                onChange={() => {
                                                                    toggleMultiValue(choice.value)
                                                                    setEditValueid([...editValueid, choice.index])
                                                                }}
                                                                className="w-4 h-4 rounded accent-[#0D614E]"
                                                            />
                                                            <span className="text-sm text-gray-700 flex-1">{choice.value}</span>
                                                            <span className="text-xs text-gray-400 font-mono">{choice.code}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : question.answer_type === 'choice' ? (
                                                <div className="space-y-1.5">
                                                    {question.choices.map((choice) => (
                                                        <label key={choice.index} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <input
                                                                type="radio"
                                                                name={`choice-${question.id}`}
                                                                // defaultValue={choice.value}
                                                                defaultChecked={editValue === choice.value || choice?.is_selected}
                                                                onChange={(e) => {
                                                                    setEditValue(e.target.value)
                                                                    setEditValueid([choice.index])
                                                                }}
                                                                className="w-4 h-4 accent-emerald-600"
                                                            />
                                                            <span className="text-sm text-gray-700 flex-1">{choice.value}</span>
                                                            <span className="text-xs text-gray-400 font-mono">{choice.code}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    // defaultValue={editValue || question?.answer}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    placeholder={question.placeholder || "Enter value..."}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    autoFocus
                                                />
                                            )}

                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => saveEdit(question.id)}
                                                    className="flex-1 px-3 py-1.5 bg-[#0D614E] text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                                                    disabled={loadingq}
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                    {loadingq ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
                                                >
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

                {/* Footer Summary */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                                <span className="text-xs text-gray-600">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                <span className="text-xs text-gray-600">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-100 rounded-full border border-amber-300"></div>
                                <span className="text-xs text-gray-600">Needs Doctor Input</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400">
                            Last updated: {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorQAPanelPremium;