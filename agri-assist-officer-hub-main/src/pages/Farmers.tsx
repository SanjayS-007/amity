import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { 
  Filter, Plus, MapPin, Phone, Sprout, MessageSquare, AlertTriangle, 
  Calendar, User, Droplets, Map as MapIcon, List, Download, Save, 
  ChevronDown, ChevronRight, Search, Navigation, FileText, Camera,
  TrendingUp, TrendingDown, Activity, Mail, Bell, Edit, MapPinned,
  Clock, CheckCircle, XCircle, Info, Leaf, Users, Zap, ClipboardList,
  Image as ImageIcon, Upload, Clock3 as History
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== TYPES & INTERFACES ====================

interface Farmer {
  id: string;
  name: string;
  farmerId: string;
  phone: string;
  emergencyContact: string;
  village: string;
  preferredLanguage: string;
  lastActive: string;
  photo?: string;
  gpsCoordinates: { lat: number; lng: number };
  fieldSize: number;
  fieldSizeUnit: 'acres' | 'ha';
  soilType: string;
  soilTest: {
    pH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
  };
  irrigationType: string;
  waterSource: string;
  irrigationFrequency: string;
  currentCrop: string;
  currentCropVariety: string;
  sowingDate: string;
  currentPhase: 'Sowing' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvest';
  expectedHarvestDate: string;
  progressPercent: number;
  healthScore: number;
  engagement: number;
  taskCompletion: number;
  consultationFreq: number;
  status: 'active' | 'inactive' | 'dormant';
  performanceTier: 'high' | 'medium' | 'low';
  cropHistory: Array<{
    year: string;
    crop: string;
    variety: string;
    yield: number;
    profitLoss: string;
  }>;
  media: Array<{
    id: string;
    url: string;
    timestamp: string;
    gps: { lat: number; lng: number };
  }>;
  activityLog: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    actor: string;
  }>;
}

interface Filters {
  search: string;
  villages: string[];
  gpsRadius: { lat?: number; lng?: number; radius?: number };
  crops: string[];
  fieldSizeMin?: number;
  fieldSizeMax?: number;
  soilTypes: string[];
  irrigationTypes: string[];
  status: string[];
  performanceTier: string[];
  sortBy: string;
}

// ==================== MOCK DATA ====================

