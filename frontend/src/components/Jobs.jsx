import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import Footer from './shared/Footer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Jobnotfound from './Jobnotfound';

const Jobs = () => {
    const { authUser } = useSelector((store) => store.auth);
    const { allJobs, searchText } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser?.role === 'recruiter') {
            navigate("/admin/jobs");
        }
    }, [authUser, navigate]);

    // Function to parse salary ranges like "0LPA to 10LPA"
    const parseSalaryRange = (range) => {
        const [min, max] = range.split(" to ").map(str => parseInt(str.replace('LPA', '')));
        return { min, max };
    };

    useEffect(() => {
        if (searchText) {
            const { Location, Industry, Salary } = searchText;

            const filteredJobs = allJobs.filter((job) => {
                const matchesLocation = Location.length === 0 || Location.toLowerCase().trim() === job.location.toLowerCase().trim();
                const matchesIndustry = Industry.length === 0 || Industry.toLowerCase().trim() === job.title.toLowerCase().trim();

                // Updated salary matching logic
                const matchesSalary = Salary.length === 0 || (() => {
                    const { min, max } = parseSalaryRange(Salary);
                    const jobSalary = parseInt(job.salary); // assuming job.salary is a number or numeric string
                    return jobSalary >= min && jobSalary <= max;
                })();

                return matchesLocation && matchesIndustry && matchesSalary;
            });

            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchText]);

    return (
        <div className='bg-gray-100 h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-[20%]'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <Jobnotfound /> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto no-scrollbar pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs && filterJobs.map((job) => (
                                            <motion.div
                                                key={job._id}
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Jobs;
