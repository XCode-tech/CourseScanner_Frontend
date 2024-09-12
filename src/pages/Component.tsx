"use client";

import Image from 'next/image';
import Head from 'next/head';
import Meta from '../components/ui/Meta';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";

// Define Course type/interface
interface Course {
    course_id: string;
    coursename: string;
    brandname: string;
    price: number;
    region: string;
    duration: string;
    start_date: string;
    url: string;
    // Add other properties as per your actual data structure
}

// Define the type for the data returned from API
interface BrandName {
    brandname: string;
    // Add other properties if present in your actual API response
}

export function Component() {
    const BASE_URL = 'https://course-scanner-backend.vercel.app';
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const [brandNames, setBrandNames] = useState<string[]>([]);
    const [selectedBrandName, setSelectedBrandName] = useState<string>('');
    const [courseNames, setCourseNames] = useState<Course[]>([]);
    const [today, setToday] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${BASE_URL}/brandnames`)
            .then(response => response.json())
            .then((data: BrandName[]) => setBrandNames(data.map(item => item.brandname)))
            .catch(error => console.error('Error fetching brand names:', error));
    }, []);

    useEffect(() => {
        // Fetch course names based on selected brand name
        if (selectedBrandName) {
            fetch(`${BASE_URL}/coursename/${selectedBrandName}`)
                .then(response => response.json())
                .then((data: Course[]) => {
                    const uniqueCourses = Array.from(new Set(data.map((item: Course) => item.coursename)))
                        .map(name => data.find(course => course.coursename === name))
                        .filter((course): course is Course => course !== undefined); // Filter out undefined values and assert type

                    // Sort courses by start_date
                    const sortedCourses = uniqueCourses.sort((a, b) => {
                        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
                    });

                    setCourseNames(sortedCourses);
                })
                .catch(error => console.error('Error fetching course names:', error));
        } else {
            setCourseNames([]);
        }
    }, [selectedBrandName]);

    useEffect(() => {
        const todayDate = new Date().toISOString().split('T')[0];
        setToday(todayDate);
    }, []);

    const topCourses = [
        { coursename: 'Designing and Implementing a Microsoft Azure AI Solution (AI-102T00)', brandname: 'Microsoft', region: 'USA', url: '/searchcourse?course_name=AI-102T00' },
        { coursename: 'CompTIA Security+', brandname: 'CompTIA', region: 'USA', url: '/searchcourse?course_name=CompTIA Security+' },
        { coursename: 'Engineering Cisco Meraki Solutions', brandname: 'Cisco', region: 'USA', url: '/searchcourse?course_name=Engineering Cisco Meraki Solutions' },
        { coursename: 'Practical Data Science with Amazon SageMaker', brandname: 'Aws', region: 'USA', url: '/searchcourse?course_name=Amazon SageMaker' },
        { coursename: 'AWS Cloud Practitioner Essentials', brandname: 'Aws', region: 'USA', url: '/searchcourse?course_name=AWS Cloud Practitioner Essentials' },
        { coursename: 'Certified Ethical Hacker (CEH) v12', brandname: 'EC-Council', region: 'USA', url: '/searchcourse?course_name=CEH' },
        { coursename: 'Designing and Implementing a Microsoft Azure AI Solution', brandname: 'Microsoft', region: 'USA', url: '/searchcourse?course_name=Designing and Implementing a Microsoft Azure AI Solution' },
        { coursename: 'Implementing Automation for Cisco Enterprise Solutions', brandname: 'Cisco', region: 'USA', url: '/searchcourse?course_name=Implementing Automation for Cisco Enterprise Solutions' },
        { coursename: 'Data Engineering on Microsoft Azure (DP-203T00)', brandname: 'Microsoft', region: 'USA', url: '/searchcourse?course_name=Data Engineering on Microsoft Azure (DP-203T00)' },
    ];

    const handleLinkClick = async (e: MouseEvent<HTMLButtonElement>, courseName: string) => {
        e.preventDefault();
        // Redirect to the search page with the course name as a query parameter
        await router.push(`/searchcourse?course_name=${encodeURIComponent(courseName)}`);
    };

    const handleBrandNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBrandName(event.target.value);
        setSelectedCourseId(''); // Reset course selection when brand changes
    };

    const capitalize = (str: string): string => {
        return str
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/-\w/g, (char) => char.toUpperCase());
    };

    const handleCourseNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourseId(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            brandname: selectedBrandName,
            course_id: selectedCourseId,
            start_date: (e.currentTarget.querySelector('input[name="start_date"]') as HTMLInputElement)?.value || '',
            region: (e.currentTarget.querySelector('select[name="region"]') as HTMLSelectElement)?.value || '',
        };

        const queryString = new URLSearchParams(formData as Record<string, string>).toString();
        const url = `${BASE_URL}/search?${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSearchResults(data);
            if (data.length === 0) {
                setShowPopup(true); // Show popup for no data found
            } else {
                setShowPopup(false);
                router.push(`/search?${queryString}`);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setShowPopup(true); // Show popup for errors
        }
    };

    return (
        <>
            <Meta
                title="Home | Top IT Certifications: PMP, AWS, CEH, CISA"
                description="Explore the best certification courses like PMP, AWS, CEH, and CISA to boost your IT career."
                keywords="PMP certification, AWS course, CEH course, CISA certification"
                pageUrl="https://coursescanner.ai/"
            />
            <div className="flex flex-col min-h-screen mt-10 bg-black">
                <main className="flex-1">
                    <section>
                        <div>
                            <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center text-white">
                                Helping You Find the <span className="text-[#ddbd48]">Best Course</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white-600 mb-8 text-center text-white">
                                Compare course prices across multiple websites and find the best deal.
                            </p>

                            <div className="text-white p-12">
                                <form className="mt-4 flex flex-col md:flex-row bg-white justify-between p-4 text-black rounded space-y-4 md:space-y-0" onSubmit={handleSubmit}>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="brand-name" className="text-sm font-bold">Brand Name</label>
                                        <select
                                            id="brand-name"
                                            name="brand-name"
                                            value={selectedBrandName}
                                            onChange={handleBrandNameChange}
                                            className="w-full bg-transparent focus:outline-none"
                                            autoComplete="brand-name"
                                        >
                                            <option value="">Select Brand Name</option>
                                            {brandNames.map((brandName, index) => (
                                                <option key={index} value={brandName}>
                                                    {capitalize(brandName.toLowerCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="course-name" className="text-sm font-bold">Course Name</label>
                                        <select
                                            id="course-name"
                                            name="course-name"
                                            value={selectedCourseId}
                                            onChange={handleCourseNameChange}
                                            className="w-full bg-transparent focus:outline-none"
                                            autoComplete="course-name"
                                        >
                                            <option value="">Select Course</option>
                                            {courseNames.map((course, index) => (
                                                <option key={index} value={course.course_id}>
                                                    {course.coursename}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="start_date" className="text-sm font-bold">Start Date</label>
                                        <input
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            min={today}
                                            defaultValue={today}
                                            className="w-full bg-transparent focus:outline-none border border-gray-300 p-2 rounded"
                                        />
                                    </div>

                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="region" className="text-sm font-bold">Region</label>
                                        <select
                                            id="region"
                                            name="region"
                                            className="w-full bg-transparent focus:outline-none"
                                            autoComplete="region"
                                        >
                                            <option value="">Select Region</option>
                                            <option value="UK">UK</option>
                                            <option value="USA">USA</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full md:w-1/5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            {showPopup && (
                                <div className="bg-red-500 text-white p-4 rounded">
                                    No data found or error occurred.
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Top Popular Courses</h2>
                        <div className="flex flex-wrap justify-center">
                            {topCourses.map((course, index) => (
                                <Card key={index} className="w-80 mx-2 my-4 bg-black text-white rounded shadow-lg">
                                    <CardContent>
                                        <Image
                                            src={`/images/${course.brandname.toLowerCase()}.png`}
                                            alt={course.brandname}
                                            width={100}
                                            height={100}
                                            className="mx-auto"
                                        />
                                        <h3 className="text-xl font-bold mb-2">{course.coursename}</h3>
                                        <p className="text-gray-400 mb-4">{course.brandname}</p>
                                        <button
                                            onClick={(e) => handleLinkClick(e, course.coursename)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            View Details
                                        </button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
