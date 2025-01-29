"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

const MappingInterface = ({ headers, mappedSourceFileHeaders, setMappedSourceFileHeaders}) => {
    const [attributes, setAttributes] = useState(headers || []);
    const [providedOption, setProvidedOption] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/provided-attributes');
                setProvidedOption(response.data.attributes);
            } catch (err) {
                console.error('Error fetching attributes:', err.message);
            }
        };

        setAttributes(headers);
        fetchAttributes();
    }, [headers]); // Runs only when headers change

    useEffect(() => {
        if (providedOption.length === 0) return;

        const initialMappings = {};
        attributes.forEach(attr => {
            const matchingOption = providedOption.find(opt =>
                opt.short_names.includes(attr)
            );
            if (matchingOption) {
                initialMappings[attr] = matchingOption;
            }
        });
        setMappedSourceFileHeaders(initialMappings);
    }, [providedOption, attributes]); // Runs only when `providedOption` and `attributes` change


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
        setMappedSourceFileHeaders(prev => {
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
            const currentMapping = mappedSourceFileHeaders[fieldName];
            const isCurrentMapping = currentMapping && currentMapping.id_name === option.id_name;
            const isSelectedElsewhere = Object.values(mappedSourceFileHeaders).some(
                mapping => mapping && mapping.id_name === option.id_name && !isCurrentMapping
            );
            return !isSelectedElsewhere;
        });
    };

    const MappingRow = ({ fieldName }) => (
        <div className="flex items-center gap-1 text-sm sm:text-base 2md:text-sm xl:text-base">
            <div className="bg-[#a9c5fb7a] rounded-lg p-2 w-32 sm:w-40 2md:w-32 xl:w-40 overflow-x-auto">
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
                    className="flex items-center justify-between w-full bg-transparent rounded-lg p-2 border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                    {mappedSourceFileHeaders[fieldName]?.display_name ?
                        <span className='text-white'>{mappedSourceFileHeaders[fieldName]?.display_name}</span> : <span>Not Mapped</span>
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
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(fieldName, null)}
                            >
                                Not Mapped
                            </div>
                            {getAvailableOptions(fieldName).map((option) => (
                                <div
                                    key={option.id_name}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
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