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
        return str.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/-\w/g, (char) => char.toUpperCase());
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
            <div className="flex flex-col min-h-screen mt-10">
                <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label htmlFor="brandname" className="block text-sm font-medium">
                                Select Brand
                            </label>
                            <select
                                id="brandname"
                                name="brandname"
                                className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={selectedBrandName}
                                onChange={handleBrandNameChange}
                            >
                                <option value="">Select a brand</option>
                                {brandNames.map((brand, index) => (
                                    <option key={index} value={brand}>
                                        {capitalize(brand)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="course" className="block text-sm font-medium">
                                Select Course
                            </label>
                            <select
                                id="course"
                                name="course"
                                className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={selectedCourseId}
                                onChange={handleCourseNameChange}
                            >
                                <option value="">Select a course</option>
                                {courseNames.map((course, index) => (
                                    <option key={index} value={course.course_id}>
                                        {course.coursename}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="region" className="block text-sm font-medium">
                                Region
                            </label>
                            <select
                                id="region"
                                name="region"
                                className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select a region</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                min={today}
                                className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {showPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold">No Data Found!</h2>
                            <button
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                                onClick={() => setShowPopup(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8 p-4">
                    <h2 className="text-lg font-semibold">Top Popular Courses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {topCourses.map((course, index) => (
                            <Card key={index} className="bg-white shadow-md rounded-lg">
                                <CardContent className="p-4">
                                    <h3 className="text-base font-medium">{course.coursename}</h3>
                                    <p className="text-sm text-gray-500">
                                        {course.brandname} - {course.region}
                                    </p>
                                    <button
                                        className="mt-4 text-indigo-600 hover:underline"
                                        onClick={(e) => handleLinkClick(e, course.coursename)}
                                    >
                                        View Details
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Component;