const mockFarmers: Farmer[] = [
  {
    id: "F001",
    name: "Rajesh Kumar Singh",
    farmerId: "BH-MAD-2024-001",
    phone: "+91 98765 43210",
    emergencyContact: "+91 98765 43299",
    village: "Madhubani",
    preferredLanguage: "Hindi",
    lastActive: "2024-11-01T10:30:00",
    photo: undefined,
    gpsCoordinates: { lat: 26.3606, lng: 86.0837 },
    fieldSize: 5.2,
    fieldSizeUnit: 'acres',
    soilType: "Loamy",
    soilTest: { pH: 6.8, nitrogen: 280, phosphorus: 45, potassium: 320, organicMatter: 2.8 },
    irrigationType: "Drip",
    waterSource: "Borewell",
    irrigationFrequency: "3 times/week",
    currentCrop: "Paddy",
    currentCropVariety: "IR-64",
    sowingDate: "2024-07-15",
    currentPhase: "Vegetative",
    expectedHarvestDate: "2024-12-20",
    progressPercent: 65,
    healthScore: 85,
    engagement: 88,
    taskCompletion: 90,
    consultationFreq: 78,
    status: 'active',
    performanceTier: 'high',
    cropHistory: [
      { year: "2023", crop: "Wheat", variety: "HD-2967", yield: 4.2, profitLoss: "+₹45,000" },
      { year: "2022", crop: "Paddy", variety: "IR-64", yield: 5.8, profitLoss: "+₹62,000" },
      { year: "2021", crop: "Wheat", variety: "HD-2967", yield: 3.9, profitLoss: "+₹38,000" },
      { year: "2020", crop: "Paddy", variety: "IR-36", yield: 5.2, profitLoss: "+₹51,000" },
      { year: "2019", crop: "Wheat", variety: "PBW-343", yield: 4.5, profitLoss: "+₹48,000" },
    ],
    media: [
      { id: "M1", url: "/placeholder.svg", timestamp: "2024-10-15T14:30:00", gps: { lat: 26.3606, lng: 86.0837 } },
      { id: "M2", url: "/placeholder.svg", timestamp: "2024-10-20T09:15:00", gps: { lat: 26.3606, lng: 86.0837 } },
    ],
    activityLog: [
      { id: "A1", type: "Consultation", description: "Pest management advisory provided", timestamp: "2024-10-28T10:00:00", actor: "Officer Kumar" },
      { id: "A2", type: "Task Completed", description: "Soil test report submitted", timestamp: "2024-10-25T15:30:00", actor: "Rajesh Kumar" },
      { id: "A3", type: "Alert", description: "Heavy rainfall warning issued", timestamp: "2024-10-22T08:00:00", actor: "System" },
    ],
  },
  {
    id: "F002",
    name: "Sunita Devi Yadav",
    farmerId: "BH-PUR-2024-002",
    phone: "+91 98765 43211",
    emergencyContact: "+91 98765 43288",
    village: "Purnea",
    preferredLanguage: "Hindi",
    lastActive: "2024-10-15T16:45:00",
    photo: undefined,
    gpsCoordinates: { lat: 25.7771, lng: 87.4753 },
    fieldSize: 3.8,
    fieldSizeUnit: 'acres',
    soilType: "Clay",
    soilTest: { pH: 7.2, nitrogen: 240, phosphorus: 38, potassium: 280, organicMatter: 2.3 },
    irrigationType: "Flood",
    waterSource: "Canal",
    irrigationFrequency: "2 times/week",
    currentCrop: "Cotton",
    currentCropVariety: "Bt Cotton",
    sowingDate: "2024-06-10",
    currentPhase: "Flowering",
    expectedHarvestDate: "2024-11-30",
    progressPercent: 78,
    healthScore: 62,
    engagement: 65,
    taskCompletion: 55,
    consultationFreq: 68,
    status: 'inactive',
    performanceTier: 'medium',
    cropHistory: [
      { year: "2023", crop: "Cotton", variety: "Bt Cotton", yield: 15.2, profitLoss: "+₹82,000" },
      { year: "2022", crop: "Cotton", variety: "Bt Cotton", yield: 14.8, profitLoss: "+₹76,000" },
      { year: "2021", crop: "Paddy", variety: "Swarna", yield: 4.5, profitLoss: "+₹42,000" },
      { year: "2020", crop: "Cotton", variety: "Bt Cotton", yield: 16.1, profitLoss: "+₹88,000" },
      { year: "2019", crop: "Paddy", variety: "Swarna", yield: 4.8, profitLoss: "+₹45,000" },
    ],
    media: [],
    activityLog: [
      { id: "A4", type: "Visit", description: "Field inspection conducted", timestamp: "2024-10-10T11:00:00", actor: "Officer Sharma" },
    ],
  },
  {
    id: "F003",
    name: "Amit Singh Thakur",
    farmerId: "BH-SIT-2024-003",
    phone: "+91 98765 43212",
    emergencyContact: "+91 98765 43277",
    village: "Sitamarhi",
    preferredLanguage: "Hindi",
    lastActive: "2024-11-02T14:20:00",
    photo: undefined,
    gpsCoordinates: { lat: 26.5928, lng: 85.4806 },
    fieldSize: 8.5,
    fieldSizeUnit: 'acres',
    soilType: "Sandy Loam",
    soilTest: { pH: 6.5, nitrogen: 310, phosphorus: 52, potassium: 350, organicMatter: 3.2 },
    irrigationType: "Rain-fed",
    waterSource: "Rainwater",
    irrigationFrequency: "Seasonal",
    currentCrop: "Sugarcane",
    currentCropVariety: "CO-0238",
    sowingDate: "2024-03-01",
    currentPhase: "Maturity",
    expectedHarvestDate: "2025-01-15",
    progressPercent: 85,
    healthScore: 92,
    engagement: 95,
    taskCompletion: 92,
    consultationFreq: 88,
    status: 'active',
    performanceTier: 'high',
    cropHistory: [
      { year: "2023", crop: "Sugarcane", variety: "CO-0238", yield: 78.5, profitLoss: "+₹180,000" },
      { year: "2022", crop: "Sugarcane", variety: "CO-0238", yield: 75.2, profitLoss: "+₹165,000" },
      { year: "2021", crop: "Wheat", variety: "HD-3086", yield: 5.2, profitLoss: "+₹58,000" },
      { year: "2020", crop: "Paddy", variety: "Pusa-44", yield: 6.1, profitLoss: "+₹68,000" },
      { year: "2019", crop: "Wheat", variety: "HD-2967", yield: 4.8, profitLoss: "+₹52,000" },
    ],
    media: [
      { id: "M3", url: "/placeholder.svg", timestamp: "2024-10-30T10:00:00", gps: { lat: 26.5928, lng: 85.4806 } },
    ],
    activityLog: [
      { id: "A5", type: "Task Assigned", description: "Fertilizer application scheduled", timestamp: "2024-10-31T09:00:00", actor: "Officer Verma" },
      { id: "A6", type: "Consultation", description: "Harvest planning discussion", timestamp: "2024-10-29T14:00:00", actor: "Officer Verma" },
    ],
  },
];

