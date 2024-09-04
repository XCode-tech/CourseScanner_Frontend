import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner'; // Import a spinner or loading component

import SearchComponent from './SearchComponent'; // Adjust the path if needed

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [selectedPriceOrder, setSelectedPriceOrder] = useState<string | undefined>(undefined);
    const [selectedDateOrder, setSelectedDateOrder] = useState<string | undefined>(undefined);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    const applyFilters = useCallback(() => {
        let filtered = courses.filter(course => new Date(course.start_date) >= new Date());

        if (selectedPriceOrder) {
            filtered.sort((a, b) => selectedPriceOrder === 'low-to-high' ? a.price - b.price : b.price - a.price);
        }
        if (selectedDateOrder) {
            filtered.sort((a, b) => selectedDateOrder === 'newest' ? new Date(b.start_date).getTime() - new Date(a.start_date).getTime() : new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
        }
        if (selectedRegion && selectedRegion !== 'all') {
            filtered = filtered.filter(course => course.region.toLowerCase() === selectedRegion.toLowerCase());
        }

        setFilteredCourses(filtered);
    }, [courses, selectedPriceOrder, selectedDateOrder, selectedRegion]);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 grid md:grid-cols-[1fr_300px] gap-8">
            <div className="ml-[10%]">
                <h1 className="text-3xl font-bold mb-8">All Courses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <div key={course.course_id} className="w-72 bg-card rounded-lg overflow-hidden shadow-md bg-[#18181b]">
                                <div className="h-48">
                                    <Image
                                        src={course.brand_image || '/bg.png'}
                                        alt={course.brandname || 'Course Image'}
                                        width={500}
                                        height={300}
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-2">{course.coursename}</h2>
                                    <h2 className="text-xl font-bold">{course.coursename.substring(0, course.coursename.indexOf('\n') + 1)}</h2>
                                    {course.duration && (
                                        <p className="text-muted-foreground mb-4">
                                            Duration: {course.duration}
                                        </p>
                                    )}
                                    {course.start_date && (
                                        <p className="text-muted-foreground mb-4">
                                            Start Date: {course.start_date}
                                        </p>
                                    )}
                                    <p className="text-muted-foreground mb-4">
                                        Company: {course.website}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">${course.price}</span>
                                        <Link href={course.url} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm">Enroll</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xl font-semibold text-gray-600">No courses available</p>
                    )}
                </div>
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="price" className="text-sm font-medium">
                            Price
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    Price
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={selectedPriceOrder} onValueChange={setSelectedPriceOrder}>
                                    <DropdownMenuRadioItem value="low-to-high">Low to High</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="high-to-low">High to Low</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <Label htmlFor="date" className="text-sm font-medium">
                            Date
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    Date
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={selectedDateOrder} onValueChange={setSelectedDateOrder}>
                                    <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <Label htmlFor="region" className="text-sm font-medium">
                            Region
                        </Label>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="UK">UK</SelectItem>
                                <SelectItem value="USA">USA</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={applyFilters}>Apply Filters</Button>
                </div>
            </div>
            <Suspense fallback={<Spinner />}>
                <SearchComponent setCourses={setCourses} setFilteredCourses={setFilteredCourses} />
            </Suspense>
        </div>
    );
}
