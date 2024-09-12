"use client";

import Image from 'next/image';
import Head from 'next/head';
import Meta from '../components/ui/Meta';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";

interface Course {
    course_id: string;
    coursename: string;
    brandname: string;
    price: number;
    region: string;
    duration: string;
    start_date: string;
    url: string;
}

interface BrandName {
    brandname: string;
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
        // other courses...
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
            setShowPopup(data.length === 0);
            if (data.length > 0) {
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
            <div className="flex flex-col min-h-screen mt-10 bg-white dark:bg-black text-black dark:text-white">
                <main className="flex-1">
                    <section className="p-4">
                        <div className="container mx-auto">
                            <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center">
                                Helping You Find the <span className="text-yellow-500">Best Course</span>
                            </h1>

                            <p className="text-lg md:text-xl mb-8 text-center">Compare course prices across multiple websites and find the best deal.</p>

                            <div className="p-4">
                                <form className="flex flex-col md:flex-row bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-4 md:space-y-0" onSubmit={handleSubmit}>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="brand-name" className="text-sm font-bold">Brand Name</label>
                                        <select
                                            id="brand-name"
                                            name="brand-name"
                                            value={selectedBrandName}
                                            onChange={handleBrandNameChange}
                                            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
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
                                    <div className="border-l border-gray-300 dark:border-gray-600 mx-4 hidden md:block"></div>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="course-id" className="text-sm font-bold">Course Name</label>
                                        <select id="course-id" name="course-id" value={selectedCourseId} onChange={handleCourseNameChange} className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none" autoComplete="course-id">
                                            <option value="">Select Course Name</option>
                                            {courseNames.map((course, index) => (
                                                <option key={index} value={course.course_id}>
                                                    {course.coursename || 'No Course Name'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="border-l border-gray-300 dark:border-gray-600 mx-4 hidden md:block"></div>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="start_date" className="text-sm font-bold">Start Date</label>
                                        <input
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
                                            autoComplete="start_date"
                                        />
                                    </div>
                                    <div className="border-l border-gray-300 dark:border-gray-600 mx-4 hidden md:block"></div>
                                    <div className="flex flex-col w-full md:w-1/5">
                                        <label htmlFor="region" className="text-sm font-bold">Region</label>
                                        <select id="region" name="region" className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none" autoComplete="region">
                                            <option value="">Select Region</option>
                                            <option value="UK">UK</option>
                                            <option value="USA">USA</option>
                                            <option value="All">All</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full md:w-1/5 bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none">Search</button>
                                </form>
                            </div>

                            {showPopup && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg">
                                        <h2 className="text-xl font-bold mb-4">No Data Found</h2>
                                        <p className="mb-4">No courses match your search criteria.</p>
                                        <button onClick={() => setShowPopup(false)} className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none">Close</button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row justify-center mt-10 space-y-4 md:space-y-0 md:space-x-4">
                                {topCourses.map((course, index) => (
                                    <Card key={index} className="w-full md:w-1/4">
                                        <CardContent>
                                            <h2 className="text-xl font-bold mb-2">{course.coursename}</h2>
                                            <p className="text-lg mb-2">Brand: {course.brandname}</p>
                                            <p className="text-lg mb-2">Region: {course.region}</p>
                                            <Link href={course.url} passHref>
                                                <a className="text-blue-500 dark:text-blue-300 hover:underline">View Course</a>
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
