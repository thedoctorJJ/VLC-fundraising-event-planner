import React, { useState, useMemo, useCallback } from "react";
import { Star, BarChart3, Users, DollarSign, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Type Definitions ---
type EventKey =
 | "camps"
 | "satPsat"
 | "tachs"
 | "market"
 | "sipPaint";

type EventConfig = {
 id: EventKey;
 name: string;
 seasonality: string;
 summary: string;
 comps: string[];
 fields: { label: string; defaultValue?: string }[];
};

type EventMetrics = {
   netProfit: number;
   totalPersonPower: number;
   profitPerPerson: number;
   difficulty: number;
   id: EventKey;
   name: string;
};

type SortKey = 'netProfit' | 'totalPersonPower' | 'profitPerPerson' | 'difficulty';
type SortDirection = 'asc' | 'desc';


// --- Data Configuration ---
// Setting new standardized labor rates:
const RECEPTIONIST_RATE = "16.30";
const CLEANER_RATE = "31";

const EVENTS: EventConfig[] = [
 {
   id: "camps",
   name: "Camps for Holiday Breaks",
   seasonality: "Christmas, February winter break, Easter break",
   summary:
     "Holiday break camps for preschool through eighth grade students with sports, arts, and music activities that provide childcare coverage when school is closed.",
   comps: [
     "Gym Rats Basketball, 80 dollars per day, sports camp",
     "Artistree Performing Arts, 495 dollars per week, arts camp",
     "Regional multi activity camps, 350 to 500 dollars per week",
     "Camp counselor pay in Westchester County, around 16 to 21 dollars per hour",
     "New York State day camp ratio guideline, one counselor to twelve children"
   ],
   fields: [
     { label: "Revenue: Average price per student ($)", defaultValue: "450" },
     { label: "Revenue: Average number of students", defaultValue: "40" },
     { label: "Expense: Counselor hourly rate ($)", defaultValue: "19" },
     { label: "Expense: Counselor hours (per day)", defaultValue: "8" },
     { label: "Expense: Counselor to student ratio (1:N)", defaultValue: "12" },
     { label: "Expense: Receptionist hours", defaultValue: "6" },
     { label: "Expense: Receptionist rate ($)", defaultValue: RECEPTIONIST_RATE },
     { label: "Expense: Cleaner hours", defaultValue: "8" },
     { label: "Expense: Cleaner rate ($)", defaultValue: CLEANER_RATE },
     { label: "Fixed: Supplies cost ($)", defaultValue: "300" },
     { label: "Fixed: Insurance cost ($)", defaultValue: "0" },
     { label: "Variable: Food and snacks cost per student ($)", defaultValue: "15" }
   ]
 },
 {
   id: "satPsat",
   name: "SAT and PSAT Prep Classes",
   seasonality: "Year round, peaks before main test dates",
   summary:
     "Weekend and evening preparation classes for high school students that cover strategies, content review, and practice exams for SAT and PSAT.",
   comps: [
     "Westchester Prep, about 2,000 dollars for an eight week group course",
     "Regional test prep centers, around 1,500 to 2,500 dollars per course",
     "Private tutors, 60 to 120 dollars per hour",
     "Materials often bundled into total course price"
   ],
   fields: [
     { label: "Revenue: Price per student ($)", defaultValue: "2000" },
     { label: "Revenue: Number of students", defaultValue: "12" },
     { label: "Expense: Instructor hourly rate ($)", defaultValue: "60" },
     { label: "Expense: Total instruction hours", defaultValue: "20" },
     { label: "Expense: Materials cost per student ($)", defaultValue: "35" },
     { label: "Expense: Admin support hours", defaultValue: "6" },
     { label: "Expense: Admin support rate ($)", defaultValue: RECEPTIONIST_RATE },
     { label: "Expense: Cleaner hours", defaultValue: "3" },
     { label: "Expense: Cleaner rate ($)", defaultValue: CLEANER_RATE }
   ]
 },
 {
   id: "tachs",
   name: "TACHS Prep Classes",
   seasonality: "Late summer through fall",
   summary:
     "Preparation program for seventh and eighth grade students who are applying to Catholic high schools and taking the TACHS exam.",
   comps: [
     "St John’s Prep, about 400 dollars for seven sessions with workbook included",
     "Molloy High School, about 395 dollars for six sessions with book and diagnostic exam",
     "Sacred Heart High School, about 195 dollars for six sessions with materials included",
     "Regional estimate for similar programs, around 300 dollars",
     "Instructor pay, about 35 to 75 dollars per hour"
   ],
   fields: [
     { label: "Revenue: Price per student ($)", defaultValue: "300" },
     { label: "Revenue: Number of students", defaultValue: "12" },
     { label: "Expense: Instructor hourly rate ($)", defaultValue: "55" },
     { label: "Expense: Total instruction hours", defaultValue: "18" },
     { label: "Expense: Materials cost per student ($)", defaultValue: "30" },
     { label: "Expense: Admin support hours", defaultValue: "4" },
     { label: "Expense: Admin support rate ($)", defaultValue: RECEPTIONIST_RATE },
     { label: "Expense: Cleaner hours", defaultValue: "2" },
     { label: "Expense: Cleaner rate ($)", defaultValue: CLEANER_RATE }
   ]
 },
 {
   id: "market",
   name: "Christmas Market",
   seasonality: "Early December",
   summary:
     "Christmas market hosted in the school gym where local vendors rent tables and optionally share a percentage of their sales.",
   comps: [
     "Immaculate Conception Church in Eastchester, about 40 dollars per table",
     "Regional markets, around 65 to 230 dollars per table per day",
     "Standard six foot folding tables",
     "Your gym estimated at about twenty four tables maximum"
   ],
   fields: [
     { label: "Revenue: Number of tables", defaultValue: "24" },
     { label: "Revenue: Price per table ($)", defaultValue: "85" },
     { label: "Revenue: Percent of vendor sales (%)", defaultValue: "10" },
     { label: "Expense: Receptionist hours", defaultValue: "6" },
     { label: "Expense: Receptionist rate ($)", defaultValue: RECEPTIONIST_RATE },
     { label: "Expense: Cleaner hours", defaultValue: "6" },
     { label: "Expense: Cleaner rate ($)", defaultValue: CLEANER_RATE },
     { label: "Fixed: Marketing cost ($)", defaultValue: "300" },
     { label: "Fixed: Supplies and decorations cost ($)", defaultValue: "250" },
     { label: "Fixed: Insurance or rider cost ($)", defaultValue: "50" }
   ]
 },
 {
   id: "sipPaint",
   name: "Sip and Paint Evening",
   seasonality: "Flexible, typically winter and spring evenings",
   summary:
     "Adult evening event where participants follow a guided painting session while enjoying wine, with ticket pricing set to cover all costs plus target profit.",
   comps: [
     "Muse Paintbar in Yonkers, around 35 to 55 dollars per person",
     "Pottery Factory in Mount Kisco, around 39 dollars per person",
     "Wine estimate, about 15 dollars per bottle"
   ],
   fields: [
     { label: "Revenue: Ticket price per person ($)", defaultValue: "50" },
     { label: "Revenue: Number of attendees", defaultValue: "30" },
     { label: "Expense: Bottles of wine needed", defaultValue: "10" },
     { label: "Expense: Cost per bottle ($)", defaultValue: "15" },
     { label: "Expense: Instructor cost ($)", defaultValue: "150" },
     { label: "Fixed: Supplies cost (paint, brushes, canvas) ($)", defaultValue: "180" },
     { label: "Expense: Receptionist hours", defaultValue: "3" },
     { label: "Expense: Receptionist rate ($)", defaultValue: RECEPTIONIST_RATE },
     { label: "Expense: Cleaner hours", defaultValue: "2" },
     { label: "Expense: Cleaner rate ($)", defaultValue: CLEANER_RATE }
   ]
 }
];

const difficultyLabels: Record<number, string> = {
   1: "Very High (Hardest)",
   2: "High",
   3: "Medium",
   4: "Low",
   5: "Very Low (Easiest)",
}
const difficultyStars = [1, 2, 3, 4, 5];

// Helper to sanitize and convert string input to number, returns 0 if invalid
const getNum = (value: string | number | undefined): number => {
   if (typeof value === 'number') return value;
   if (typeof value === 'string') {
       const cleaned = value.replace(/[$,\s%]/g, '');
       const num = parseFloat(cleaned);
       return isNaN(num) ? 0 : num;
   }
   return 0;
};

// --- Global Calculation Logic ---
const calculateMetricsForEvent = (event: EventConfig, inputValues: Record<string, string>, difficulties: Record<EventKey, number>): EventMetrics => {
   const key = (label: string) => `${event.id}-${label}`;
   const val = (label: string): number => getNum(inputValues[key(label)]);

   let netProfit = 0;
   let totalPersonPower = 0;
   let totalRevenue = 0;
   let totalExpenses = 0;

   try {
       if (event.id === 'camps') {
           const avgPrice = val("Revenue: Average price per student ($)");
           const numStudents = val("Revenue: Average number of students");
           const counselorRate = val("Expense: Counselor hourly rate ($)");
           const counselorHours = val("Expense: Counselor hours (per day)");
           const ratio = val("Expense: Counselor to student ratio (1:N)");

           // Person Power
           const numCounselors = Math.ceil(numStudents / ratio);
           const counselorTime = numCounselors * counselorHours;
           const receptionistHours = val("Expense: Receptionist hours");
           const cleanerHours = val("Expense: Cleaner hours");
           totalPersonPower = counselorTime + receptionistHours + cleanerHours;

           // Expenses
           const personnelExpense = (counselorRate * counselorTime) +
                                    (val("Expense: Receptionist rate ($)") * receptionistHours) +
                                    (val("Expense: Cleaner rate ($)") * cleanerHours);
           const supplies = val("Fixed: Supplies cost ($)");
           const insurance = val("Fixed: Insurance cost ($)");
           const foodPerStudent = val("Variable: Food and snacks cost per student ($)");
           const totalVariableFood = foodPerStudent * numStudents;

           totalExpenses = personnelExpense + supplies + insurance + totalVariableFood;
           totalRevenue = avgPrice * numStudents;

       } else if (event.id === 'satPsat' || event.id === 'tachs') {
           const price = val("Revenue: Price per student ($)");
           const numStudents = val("Revenue: Number of students");
           const instructionHours = val("Expense: Total instruction hours");

           // Person Power
           const instructorTime = instructionHours; // 1 instructor
           const adminHours = val("Expense: Admin support hours");
           const cleanerHours = val("Expense: Cleaner hours");
           totalPersonPower = instructorTime + adminHours + cleanerHours;

           // Expenses
           const instructorRate = val("Expense: Instructor hourly rate ($)");
           const personnelExpense = (instructorRate * instructionHours) +
                                    (val("Expense: Admin support rate ($)") * adminHours) +
                                    (val("Expense: Cleaner rate ($)") * cleanerHours);
           const materialsPerStudent = val("Expense: Materials cost per student ($)");
           const totalMaterials = materialsPerStudent * numStudents;

           totalExpenses = personnelExpense + totalMaterials;
           totalRevenue = price * numStudents;

       } else if (event.id === 'market') {
           const numTables = val("Revenue: Number of tables");
           const pricePerTable = val("Revenue: Price per table ($)");
           const percentSales = val("Revenue: Percent of vendor sales (%)") / 100;

           // Person Power
           const receptionistHours = val("Expense: Receptionist hours");
           const cleanerHours = val("Expense: Cleaner hours");
           totalPersonPower = receptionistHours + cleanerHours;

           // Revenue (assuming $500 total vendor sales per table for commission estimate)
           const tableRevenue = numTables * pricePerTable;
           const salesCommission = percentSales * 500 * numTables;
           totalRevenue = tableRevenue + salesCommission;

           // Expenses
           const personnelExpense = (val("Expense: Receptionist rate ($)") * receptionistHours) +
                                    (val("Expense: Cleaner rate ($)") * cleanerHours);
           const marketing = val("Fixed: Marketing cost ($)");
           const supplies = val("Fixed: Supplies and decorations cost ($)");
           const insurance = val("Fixed: Insurance or rider cost ($)");

           totalExpenses = personnelExpense + marketing + supplies + insurance;

       } else if (event.id === 'sipPaint') {
           const ticketPrice = val("Revenue: Ticket price per person ($)");
           const numAttendees = val("Revenue: Number of attendees");

           // Person Power
           // Estimate 3 hours for instruction
           const instructorTime = 3; 
           const receptionistHours = val("Expense: Receptionist hours");
           const cleanerHours = val("Expense: Cleaner hours");
           totalPersonPower = instructorTime + receptionistHours + cleanerHours;

           // Expenses
           const numBottles = val("Expense: Bottles of wine needed");
           const costPerBottle = val("Expense: Cost per bottle ($)");
           const instructorCost = val("Expense: Instructor cost ($)");
           const supplies = val("Fixed: Supplies cost (paint, brushes, canvas) ($)");

           const personnelExpense = instructorCost +
                                    (val("Expense: Receptionist rate ($)") * receptionistHours) +
                                    (val("Expense: Cleaner rate ($)") * cleanerHours);
           const beverageCost = numBottles * costPerBottle;

           totalExpenses = personnelExpense + supplies + beverageCost;
           totalRevenue = ticketPrice * numAttendees;
       }

       netProfit = totalRevenue - totalExpenses;

   } catch (e) {
       console.error(`Calculation error for ${event.name}:`, e);
       netProfit = 0;
       totalPersonPower = 0;
   }

   const profitPerPerson = totalPersonPower > 0 ? netProfit / totalPersonPower : 0;

   return {
       id: event.id,
       name: event.name,
       netProfit: netProfit,
       totalPersonPower: totalPersonPower,
       profitPerPerson: profitPerPerson,
       difficulty: difficulties[event.id],
   };
};

const calculateAllMetrics = (inputValues: Record<string, string>, difficulties: Record<EventKey, number>): EventMetrics[] => {
   return EVENTS.map(event => calculateMetricsForEvent(event, inputValues, difficulties));
};


// --- Components ---

// Star Rating Component
const DifficultyRating: React.FC<{ selectedId: EventKey, difficulty: number, setDifficulty: (key: EventKey, value: number) => void }> = ({ selectedId, difficulty, setDifficulty }) => {
   return (
       <div className="flex flex-col">
           <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-semibold text-slate-900">
                   Difficulty Rating
               </h3>
               <div className="flex items-center gap-1">
                   {difficultyStars.map(star => (
                       <button
                           key={star}
                           type="button"
                           onClick={() => setDifficulty(selectedId, star)}
                           className="text-xl transition-colors duration-150 hover:opacity-75"
                           aria-label={`Set difficulty ${star} stars`}
                       >
                           <Star
                               className={`w-5 h-5 transition-colors duration-150 ${
                                   star <= difficulty
                                       ? "text-yellow-400 fill-yellow-400"
                                       : "text-slate-300"
                               }`}
                               fill={star <= difficulty ? "currentColor" : "none"}
                           />
                       </button>
                   ))}
               </div>
           </div>
           <p className="text-xs text-slate-500">
               Current: <span className="font-semibold text-slate-700">{difficulty} Stars ({difficultyLabels[difficulty]})</span>
           </p>
       </div>
   );
};

// Summary Card Component
const SummaryCard: React.FC<{ icon: React.ReactNode, title: string, value: string, subtext: string, bgColor: string }> = ({ icon, title, value, subtext, bgColor }) => (
   <div className={`bg-white rounded-2xl shadow-lg p-5 border-t-4 ${bgColor}`}>
       <div className="flex items-center justify-between">
           <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
               {title}
           </p>
           <div className={`p-2 rounded-full ${bgColor.replace('border-t-4 ', 'bg-')} bg-opacity-10 text-slate-900`}>
               {icon}
           </div>
       </div>
       <p className="mt-2 text-3xl font-bold text-slate-900">
           {value}
       </p>
       <p className="mt-1 text-xs text-slate-500">
           {subtext}
       </p>
   </div>
);

// Sortable Table Header Component
const SortableHeader: React.FC<{ label: string, sortKey: SortKey, currentSortKey: SortKey, sortDirection: SortDirection, onSort: (key: SortKey) => void }> = ({ label, sortKey, currentSortKey, sortDirection, onSort }) => {
   const isCurrent = currentSortKey === sortKey;
   const Icon = isCurrent && sortDirection === 'desc' ? ArrowDown : ArrowUp;
   const iconColor = isCurrent ? 'text-indigo-600' : 'text-slate-400';

   return (
       <th
           className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors duration-150"
           onClick={() => onSort(sortKey)}
       >
           <div className="flex items-center">
               {label}
               <Icon className={`w-3 h-3 ml-1 transition-colors duration-150 ${iconColor}`} />
           </div>
       </th>
   );
};


const App: React.FC = () => { // Renamed component to App
 const [selectedId, setSelectedId] = useState<EventKey>("camps");
 const [difficulty, setDifficulty] = useState<Record<EventKey, number>>({
   camps: 3,
   satPsat: 3,
   tachs: 3,
   market: 3,
   sipPaint: 3
 });
 const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
   key: 'netProfit',
   direction: 'desc'
 });
 const [isSidebarOpen, setIsSidebarOpen] = useState(true); // New state for sidebar

 // State to hold the dynamic input values
 const [inputValues, setInputValues] = useState<Record<string, string>>(() => {
   const initial = {};
   EVENTS.forEach(event => {
       event.fields.forEach(field => {
           initial[`${event.id}-${field.label}`] = field.defaultValue || "";
       });
   });
   return initial;
 });

 const selected = EVENTS.find(e => e.id === selectedId)!;

 const handleInputChange = useCallback((key: string, value: string) => {
   setInputValues(prev => ({
       ...prev,
       [key]: value
   }));
 }, []);

 const handleDifficultyChange = useCallback((key: EventKey, value: number) => {
   setDifficulty(prev => ({
       ...prev,
       [key]: value
   }));
 }, []);

 const handleSort = useCallback((key: SortKey) => {
   setSortConfig(prev => ({
       key,
       direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
   }));
 }, []);

 // --- Calculate Metrics for All Events ---
 const allEventMetrics = useMemo(() => {
   const metrics = calculateAllMetrics(inputValues, difficulty);

   // Apply sorting
   return metrics.sort((a, b) => {
       const aValue = a[sortConfig.key];
       const bValue = b[sortConfig.key];

       if (aValue < bValue) {
           return sortConfig.direction === 'asc' ? -1 : 1;
       }
       if (aValue > bValue) {
           return sortConfig.direction === 'asc' ? 1 : -1;
       }
       return 0;
   });
 }, [inputValues, difficulty, sortConfig]);

 // --- Calculate Metrics for the Selected Event ---
 const selectedMetric = allEventMetrics.find(m => m.id === selectedId)!;


 return (
   <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
     {/* Header */}
     <header className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-md">
       <div>
         <h1 className="text-2xl font-bold text-slate-900">
           Chapel School Event Planner
         </h1>
         <p className="text-sm text-slate-500">
           Fundraising Events Overview and Profitability Comparison
         </p>
       </div>
       <BarChart3 className="w-8 h-8 text-indigo-600" />
     </header>

     <div className="flex flex-1 overflow-hidden">
       
       {/* Sidebar (Event Picker) */}
       <div className={`flex-shrink-0 bg-white border-r transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-12"} relative`}>
           <aside className="p-4 space-y-4 overflow-y-auto h-full">
               {isSidebarOpen && (
                   <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
                       Event Selection
                   </p>
               )}
               
               {EVENTS.map(event => (
                   <button
                       key={event.id}
                       type="button"
                       onClick={() => setSelectedId(event.id)}
                       // Adjusted padding and visibility based on collapse state
                       className={`w-full text-left rounded-xl transition-all duration-200 ease-in-out block
                           ${event.id === selectedId
                               ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 scale-[1.02]"
                               : "bg-slate-100 text-slate-800 hover:bg-slate-200/80 hover:shadow-sm"
                           } ${isSidebarOpen ? 'p-3' : 'p-2 text-center'}`}
                   >
                       {isSidebarOpen ? (
                           <>
                               <div className="font-semibold text-base">{event.name}</div>
                               <div className={`text-xs ${event.id === selectedId ? 'text-indigo-200' : 'text-slate-500'}`}>
                                   {event.seasonality}
                               </div>
                           </>
                       ) : (
                           // Display initials when collapsed
                           <div className={`font-bold text-sm ${event.id === selectedId ? 'text-white' : 'text-indigo-600'}`}>
                               {event.name.split(/\s/).map(word => word[0]).join('')}
                           </div>
                       )}
                   </button>
               ))}
           </aside>
           {/* Toggle Button for Sidebar */}
           <button
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className={`absolute top-1/2 -translate-y-1/2 ${isSidebarOpen ? '-right-3' : '-right-4'} p-1 rounded-full shadow-lg bg-indigo-600 text-white border border-white hover:bg-indigo-700 transition-all duration-300 z-10`}
               title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
           >
               {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
           </button>
       </div>


       {/* Main content */}
       <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
         
         {/* All Events Dashboard Overview (Sortable Table) */}
         <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
           <h2 className="text-xl font-bold text-slate-900 p-6 border-b border-slate-100">
               Event Comparison Dashboard
           </h2>
           <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-200">
                   <thead className="bg-slate-50">
                       <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                               Event Name
                           </th>
                           <SortableHeader
                               label="Net Profit"
                               sortKey="netProfit"
                               currentSortKey={sortConfig.key}
                               sortDirection={sortConfig.direction}
                               onSort={handleSort}
                           />
                           <SortableHeader
                               label="Person Power (Hrs)"
                               sortKey="totalPersonPower"
                               currentSortKey={sortConfig.key}
                               sortDirection={sortConfig.direction}
                               onSort={handleSort}
                           />
                           <SortableHeader
                               label="Profit / Hour"
                               sortKey="profitPerPerson"
                               currentSortKey={sortConfig.key}
                               sortDirection={sortConfig.direction}
                               onSort={handleSort}
                           />
                           <SortableHeader
                               label="Difficulty (Stars)"
                               sortKey="difficulty"
                               currentSortKey={sortConfig.key}
                               sortDirection={sortConfig.direction}
                               onSort={handleSort}
                           />
                       </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-slate-100">
                       {allEventMetrics.map((event) => (
                           <tr
                               key={event.id}
                               onClick={() => setSelectedId(event.id)}
                               className={`cursor-pointer transition-colors duration-150 ${
                                   event.id === selectedId
                                       ? "bg-indigo-50/70 hover:bg-indigo-100" // Highlight selected row
                                       : "hover:bg-slate-50"
                               }`}
                           >
                               <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                   event.id === selectedId ? "text-indigo-800 font-bold" : "text-slate-900"
                               }`}>
                                   {event.name}
                               </td>
                               <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${event.netProfit > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                   {`$${event.netProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                               </td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                   {`${event.totalPersonPower.toFixed(1)}`}
                               </td>
                               <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${event.profitPerPerson > 0 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                   {`$${event.profitPerPerson.toFixed(2)}`}
                               </td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 flex items-center">
                                   <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                   {`${event.difficulty} (${difficultyLabels[event.difficulty]})`}
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
         </section>

         {/* Detailed Metrics and Inputs Heading */}
         <h2 className="text-xl font-bold text-slate-900">
           Detailed Metrics and Inputs for: {selected.name}
         </h2>

         {/* Selected Event Summary Cards (UPDATED) */}
         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <SummaryCard
               icon={<DollarSign className="w-5 h-5" />}
               title="Net Profit"
               value={`$${selectedMetric.netProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
               subtext={`Calculated profit for ${selected.name}.`}
               bgColor="border-t-4 border-emerald-500"
           />
           <SummaryCard
               icon={<Users className="w-5 h-5" />}
               title="Total Person Power (Hrs)"
               value={`${selectedMetric.totalPersonPower.toFixed(1)} hours`}
               subtext={`Total staff hours for ${selected.name}.`}
               bgColor="border-t-4 border-yellow-500"
           />
           <SummaryCard
               icon={<BarChart3 className="w-5 h-5" />}
               title="Profit per Person Hour"
               value={`$${selectedMetric.profitPerPerson.toFixed(2)}`}
               subtext={`Efficiency for ${selected.name}.`}
               bgColor="border-t-4 border-indigo-500"
           />
         </section>


         {/* Detailed Input Panel for Selected Event */}
         <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           {/* Summary and comps (Left/Center Columns) */}
           <div className="xl:col-span-2 space-y-6">
             {/* Event Summary Card */}
             <div className="bg-white rounded-2xl shadow-xl p-6">
               <h2 className="text-xl font-bold text-slate-900">
                 {selected.name}
               </h2>
               <p className="mt-1 text-sm text-indigo-600 font-medium">
                 Seasonality: {selected.seasonality}
               </p>
               <hr className="my-4 border-slate-100" />
               <p className="text-base text-slate-700 leading-relaxed">
                 {selected.summary}
               </p>
             </div>

             {/* Competitor Comparisons Card */}
             <div className="bg-white rounded-2xl shadow-xl p-6">
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                   Competitor and Cost Comparisons
               </h3>
               <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 pl-4">
                 {selected.comps.map((line, idx) => (
                   <li key={idx} className="marker:text-indigo-400">
                       <span className="text-slate-700">{line}</span>
                   </li>
                 ))}
               </ul>
             </div>
           </div>

           {/* Inputs and notes (Right Column) */}
           <div className="space-y-6">
             {/* Input Fields Card */}
             <div className="bg-white rounded-2xl shadow-xl p-6">
               <h3 className="text-lg font-bold text-slate-900 mb-4">
                 Profitability Inputs
               </h3>
               <div className="space-y-4">
                 {selected.fields.map(field => {
                   const fieldKey = `${selected.id}-${field.label}`;
                   return (
                       <div key={fieldKey} className="space-y-1">
                           <label className="text-xs font-medium text-slate-600 block">
                               {field.label}
                           </label>
                           <input
                               type="text"
                               value={inputValues[fieldKey] || ''}
                               onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                               className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-150 shadow-inner"
                           />
                       </div>
                   );
                 })}
               </div>
             </div>

             {/* Difficulty and Notes Card */}
             <div className="bg-white rounded-2xl shadow-xl p-6">
               <DifficultyRating
                   selectedId={selected.id}
                   difficulty={difficulty[selected.id]}
                   setDifficulty={handleDifficultyChange}
               />
               
               <hr className="my-4 border-slate-100" />

               <h3 className="text-sm font-semibold text-slate-900 mb-2">
                   Event Notes
               </h3>
               <textarea
                 placeholder={`Enter notes, reasoning for pricing, or special considerations for ${selected.name} here.`}
                 className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] shadow-inner resize-y"
               />
             </div>
           </div>
         </section>
       </main>
     </div>
   </div>
 );
};

export default App;
