"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

const options = [
    { short_names: ['line_of_code', 'loc', 'num_line', 'number_of_line'], id_name: 'number_of_lines', display_name: 'Number of Line' },
    { short_names: ['loc_executable', 'executable_loc'], id_name: 'loc_executable', display_name: 'Total Line of executable Code' },
    { short_names: ['loc_comment', 'loc_comments', 'comment_loc', 'comments_loc'], id_name: 'loc_comments', display_name: 'Total Line of Comment' },
    { short_names: ['loc_code_and_comments', 'loc_code_and_comment', 'loc_code_with_comment', 'loc_code_with_comments'], id_name: 'loc_code_and_comments', display_name: 'Total Line of Code with Comment' },
    { short_names: ['loc_blank', 'loc_blanks', 'blank_loc', 'blanks_loc'], id_name: 'loc_blank', display_name: 'Total Blank Line' },
    { short_names: ['total_loc', 'loc_total'], id_name: 'loc_total', display_name: 'Total Line of Code' }
];

const MappingInterface = ({ headers }) => {
    const [attributes, setAttributes] = useState(headers || []);
    const [providedOption, setProvidedOption] = useState([]);
    const [mappings, setMappings] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/provided-attributes');
                setProvidedOption(response.data.attributes);
                setInitialMapping();
            } catch (err) {
                console.error('Error fetching attributes:', err.message);
            }
        };

        const setInitialMapping = () => {
            const initialMappings = {};
            attributes.forEach(attr => {
                // Check all short_names arrays in options
                const matchingOption = providedOption.find(opt =>
                    opt.short_names.includes(attr)
                );
                if (matchingOption) {
                    initialMappings[attr] = matchingOption;
                }
            });
            setMappings(initialMappings);
        };

        fetchAttributes();
    }, [attributes]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (fieldName) => {
        setActiveDropdown(activeDropdown === fieldName ? null : fieldName);
    };

    const handleSelect = (fieldName, option) => {
        setMappings(prev => {
            const newMappings = { ...prev };

            if (!option) {
                delete newMappings[fieldName];
            } else {
                const isOptionSelected = Object.values(newMappings).some(
                    mapping => mapping && mapping.id_name === option.id_name && fieldName !== mapping.id_name
                );

                if (!isOptionSelected) {
                    newMappings[fieldName] = option;
                }
            }

            console.log('Current Mappings:', newMappings);
            return newMappings;
        });
        setActiveDropdown(null);
    };

    const getAvailableOptions = (fieldName) => {
        return providedOption.filter(option => {
            const currentMapping = mappings[fieldName];
            const isCurrentMapping = currentMapping && currentMapping.id_name === option.id_name;
            const isSelectedElsewhere = Object.values(mappings).some(
                mapping => mapping && mapping.id_name === option.id_name && !isCurrentMapping
            );
            return !isSelectedElsewhere;
        });
    };

    const MappingRow = ({ fieldName }) => (
        <div className="flex items-center gap-1">
            <div className="bg-[#a9c5fb7a] rounded-lg px-4 py-2 w-32">
                {fieldName}
            </div>

            <div className="flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
                    <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
                    <path d="M13 19l7-7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className="relative flex-grow">
                <button
                    onClick={() => toggleDropdown(fieldName)}
                    className="flex items-center justify-between w-full bg-transparent rounded-lg px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                    {mappings[fieldName]?.display_name ?
                        <span className='text-white'>{mappings[fieldName]?.display_name}</span> : <span>Not Mapped</span>
                    }
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {activeDropdown === fieldName && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg text-black"
                    >
                        <div className="py-1">
                            <div
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(fieldName, null)}
                            >
                                Not Mapped
                            </div>
                            {getAvailableOptions(fieldName).map((option) => (
                                <div
                                    key={option.id_name}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelect(fieldName, option)}
                                >
                                    {option.display_name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full grid grid-cols-1 2md:grid-cols-2 2md:gap-x-10 gap-y-3">
            {attributes.map((field) => (
                <MappingRow key={field} fieldName={field} />
            ))}
        </div>
    );
};

export default MappingInterface;