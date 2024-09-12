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
        if (selectedBrandName) {
            fetch(`${BASE_URL}/coursename/${selectedBrandName}`)
                .then(response => response.json())
                .then((data: Course[]) => {
                    const uniqueCourses = Array.from(new Set(data.map((item: Course) => item.coursename)))
                        .map(name => data.find(course => course.coursename === name))
                        .filter((course): course is Course => course !== undefined);

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
        await router.push(`/searchcourse?course_name=${encodeURIComponent(courseName)}`);
    };

    const handleBrandNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBrandName(event.target.value);
        setSelectedCourseId('');
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
                setShowPopup(true);
            } else {
                setShowPopup(false);
                router.push(`/search?${queryString}`);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setShowPopup(true);
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
            <div className="flex flex-col min-h-screen mt-10 bg-black dark:bg-gray-900">
                <main className="flex-1">
                    <section className="">
                        <div className="">
                            <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center text-white dark:text-gray-200">
                                Helping You Find the <span className="text-[#ddbd48] dark:text-yellow-400">Best Course</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white dark:text-gray-300 mb-8 text-center">
                                Compare course prices across multiple websites and find the best deal.
                            </p>

                            <div className="text-white dark:text-gray-300 p-12">
                                <form
                                    className="mt-4 flex flex-col md:flex-row bg-white dark:bg-gray-800 justify-between p-4 text-black dark:text-gray-100 rounded space-y-4 md:space-y-0"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="brand-name" className="text-sm font-bold">Brand Name</label>
                                        <select
                                            id="brand-name"
                                            name="brand-name"
                                            value={selectedBrandName}
                                            onChange={handleBrandNameChange}
                                            className="w-full bg-transparent focus:outline-none dark:bg-gray-700 dark:text-gray-100"
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
                                    <div className="border-l border-gray-300 mx-4 hidden md:block dark:border-gray-600"></div>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="course-id" className="text-sm font-bold">Course Name</label>
                                        <select
                                            id="course-id"
                                            name="course-id"
                                            value={selectedCourseId}
                                            onChange={handleCourseNameChange}
                                            className="w-full bg-transparent focus:outline-none dark:bg-gray-700 dark:text-gray-100"
                                            autoComplete="course-id"
                                        >
                                            <option value="">Select Course</option>
                                            {courseNames.map(course => (
                                                <option key={course.course_id} value={course.course_id}>
                                                    {course.coursename}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="border-l border-gray-300 mx-4 hidden md:block dark:border-gray-600"></div>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="start-date" className="text-sm font-bold">Start Date</label>
                                        <input
                                            type="date"
                                            id="start-date"
                                            name="start_date"
                                            defaultValue={today}
                                            className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                        />
                                    </div>
                                    <div className="border-l border-gray-300 mx-4 hidden md:block dark:border-gray-600"></div>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="region" className="text-sm font-bold">Region</label>
                                        <select
                                            id="region"
                                            name="region"
                                            className="w-full bg-transparent focus:outline-none dark:bg-gray-700 dark:text-gray-100"
                                        >
                                            <option value="">All Regions</option>
                                            <option value="UK">UK</option>
                                            <option value="USA">USA</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto bg-[#F5C300] hover:bg-[#F5C300]/80 text-black dark:text-gray-900 rounded-md px-6 py-3 mt-4 md:mt-0"
                                    >
                                        Search
                                    </button>
                                </form>
                                {showPopup && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-black dark:text-gray-100">
                                            <h2 className="text-xl font-bold mb-4">No Results Found</h2>
                                            <p>Sorry, we couldn't find any courses matching your criteria.</p>
                                            <button
                                                className="mt-4 bg-[#F5C300] hover:bg-[#F5C300]/80 text-black dark:text-gray-900 rounded-md px-4 py-2"
                                                onClick={() => setShowPopup(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                    <section className="bg-gray-100 dark:bg-gray-800 py-12">
                        <div className="container mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-gray-200">
                                Top Popular Courses
                            </h2>
                            <div className="flex flex-wrap gap-6 justify-center">
                                {topCourses.map((course, index) => (
                                    <Card key={index} className="w-full max-w-sm bg-white dark:bg-gray-700 shadow-md rounded-lg">
                                        <CardContent>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{course.coursename}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Brand: {course.brandname}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Region: {course.region}</p>
                                            <Link href={course.url}>
                                                <a
                                                    className="mt-4 inline-block bg-[#F5C300] hover:bg-[#F5C300]/80 text-black dark:text-gray-900 rounded-md px-4 py-2"
                                                    onClick={(e) => handleLinkClick(e, course.coursename)}
                                                >
                                                    View Course
                                                </a>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default Component;