// ==================== MAIN COMPONENT ====================

export default function Farmers() {
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');
  const [selectedFarmer, setSelectedFarmer] = React.useState<Farmer | null>(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(true);
  const [showAddFarmer, setShowAddFarmer] = React.useState(false);
  const [showSaveSegment, setShowSaveSegment] = React.useState(false);
  const [farmers, setFarmers] = React.useState<Farmer[]>(mockFarmers);
  const [filteredFarmers, setFilteredFarmers] = React.useState<Farmer[]>(mockFarmers);
  
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    villages: [],
    gpsRadius: {},
    crops: [],
    soilTypes: [],
    irrigationTypes: [],
    status: [],
    performanceTier: [],
    sortBy: 'lastActive',
  });

  // Apply filters
  React.useEffect(() => {
    let result = [...farmers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchLower) ||
        f.farmerId.toLowerCase().includes(searchLower) ||
        f.phone.includes(filters.search)
      );
    }

    if (filters.villages.length > 0) {
      result = result.filter(f => filters.villages.includes(f.village));
    }

    if (filters.crops.length > 0) {
      result = result.filter(f => filters.crops.includes(f.currentCrop));
    }

    if (filters.soilTypes.length > 0) {
      result = result.filter(f => filters.soilTypes.includes(f.soilType));
    }

    if (filters.irrigationTypes.length > 0) {
      result = result.filter(f => filters.irrigationTypes.includes(f.irrigationType));
    }

    if (filters.status.length > 0) {
      result = result.filter(f => filters.status.includes(f.status));
    }

    if (filters.performanceTier.length > 0) {
      result = result.filter(f => filters.performanceTier.includes(f.performanceTier));
    }

    if (filters.fieldSizeMin !== undefined) {
      result = result.filter(f => f.fieldSize >= filters.fieldSizeMin!);
    }

    if (filters.fieldSizeMax !== undefined) {
      result = result.filter(f => f.fieldSize <= filters.fieldSizeMax!);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'lastActive':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        case 'acreage':
          return b.fieldSize - a.fieldSize;
        case 'healthScore':
          return b.healthScore - a.healthScore;
        case 'yield':
          return (b.cropHistory[0]?.yield || 0) - (a.cropHistory[0]?.yield || 0);
        default:
          return 0;
      }
    });

    setFilteredFarmers(result);
  }, [filters, farmers]);

  const resetFilters = () => {
    setFilters({
      search: '',
      villages: [],
      gpsRadius: {},
      crops: [],
      soilTypes: [],
      irrigationTypes: [],
      status: [],
      performanceTier: [],
      sortBy: 'lastActive',
    });
  };

  const handleViewProfile = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setShowProfile(true);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopBar />
        
        <main className="ml-64 mt-16 p-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Farmers</h1>
              <p className="text-sm text-muted-foreground">
                Farmer Management & Monitoring Hub • {filteredFarmers.length} of {farmers.length} farmers
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select defaultValue="my-zone">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="My Segments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my-zone">My Zone</SelectItem>
                  <SelectItem value="high-performers">High Performers</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  <SelectItem value="new-farmers">New Farmers</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none"
                >
                  <MapIcon className="w-4 h-4 mr-1" />
                  Map
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>

              <Button size="sm" onClick={() => setShowAddFarmer(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Farmer
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left Filters Panel */}
            {showFilters && (
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                onSaveSegment={() => setShowSaveSegment(true)}
                resultCount={filteredFarmers.length}
              />
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {viewMode === 'list' ? (
                <FarmersListView
                  farmers={filteredFarmers}
                  onViewProfile={handleViewProfile}
                />
              ) : (
                <FarmersMapView
                  farmers={filteredFarmers}
                  onViewProfile={handleViewProfile}
                />
              )}
            </div>
          </div>

          {/* Farmer Profile Sheet */}
          <FarmerProfileSheet
            farmer={selectedFarmer}
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
          />
        </main>
      </div>
    </TooltipProvider>
  );
}

// ==================== FILTERS PANEL COMPONENT ====================

interface FiltersPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilters: () => void;
  onSaveSegment: () => void;
  resultCount: number;
}

