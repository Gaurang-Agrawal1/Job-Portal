import React, { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Checkbox } from "@/components/ui/checkbox"; // Make sure Checkbox supports onChange properly
import { useDispatch } from 'react-redux';
import { setSearchText } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai","Noida"]
    },
    {
        filterType: "Industry",
        array: ["Software Developer", "Frontend Developer", "Backend Developer", "Data Science", "Data Analyst", "FullStack Developer", "Data Engineer", "Computer Scientist", "Graphic Designer", "DevOps Developer", "UI Developer"]
    },
    {
        filterType: "Salary",
        array: ["0LPA to 10LPA", "11LPA to 20LPA", "21LPA to 30LPA", "31LPA to 40LPA", "41LPA to 50LPA"]
    },
];

const FilterCard = () => {
    // State to manage selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        Location: "",
        Industry: "",
        Salary: "",
    });
    
    const dispatch = useDispatch();

    
    const handleChange = (filterType, value) => {
        setSelectedFilters((prevState) => (
            
            // If the filter is already selected, deselect it
            prevState[filterType] === value
                ? { ...prevState, [filterType]: "" }
                : { ...prevState, [filterType]: value }
        ));
    };

    useEffect(() => {
        // Dispatch the selected filters to the Redux store
        dispatch(setSearchText(selectedFilters));
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
            </div>
            <hr className='mt-3' />
            {filterData.map((data, index) => (
                <div key={index}>
                    <h1 className='font-medium text-lg'>{data.filterType}</h1>
                    {data.array.map((item, idx) => {
                        const itemId = `checkbox-${index}-${idx}`; // Ensure unique id for each checkbox
                        return (
                            <div key={idx} className="flex items-center space-x-2 my-2">
                                <Checkbox 
                                    id={itemId} 
                                    checked={selectedFilters[data.filterType]==(item)?true:false}
                                    onCheckedChange={() => handleChange(data.filterType, item)} 
                                />
                                <Label htmlFor={itemId}>{item}</Label>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default FilterCard;
