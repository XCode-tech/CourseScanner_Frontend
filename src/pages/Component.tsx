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
        // Top courses data
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
        <div className="flex flex-col min-h-screen mt-10 bg-gray-900 dark:bg-gray-800">
            <main className="flex-1">
                <section className="p-4">
                    <div className="container mx-auto">
                        <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center text-white">
                            Helping You Find the <span className="text-yellow-400">Best Course</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white mb-8 text-center">Compare course prices across multiple websites and find the best deal.</p>

                        <div className="text-white p-4">
                            <form className="mt-4 flex flex-col md:flex-row bg-white dark:bg-gray-700 justify-between p-4 text-black dark:text-white rounded space-y-4 md:space-y-0" onSubmit={handleSubmit}>
                                <div className="flex flex-col w-full md:w-1/5">
                                    <label htmlFor="brand-name" className="text-sm font-bold">Brand Name</label>
                                    <select
                                        id="brand-name"
                                        name="brand-name"
                                        value={selectedBrandName}
                                        onChange={handleBrandNameChange}
                                        className="w-full bg-transparent focus:outline-none border border-gray-300 dark:border-gray-600 rounded"
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
                                    <select id="course-id" name="course-id" value={selectedCourseId} onChange={handleCourseNameChange} className="w-full bg-transparent focus:outline-none border border-gray-300 dark:border-gray-600 rounded" autoComplete="course-id">
                                        <option value="">Select Course Name</option>
                                        {courseNames.map((course, index) => (
                                            <option key={index} value={course.course_id}>
                                                {course.coursename && course.coursename.includes('\n')
                                                    ? course.coursename.substring(0, course.coursename.indexOf('\n'))
                                                    : course.coursename || 'No Course Name'}
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
                                        className="w-full bg-transparent focus:outline-none border border-gray-300 dark:border-gray-600 rounded"
                                    />
                                </div>
                                <div className="border-l border-gray-300 dark:border-gray-600 mx-4 hidden md:block"></div>
                                <div className="flex flex-col w-full md:w-1/5">
                                    <label htmlFor="region" className="text-sm font-bold">Region</label>
                                    <select id="region" name="region" className="w-full bg-transparent focus:outline-none border border-gray-300 dark:border-gray-600 rounded">
                                        <option value="">All</option>
                                        <option value="UK">UK</option>
                                        <option value="USA">USA</option>
                                    </select>
                                </div>
                                <button type="submit" className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Search
                                </button>
                            </form>
                            {showPopup && (
                                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                                    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-lg shadow-lg">
                                        <p className="text-lg">No data found!</p>
                                        <button onClick={() => setShowPopup(false)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="container mx-auto">
                        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8">Top Popular Courses</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {topCourses.map((course, index) => (
                                <Card key={index} className="bg-white dark:bg-gray-700">
                                    <CardContent className="p-4">
                                        <Image src={course.image} alt={course.title} width={500} height={300} className="w-full h-48 object-cover" />
                                        <h3 className="text-xl font-semibold text-black dark:text-white mt-4">{course.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">{course.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-4 mt-8 text-center">
                <p>© 2024 Course Scanner - All rights reserved.</p>
            </footer>
        </div>
    </>
    );
}
