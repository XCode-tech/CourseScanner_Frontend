"use client";

import { useState, useEffect, useCallback } from 'react';
import Meta from '@/components/ui/Meta';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";

interface Course {
  website: string;
  brandname: string;
  coursename: string;
  duration: string;
  price: number;
  region: string;
  start_date: string;
  brand_image: string;
  url: string;
  course_id: string;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const CourseList = ({
  courses,
  filteredCourses,
  applyFilters,
  selectedPriceOrder,
  selectedDateOrder,
  selectedRegion,
}: {
  courses: Course[];
  filteredCourses: Course[];
  applyFilters: (coursesToFilter: Course[]) => void;
  selectedPriceOrder: string | undefined;
  selectedDateOrder: string | undefined;
  selectedRegion: string;
}) => {
  useEffect(() => {
    applyFilters(courses);
  }, [selectedPriceOrder, selectedDateOrder, selectedRegion, courses, applyFilters]);

  return (
    <>
      <Meta
        title="Search IT Certifications | Find PMP, AWS, CEH, CISA, CISSP Courses"
        description="Search and explore top certification courses like PMP, AWS, CEH, CISA, and CISSP. Find detailed information on costs, exams, and training options."
        keywords="search IT certifications, PMP course, AWS certification, CEH course, CISA certification, CISSP training"
        pageUrl="https://coursescanner.ai/searchcourse"
      />
      <div className="ml-[10%] bg-gray-100 dark:bg-gray-900 p-4 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-8">All Searched Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.course_id} className="w-full sm:w-72 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <div className="h-48">
                  <Image
                    src={course.brand_image || '/bg.png'}
                    alt={course.brandname || 'Course Image'}
                    width={500}
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold dark:text-white">
                    {course.coursename.split('\n')[0]}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    Duration: {course.duration ? course.duration : 'TBD'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    Start Date: {course.start_date ? course.start_date : 'TBD'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    Company: {course.website}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${course.price}</span>
                    <Link href={course.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
                        Enroll
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">No courses available</p>
          )}
        </div>
      </div>
    </>
  );
}

const Filters = ({
  selectedPriceOrder,
  setSelectedPriceOrder,
  selectedDateOrder,
  setSelectedDateOrder,
  handleFilterChange
}: {
  selectedPriceOrder: string | undefined;
  setSelectedPriceOrder: (value: string | undefined) => void;
  selectedDateOrder: string | undefined;
  setSelectedDateOrder: (value: string | undefined) => void;
  handleFilterChange: () => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold dark:text-white mb-4">Filters</h2>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="price" className="text-sm font-medium dark:text-gray-400">
            Price
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between dark:bg-gray-700 dark:text-white">
                Price
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-700 dark:text-white">
              <DropdownMenuRadioGroup value={selectedPriceOrder} onValueChange={setSelectedPriceOrder}>
                <DropdownMenuRadioItem value="low-to-high">Low to High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high-to-low">High to Low</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label htmlFor="date" className="text-sm font-medium dark:text-gray-400">
            Date
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between dark:bg-gray-700 dark:text-white">
                Date
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-700 dark:text-white">
              <DropdownMenuRadioGroup value={selectedDateOrder} onValueChange={setSelectedDateOrder}>
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800" onClick={handleFilterChange}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

const CoursesPage = () => {
  const BASE_URL = 'https://course-scanner-backend.vercel.app';
  const searchParams = useSearchParams();
  const courseName = searchParams ? searchParams.get('course_name') || '' : '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedPriceOrder, setSelectedPriceOrder] = useState<string | undefined>(undefined);
  const [selectedDateOrder, setSelectedDateOrder] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const applyFilters = useCallback((coursesToFilter: Course[]) => {
    let filtered = [...coursesToFilter];

    if (selectedPriceOrder) {
      filtered.sort((a, b) => selectedPriceOrder === 'low-to-high' ? a.price - b.price : b.price - a.price);
    }
    if (selectedDateOrder) {
      filtered.sort((a, b) => selectedDateOrder === 'newest' ? new Date(b.start_date).getTime() - new Date(a.start_date).getTime() : new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    }
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(course => course.region === selectedRegion);
    }
    setFilteredCourses(filtered);
  }, [selectedPriceOrder, selectedDateOrder, selectedRegion]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/searchcourse?course_name=${encodeURIComponent(courseName)}`);
        const data = await response.json();
        setCourses(data);
        applyFilters(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [courseName, applyFilters]);

  const handleFilterChange = () => {
    applyFilters(courses);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-4">
        <Filters
          selectedPriceOrder={selectedPriceOrder}
          setSelectedPriceOrder={setSelectedPriceOrder}
          selectedDateOrder={selectedDateOrder}
          setSelectedDateOrder={setSelectedDateOrder}
          handleFilterChange={handleFilterChange}
        />
        <CourseList
          courses={courses}
          filteredCourses={filteredCourses}
          applyFilters={applyFilters}
          selectedPriceOrder={selectedPriceOrder}
          selectedDateOrder={selectedDateOrder}
          selectedRegion={selectedRegion}
        />
      </div>
    </div>
  );
}

export default CoursesPage;