const FiltersPanel = ({ filters, setFilters, resetFilters, onSaveSegment, resultCount }: FiltersPanelProps) => {
  const [expandedSections, setExpandedSections] = React.useState({
    search: true,
    primary: true,
    status: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
  };

  return (
    <Card className="w-80 flex-shrink-0 h-fit sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4 pr-4">
            {/* Search Section */}
            <div>
              <button
                onClick={() => toggleSection('search')}
                className="flex items-center justify-between w-full text-sm font-semibold mb-2"
              >
                <span>Search</span>
                {expandedSections.search ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.search && (
                <Input
                  placeholder="Name, phone, farmer ID..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                />
              )}
            </div>

            <Separator />

            {/* Primary Filters */}
            <div>
              <button
                onClick={() => toggleSection('primary')}
                className="flex items-center justify-between w-full text-sm font-semibold mb-3"
              >
                <span>Primary Filters</span>
                {expandedSections.primary ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.primary && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Village</label>
                    <Select
                      value={filters.villages[0] || "all"}
                      onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        villages: val === "all" ? [] : [val] 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select village" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Villages</SelectItem>
                        <SelectItem value="Madhubani">Madhubani</SelectItem>
                        <SelectItem value="Purnea">Purnea</SelectItem>
                        <SelectItem value="Sitamarhi">Sitamarhi</SelectItem>
                        <SelectItem value="Darbhanga">Darbhanga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Crop</label>
                    <Select
                      value={filters.crops[0] || "all"}
                      onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        crops: val === "all" ? [] : [val] 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Crops</SelectItem>
                        <SelectItem value="Paddy">Paddy</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="Pulses">Pulses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Field Size (acres)</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.fieldSizeMin || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          fieldSizeMin: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.fieldSizeMax || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          fieldSizeMax: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Soil Type</label>
                    <Select
                      value={filters.soilTypes[0] || "all"}
                      onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        soilTypes: val === "all" ? [] : [val] 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Soil Types</SelectItem>
                        <SelectItem value="Loamy">Loamy</SelectItem>
                        <SelectItem value="Sandy">Sandy</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="Sandy Loam">Sandy Loam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Irrigation Type</label>
                    <Select
                      value={filters.irrigationTypes[0] || "all"}
                      onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        irrigationTypes: val === "all" ? [] : [val] 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select irrigation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Drip">Drip</SelectItem>
                        <SelectItem value="Flood">Flood</SelectItem>
                        <SelectItem value="Rain-fed">Rain-fed</SelectItem>
                        <SelectItem value="Sprinkler">Sprinkler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Status & Performance */}
            <div>
              <button
                onClick={() => toggleSection('status')}
                className="flex items-center justify-between w-full text-sm font-semibold mb-3"
              >
                <span>Status & Performance</span>
                {expandedSections.status ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.status && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Activity Status</label>
                    <Select
                      value={filters.status[0] || "all"}
                      onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        status: val === "all" ? [] : [val] 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active (&lt;30 days)</SelectItem>
                        <SelectItem value="inactive">Inactive (31-90 days)</SelectItem>
                        <SelectItem value="dormant">Dormant (&gt;90 days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Performance Tier</label>
                    <Select
                      value={filters.performanceTier[0] || "all"}
                      onValueChange={(val) => setFilters(prev => ({ 
                        ...prev, 
                        performanceTier: val === "all" ? [] : [val] 
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="high">High Performer</SelectItem>
                        <SelectItem value="medium">Medium Performer</SelectItem>
                        <SelectItem value="low">Low Performer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sort By</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(val) => setFilters(prev => ({ ...prev, sortBy: val }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lastActive">Last Active</SelectItem>
                        <SelectItem value="acreage">Field Size</SelectItem>
                        <SelectItem value="healthScore">Health Score</SelectItem>
                        <SelectItem value="yield">Yield</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Results:</span>
            <span className="font-semibold">{resultCount} farmers</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onSaveSegment}>
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== FARMERS LIST VIEW COMPONENT ====================

interface FarmersListViewProps {
  farmers: Farmer[];
  onViewProfile: (farmer: Farmer) => void;
}

const FarmersListView = ({ farmers, onViewProfile }: FarmersListViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {farmers.map((farmer) => (
        <FarmerCard key={farmer.id} farmer={farmer} onViewProfile={onViewProfile} />
      ))}
    </div>
  );
};

// Farmer Card Component
interface FarmerCardProps {
  farmer: Farmer;
  onViewProfile: (farmer: Farmer) => void;
}

const FarmerCard = ({ farmer, onViewProfile }: FarmerCardProps) => {
  const phaseColors = {
    'Sowing': 'bg-blue-100 text-blue-700',
    'Vegetative': 'bg-green-100 text-green-700',
    'Flowering': 'bg-yellow-100 text-yellow-700',
    'Maturity': 'bg-orange-100 text-orange-700',
    'Harvest': 'bg-purple-100 text-purple-700',
  };

  const statusColors = {
    'active': 'bg-green-100 text-green-700',
    'inactive': 'bg-yellow-100 text-yellow-700',
    'dormant': 'bg-red-100 text-red-700',
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => onViewProfile(farmer)}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {farmer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{farmer.name}</h3>
          <p className="text-xs text-muted-foreground">{farmer.farmerId}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{farmer.village}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={cn("text-xs px-2 py-0.5", statusColors[farmer.status])}>
            {farmer.status}
          </Badge>
          <Tooltip>
            <TooltipTrigger>
              <HealthScoreRing score={farmer.healthScore} size="sm" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p className="font-semibold">Health Score: {farmer.healthScore}</p>
                <p>Engagement: {farmer.engagement}%</p>
                <p>Task Completion: {farmer.taskCompletion}%</p>
                <p>Consultation: {farmer.consultationFreq}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs">{farmer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sprout className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs">{farmer.currentCrop}  {farmer.fieldSize} {farmer.fieldSizeUnit}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500" />
            <span className="text-muted-foreground">{farmer.irrigationType}</span>
          </div>
          <span className="text-muted-foreground"></span>
          <div className="flex items-center gap-1">
            <Leaf className="w-3 h-3 text-green-500" />
            <span className="text-muted-foreground">{farmer.soilType}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <Badge className={cn("text-xs", phaseColors[farmer.currentPhase])}>
          {farmer.currentPhase}
        </Badge>
        <div className="text-xs text-muted-foreground">
          {farmer.progressPercent}% complete
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs h-8"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(farmer);
          }}
        >
          <FileText className="w-3 h-3 mr-1" />
          Profile
        </Button>
        <Button 
          size="sm" 
          className="flex-1 text-xs h-8"
          onClick={(e) => {
            e.stopPropagation();
            alert('Raise Alert for ' + farmer.name);
          }}
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Alert
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = 'tel:' + farmer.phone;
          }}
        >
          <Phone className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

// Health Score Ring Component
interface HealthScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const HealthScoreRing = ({ score, size = 'md' }: HealthScoreRingProps) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
  const bgColor = score >= 75 ? 'bg-green-100' : score >= 50 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold", sizes[size], color, bgColor)}>
      {score}
    </div>
  );
};

// ==================== FARMERS MAP VIEW COMPONENT ====================

interface FarmersMapViewProps {
  farmers: Farmer[];
  onViewProfile: (farmer: Farmer) => void;
}

const FarmersMapView = ({ farmers, onViewProfile }: FarmersMapViewProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg border-2 border-dashed">
        <div className="text-center space-y-2">
          <MapIcon className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="font-semibold">Interactive Map View</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Map integration with Leaflet/Mapbox showing farmer locations, crop phases, and health status.
          </p>
          <p className="text-xs text-muted-foreground">
            Pins colored by phase: Blue=Sowing, Green=Vegetative, Yellow=Flowering, Orange=Maturity
          </p>
          <div className="pt-4">
            <Button variant="outline" size="sm">
              <MapPinned className="w-4 h-4 mr-2" />
              Enable Location Services
            </Button>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-semibold mb-3">Map Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-xs">Sowing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs">Vegetative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Flowering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-xs">Maturity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-xs">Harvest</span>
          </div>
        </div>
      </div>
    </Card>
  );
};


// ==================== FARMER PROFILE SHEET COMPONENT ====================

interface FarmerProfileSheetProps {
  farmer: Farmer | null;
  isOpen: boolean;
  onClose: () => void;
}

const FarmerProfileSheet = ({ farmer, isOpen, onClose }: FarmerProfileSheetProps) => {
  if (!farmer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background border-b p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {farmer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{farmer.name}</h2>
              <p className="text-muted-foreground">{farmer.farmerId}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn(
                  farmer.status === 'active' ? 'bg-green-100 text-green-700' :
                  farmer.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                )}>
                  {farmer.status}
                </Badge>
                <Badge variant="outline" className={cn(
                  farmer.performanceTier === 'high' ? 'border-green-500 text-green-700' :
                  farmer.performanceTier === 'medium' ? 'border-yellow-500 text-yellow-700' :
                  'border-red-500 text-red-700'
                )}>
                  {farmer.performanceTier} performer
                </Badge>
              </div>
            </div>
            <HealthScoreRing score={farmer.healthScore} size="lg" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-4">
            {/* Box A: Personal Information */}
            <Card className="p-4 border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Personal Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{farmer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="text-sm font-medium">{farmer.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Village</p>
                  <p className="text-sm font-medium">{farmer.village}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Preferred Language</p>
                  <p className="text-sm font-medium">{farmer.preferredLanguage}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="text-sm font-medium">{new Date(farmer.lastActive).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Box B: Field Details */}
            <Card className="p-4 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <MapIcon className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Field Details</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-semibold">GPS Coordinates</p>
                  </div>
                  <p className="text-sm">Lat: {farmer.gpsCoordinates.lat}, Lng: {farmer.gpsCoordinates.lng}</p>
                  <div className="mt-2 h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    Mini Map Preview
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Field Size</p>
                    <p className="text-sm font-medium">{farmer.fieldSize} {farmer.fieldSizeUnit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Soil Type</p>
                    <p className="text-sm font-medium">{farmer.soilType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2">Soil Test Results</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">pH</span>
                      <Progress value={(farmer.soilTest.pH / 14) * 100} className="flex-1" />
                      <span className="text-xs font-medium w-8">{farmer.soilTest.pH}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">Nitrogen</span>
                      <Progress value={farmer.soilTest.nitrogen} className="flex-1" />
                      <span className="text-xs font-medium w-8">{farmer.soilTest.nitrogen}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">Phosphorus</span>
                      <Progress value={farmer.soilTest.phosphorus} className="flex-1" />
                      <span className="text-xs font-medium w-8">{farmer.soilTest.phosphorus}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">Potassium</span>
                      <Progress value={farmer.soilTest.potassium} className="flex-1" />
                      <span className="text-xs font-medium w-8">{farmer.soilTest.potassium}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16">Organic M.</span>
                      <Progress value={farmer.soilTest.organicMatter} className="flex-1" />
                      <span className="text-xs font-medium w-8">{farmer.soilTest.organicMatter}%</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Soil Report PDF
                </Button>
              </div>
            </Card>

            {/* Box C: Irrigation Infrastructure */}
            <Card className="p-4 border-2 border-cyan-100">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-lg">Irrigation Infrastructure</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Irrigation Type</p>
                  <p className="text-sm font-medium">{farmer.irrigationType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Water Source</p>
                  <p className="text-sm font-medium">{farmer.waterSource}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Frequency</p>
                  <p className="text-sm font-medium">{farmer.irrigationFrequency}</p>
                </div>
              </div>
            </Card>

            {/* Box D: Crop History */}
            <Card className="p-4 border-2 border-yellow-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-lg">5-Year Crop History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Year</th>
                      <th className="text-left py-2 px-2">Crop</th>
                      <th className="text-left py-2 px-2">Variety</th>
                      <th className="text-right py-2 px-2">Yield</th>
                      <th className="text-right py-2 px-2">P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmer.cropHistory.map((record) => (
                      <tr key={record.year} className="border-b">
                        <td className="py-2 px-2">{record.year}</td>
                        <td className="py-2 px-2">{record.crop}</td>
                        <td className="py-2 px-2 text-xs text-muted-foreground">{record.variety}</td>
                        <td className="text-right py-2 px-2">{record.yield}</td>
                        <td className={cn(
                          "text-right py-2 px-2 font-medium",
                          record.profitLoss.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        )}>
                          {record.profitLoss}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Box E: Current Season Summary */}
            <Card className="p-4 border-2 border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Current Season Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Crop</p>
                    <p className="text-sm font-medium">{farmer.currentCrop}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Variety</p>
                    <p className="text-sm font-medium">{farmer.currentCropVariety}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sowing Date</p>
                    <p className="text-sm font-medium">{new Date(farmer.sowingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Harvest</p>
                    <p className="text-sm font-medium">{new Date(farmer.expectedHarvestDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={cn(
                      farmer.currentPhase === 'Sowing' ? 'bg-blue-100 text-blue-700' :
                      farmer.currentPhase === 'Vegetative' ? 'bg-green-100 text-green-700' :
                      farmer.currentPhase === 'Flowering' ? 'bg-yellow-100 text-yellow-700' :
                      farmer.currentPhase === 'Maturity' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    )}>
                      {farmer.currentPhase}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{farmer.progressPercent}% Complete</span>
                  </div>
                  <Progress value={farmer.progressPercent} className="h-2" />
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs">Days until harvest: {Math.ceil((new Date(farmer.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</span>
                </div>
              </div>
            </Card>

            {/* Box F: Farmer Health Score */}
            <Card className="p-4 border-2 border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Farmer Health Score</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center mb-4">
                  <HealthScoreRing score={farmer.healthScore} size="lg" />
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Engagement (40%)</span>
                      <span className="text-xs font-medium">{farmer.engagement}%</span>
                    </div>
                    <Progress value={farmer.engagement} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Task Completion (40%)</span>
                      <span className="text-xs font-medium">{farmer.taskCompletion}%</span>
                    </div>
                    <Progress value={farmer.taskCompletion} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Consultation Frequency (20%)</span>
                      <span className="text-xs font-medium">{farmer.consultationFreq}%</span>
                    </div>
                    <Progress value={farmer.consultationFreq} className="h-2" />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg mt-3">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Auto Insight:</span> {
                      farmer.healthScore >= 80 ? "Excellent engagement! This farmer is highly responsive and proactive." :
                      farmer.healthScore >= 60 ? "Good engagement. Consider sending reminders for pending tasks." :
                      "Low engagement detected. Schedule a personal visit to understand challenges."
                    }
                  </p>
                </div>
              </div>
            </Card>

            {/* Box G: Actions & Communication */}
            <Card className="p-4 border-2 border-red-100">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-lg">Actions & Communication</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = 'tel:' + farmer.phone}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.location.href = 'sms:' + farmer.phone}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Push Notify
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Visit
                </Button>
                <Button variant="outline" size="sm">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Assign Task
                </Button>
                <Button variant="outline" size="sm" className="bg-red-50">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Raise Alert
                </Button>
              </div>
            </Card>

            {/* Box H: Media & Evidence */}
            <Card className="p-4 border-2 border-pink-100">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold text-lg">Media & Evidence</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {farmer.media.map((item) => (
                    <div key={item.id} className="relative aspect-square bg-muted rounded overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo (Geo-tagged)
                </Button>
              </div>
            </Card>

            {/* Box I: Audit & Activity Logs */}
            <Card className="p-4 border-2 border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-lg">Audit & Activity Logs</h3>
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {farmer.activityLog.map((log) => (
                    <div key={log.id} className="flex gap-3 pb-3 border-b last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-medium">{log.type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{log.description}</p>
                        <p className="text-xs text-muted-foreground italic mt-1">by {log.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

