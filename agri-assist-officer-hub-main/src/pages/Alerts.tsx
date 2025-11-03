import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createAlert } from "@/lib/alerts";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Plus, Bell, Users, Send, TrendingUp, TrendingDown, AlertCircle,
  MapPin, Phone, MessageSquare, Eye, CheckCircle, XCircle, Clock,
  ArrowRight, ArrowLeft, ChevronRight, Filter, Download, Upload,
  BarChart2, PieChart, LineChart, Map, Sprout, Calendar, Edit,
  Trash2, RefreshCw, AlertTriangle, Info, CheckCircle2, Target,
  PhoneCall, Radio, Languages, Zap, Activity, FileText, AlertOctagon,
  Smartphone
} from "lucide-react";

// ==================== TYPES & INTERFACES ====================

interface AlertData {
  id: string;
  type: 'critical' | 'advisory' | 'info';
  title: string;
  message: string;
  reason: string;
  recommendedTasks: string[];
  expectedImpact: string;
  scope: {
    type: 'zone-wide' | 'village-specific' | 'crop-specific' | 'individual';
    villages?: string[];
    crops?: string[];
    growthPhases?: string[];
    farmerIds?: string[];
  };
  trigger: 'manual' | 'auto' | 'scheduled';
  channels: ('push' | 'sms' | 'in-app' | 'ivr')[];
  language: string;
  status: 'draft' | 'sent' | 'scheduled';
  sentAt?: string;
  scheduledFor?: string;
  recipients: number;
  delivered: number;
  read: number;
  actionTaken: number;
  ignored: number;
  followUpsSent: number;
  createdBy: string;
  createdAt: string;
}

interface FarmerAlertStatus {
  farmerId: string;
  farmerName: string;
  crop: string;
  village: string;
  alertType: 'critical' | 'advisory' | 'info';
  delivered: boolean;
  read: boolean;
  actionTaken: boolean;
  followUpSent: boolean;
  acknowledgedAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

interface ChecklistAdjustment {
  id: string;
  triggeredBy: string;
  triggerType: 'weather' | 'pest' | 'market';
  detectedAt: string;
  affectedFarmers: number;
  affectedCrops: string[];
  affectedVillages: string[];
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  changes: {
    tasksToCancel: Array<{ task: string; reason: string }>;
    tasksToAdd: Array<{ task: string; dueDate: string; reason: string }>;
    tasksToReschedule: Array<{ task: string; from: string; to: string; reason: string }>;
  };
  expectedImpact: string;
  officerNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// ==================== MOCK DATA ====================

const mockAlerts: AlertData[] = [
  {
    id: 'A001',
    type: 'critical',
    title: 'Heavy Rainfall Warning - Immediate Action Required',
    message: 'IMD predicts 100mm+ rainfall in next 24 hours. Open field drainage immediately. Move equipment to covered areas. Avoid fertilizer application.',
    reason: 'IMD weather forecast shows severe rainfall event with potential flooding risk',
    recommendedTasks: ['Open drainage channels', 'Secure equipment', 'Postpone fertilizer application', 'Check field bunds'],
    expectedImpact: 'Prevents waterlogging damage worth ₹50,000-80,000 per acre',
    scope: {
      type: 'village-specific',
      villages: ['Madhubani', 'Darbhanga', 'Samastipur'],
      growthPhases: ['Vegetative', 'Flowering']
    },
    trigger: 'auto',
    channels: ['push', 'sms', 'ivr'],
    language: 'Hindi',
    status: 'sent',
    sentAt: '2024-11-03T06:30:00',
    recipients: 245,
    delivered: 242,
    read: 198,
    actionTaken: 167,
    ignored: 31,
    followUpsSent: 25,
    createdBy: 'System Auto-Alert',
    createdAt: '2024-11-03T06:25:00'
  },
  {
    id: 'A002',
    type: 'advisory',
    title: 'Pest Alert: Brown Planthopper Detected',
    message: 'Brown planthopper activity increasing in paddy fields. Scout fields daily. Apply recommended pesticides if threshold exceeded (5 insects per plant).',
    reason: 'Field scouts reported 15% increase in pest sightings across 3 villages',
    recommendedTasks: ['Daily field scouting', 'Check pest threshold', 'Prepare pesticide if needed', 'Monitor neighbor fields'],
    expectedImpact: 'Early detection can prevent 20-30% yield loss',
    scope: {
      type: 'crop-specific',
      crops: ['Paddy', 'Rice'],
      villages: ['Madhubani', 'Begusarai']
    },
    trigger: 'manual',
    channels: ['push', 'sms', 'in-app'],
    language: 'Hindi',
    status: 'sent',
    sentAt: '2024-11-02T14:15:00',
    recipients: 189,
    delivered: 189,
    read: 156,
    actionTaken: 98,
    ignored: 58,
    followUpsSent: 45,
    createdBy: 'Officer Kumar',
    createdAt: '2024-11-02T14:10:00'
  },
  {
    id: 'A003',
    type: 'info',
    title: 'Rice MSP Increased - Harvest Planning Opportunity',
    message: 'Government announces ₹50/quintal MSP increase for paddy. Good time for harvest planning and market linkage preparation.',
    reason: 'Government policy update published in agricultural gazette',
    recommendedTasks: ['Plan harvest timing', 'Contact procurement centers', 'Arrange transportation', 'Check grain moisture levels'],
    expectedImpact: 'Potential additional income of ₹5,000-8,000 per acre',
    scope: {
      type: 'crop-specific',
      crops: ['Paddy', 'Rice'],
      growthPhases: ['Maturity', 'Harvest']
    },
    trigger: 'manual',
    channels: ['push', 'in-app'],
    language: 'Hindi',
    status: 'sent',
    sentAt: '2024-11-01T10:00:00',
    recipients: 420,
    delivered: 420,
    read: 387,
    actionTaken: 245,
    ignored: 142,
    followUpsSent: 0,
    createdBy: 'Officer Sharma',
    createdAt: '2024-11-01T09:45:00'
  }
];

const mockFarmerStatuses: FarmerAlertStatus[] = [
  {
    farmerId: 'F001',
    farmerName: 'Rajesh Kumar Singh',
    crop: 'Paddy',
    village: 'Madhubani',
    alertType: 'critical',
    delivered: true,
    read: true,
    actionTaken: true,
    followUpSent: false,
    deliveredAt: '2024-11-03T06:31:15',
    readAt: '2024-11-03T06:45:30',
    acknowledgedAt: '2024-11-03T08:20:00'
  },
  {
    farmerId: 'F002',
    farmerName: 'Sunita Devi',
    crop: 'Cotton',
    village: 'Purnia',
    alertType: 'critical',
    delivered: true,
    read: true,
    actionTaken: false,
    followUpSent: true,
    deliveredAt: '2024-11-03T06:31:20',
    readAt: '2024-11-03T07:15:00'
  },
  {
    farmerId: 'F003',
    farmerName: 'Amit Verma',
    crop: 'Wheat',
    village: 'Darbhanga',
    alertType: 'critical',
    delivered: true,
    read: false,
    actionTaken: false,
    followUpSent: true,
    deliveredAt: '2024-11-03T06:31:25'
  }
];

const mockChecklistAdjustments: ChecklistAdjustment[] = [
  {
    id: 'CA001',
    triggeredBy: 'Heavy Rainfall Warning',
    triggerType: 'weather',
    detectedAt: '2024-11-03T06:25:00',
    affectedFarmers: 245,
    affectedCrops: ['Paddy', 'Rice'],
    affectedVillages: ['Madhubani', 'Darbhanga', 'Samastipur'],
    status: 'pending',
    changes: {
      tasksToCancel: [
        { task: 'Fertilizer Application', reason: 'High rainfall will wash away nutrients' },
        { task: 'Irrigation Schedule', reason: 'Adequate water from rain' }
      ],
      tasksToAdd: [
        { task: 'Field Drainage Check', dueDate: '2024-11-03', reason: 'Prevent waterlogging' },
        { task: 'Equipment Protection', dueDate: '2024-11-03', reason: 'Protect from water damage' }
      ],
      tasksToReschedule: [
        { task: 'Fertilizer Application', from: '2024-11-03', to: '2024-11-08', reason: 'Wait for soil to dry after rain' }
      ]
    },
    expectedImpact: 'Expected harvest delay: +3 days. Potential damage prevented: ₹12,00,000',
    officerNotes: undefined,
    approvedBy: undefined,
    approvedAt: undefined
  },
  {
    id: 'CA002',
    triggeredBy: 'Brown Planthopper Outbreak',
    triggerType: 'pest',
    detectedAt: '2024-11-02T14:10:00',
    affectedFarmers: 189,
    affectedCrops: ['Paddy'],
    affectedVillages: ['Madhubani', 'Begusarai'],
    status: 'approved',
    changes: {
      tasksToCancel: [],
      tasksToAdd: [
        { task: 'Daily Pest Scouting', dueDate: '2024-11-03', reason: 'Monitor pest population' },
        { task: 'Pesticide Preparation', dueDate: '2024-11-04', reason: 'Be ready if threshold exceeded' }
      ],
      tasksToReschedule: []
    },
    expectedImpact: 'Early intervention can prevent 20-30% yield loss (₹8,00,000 saved)',
    officerNotes: 'Focus on paddy fields in vegetative stage',
    approvedBy: 'Officer Kumar',
    approvedAt: '2024-11-02T14:30:00'
  }
];

export default function Alerts() {
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = React.useState('create');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedAlert, setSelectedAlert] = React.useState<AlertData | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [selectedAdjustment, setSelectedAdjustment] = React.useState<ChecklistAdjustment | null>(null);
  
  // Alert form state
  const [alertType, setAlertType] = React.useState<'critical' | 'advisory' | 'info'>('advisory');
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertReason, setAlertReason] = React.useState('');
  const [recommendedTasks, setRecommendedTasks] = React.useState<string[]>(['']);
  const [expectedImpact, setExpectedImpact] = React.useState('');
  const [scopeType, setScopeType] = React.useState<'zone-wide' | 'village-specific' | 'crop-specific' | 'individual'>('zone-wide');
  const [selectedVillages, setSelectedVillages] = React.useState<string[]>([]);
  const [selectedCrops, setSelectedCrops] = React.useState<string[]>([]);
  const [selectedPhases, setSelectedPhases] = React.useState<string[]>([]);
  const [triggerMode, setTriggerMode] = React.useState<'manual' | 'auto' | 'scheduled'>('manual');
  const [selectedChannels, setSelectedChannels] = React.useState<('push' | 'sms' | 'in-app' | 'ivr')[]>(['push', 'sms']);
  const [selectedLanguage, setSelectedLanguage] = React.useState('Hindi');

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    const totalSent = mockAlerts.filter(a => a.status === 'sent').length;
    const redAlerts = mockAlerts.filter(a => a.type === 'critical' && a.status === 'sent').length;
    const yellowAlerts = mockAlerts.filter(a => a.type === 'advisory' && a.status === 'sent').length;
    const infoAlerts = mockAlerts.filter(a => a.type === 'info' && a.status === 'sent').length;
    
    const totalRead = mockAlerts.reduce((sum, a) => sum + a.read, 0);
    const totalRecipients = mockAlerts.reduce((sum, a) => sum + a.recipients, 0);
    const avgReadRate = totalRecipients > 0 ? Math.round((totalRead / totalRecipients) * 100) : 0;
    
    const totalActions = mockAlerts.reduce((sum, a) => sum + a.actionTaken, 0);
    const actionRate = totalRecipients > 0 ? Math.round((totalActions / totalRecipients) * 100) : 0;
    
    return {
      totalSent,
      redAlerts,
      yellowAlerts,
      infoAlerts,
      avgReadRate,
      actionRate,
      readTrend: 5, // Mock trend
      actionTrend: 8 // Mock trend
    };
  }, []);

  const handleSendAlert = async () => {
    try {
      // Validation
      if (!alertTitle || !alertMessage) {
        toast({ 
          title: "Validation Error", 
          description: "Title and message are required",
          variant: "destructive"
        });
        return;
      }

      // Mock API call
      await createAlert({
        title: alertTitle,
        message: alertMessage,
        place: selectedVillages.join(', '),
        intensity: alertType,
        color: alertType === 'critical' ? 'red' : alertType === 'advisory' ? 'yellow' : 'green'
      });

      toast({ 
        title: "Alert Sent Successfully", 
        description: `Alert sent to ${selectedVillages.length > 0 ? selectedVillages.length + ' villages' : 'all farmers'}` 
      });

      // Reset form
      setCurrentStep(1);
      setAlertTitle('');
      setAlertMessage('');
      setAlertReason('');
      setRecommendedTasks(['']);
      setExpectedImpact('');
      setShowPreview(false);
    } catch (err) {
      console.error(err);
      toast({ 
        title: "Failed to Send Alert", 
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleApproveAdjustment = (adjustmentId: string) => {
    toast({ 
      title: "Checklist Adjustment Approved", 
      description: "Changes will be pushed to affected farmers" 
    });
  };

  const handleRejectAdjustment = (adjustmentId: string) => {
    toast({ 
      title: "Checklist Adjustment Rejected", 
      description: "No changes will be made" 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Alert Management System</h1>
          <p className="text-muted-foreground">Create, broadcast, and track alerts with dynamic checklist adaptation</p>
        </div>

        {/* Summary Metrics Panel */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card className="p-4 border-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white font-bold">{summaryMetrics.totalSent}</Badge>
            </div>
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">Total Alerts Sent</p>
          </Card>

          <Card className="p-4 border-2 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertOctagon className="w-8 h-8 text-red-600" />
              <Badge className="bg-red-600 text-white font-bold">{summaryMetrics.redAlerts}</Badge>
            </div>
            <p className="text-xs font-bold text-red-900 uppercase tracking-wide">🔴 Red Alerts</p>
          </Card>

          <Card className="p-4 border-2 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <Badge className="bg-yellow-600 text-white font-bold">{summaryMetrics.yellowAlerts}</Badge>
            </div>
            <p className="text-xs font-bold text-yellow-900 uppercase tracking-wide">🟡 Yellow Alerts</p>
          </Card>

          <Card className="p-4 border-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Info className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-600 text-white font-bold">{summaryMetrics.infoAlerts}</Badge>
            </div>
            <p className="text-xs font-bold text-green-900 uppercase tracking-wide">🔵 Info Alerts</p>
          </Card>

          <Card className="p-4 border-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-purple-600" />
              <div className="flex items-center gap-1">
                <Badge className="bg-purple-600 text-white font-bold">{summaryMetrics.avgReadRate}%</Badge>
                {summaryMetrics.readTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
            <p className="text-xs font-bold text-purple-900 uppercase tracking-wide">Avg Read Rate</p>
          </Card>

          <Card className="p-4 border-2 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-teal-600" />
              <div className="flex items-center gap-1">
                <Badge className="bg-teal-600 text-white font-bold">{summaryMetrics.actionRate}%</Badge>
                {summaryMetrics.actionTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
            <p className="text-xs font-bold text-teal-900 uppercase tracking-wide">Action Rate</p>
          </Card>
        </div>

        {/* Main Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="create" className="text-base font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Create Alert
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-base font-semibold">
              <BarChart2 className="w-5 h-5 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-base font-semibold">
              <Target className="w-5 h-5 mr-2" />
              Dynamic Checklist
            </TabsTrigger>
          </TabsList>

          {/* CREATE ALERT TAB */}
          <TabsContent value="create" className="space-y-6">
            <CreateAlertWizard
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              alertType={alertType}
              setAlertType={setAlertType}
              alertTitle={alertTitle}
              setAlertTitle={setAlertTitle}
              alertMessage={alertMessage}
              setAlertMessage={setAlertMessage}
              alertReason={alertReason}
              setAlertReason={setAlertReason}
              recommendedTasks={recommendedTasks}
              setRecommendedTasks={setRecommendedTasks}
              expectedImpact={expectedImpact}
              setExpectedImpact={setExpectedImpact}
              scopeType={scopeType}
              setScopeType={setScopeType}
              selectedVillages={selectedVillages}
              setSelectedVillages={setSelectedVillages}
              selectedCrops={selectedCrops}
              setSelectedCrops={setSelectedCrops}
              selectedPhases={selectedPhases}
              setSelectedPhases={setSelectedPhases}
              triggerMode={triggerMode}
              setTriggerMode={setTriggerMode}
              selectedChannels={selectedChannels}
              setSelectedChannels={setSelectedChannels}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              handleSendAlert={handleSendAlert}
            />
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <AlertAnalytics
              alerts={mockAlerts}
              farmerStatuses={mockFarmerStatuses}
              selectedAlert={selectedAlert}
              setSelectedAlert={setSelectedAlert}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </TabsContent>

          {/* DYNAMIC CHECKLIST TAB */}
          <TabsContent value="checklist" className="space-y-6">
            <DynamicChecklistControl
              adjustments={mockChecklistAdjustments}
              selectedAdjustment={selectedAdjustment}
              setSelectedAdjustment={setSelectedAdjustment}
              handleApproveAdjustment={handleApproveAdjustment}
              handleRejectAdjustment={handleRejectAdjustment}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

// CREATE ALERT WIZARD COMPONENT
interface CreateAlertWizardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  alertType: 'critical' | 'advisory' | 'info';
  setAlertType: (type: 'critical' | 'advisory' | 'info') => void;
  alertTitle: string;
  setAlertTitle: (title: string) => void;
  alertMessage: string;
  setAlertMessage: (message: string) => void;
  alertReason: string;
  setAlertReason: (reason: string) => void;
  recommendedTasks: string[];
  setRecommendedTasks: (tasks: string[]) => void;
  expectedImpact: string;
  setExpectedImpact: (impact: string) => void;
  scopeType: 'zone-wide' | 'village-specific' | 'crop-specific' | 'individual';
  setScopeType: (type: 'zone-wide' | 'village-specific' | 'crop-specific' | 'individual') => void;
  selectedVillages: string[];
  setSelectedVillages: (villages: string[]) => void;
  selectedCrops: string[];
  setSelectedCrops: (crops: string[]) => void;
  selectedPhases: string[];
  setSelectedPhases: (phases: string[]) => void;
  triggerMode: 'manual' | 'auto' | 'scheduled';
  setTriggerMode: (mode: 'manual' | 'auto' | 'scheduled') => void;
  selectedChannels: ('push' | 'sms' | 'in-app' | 'ivr')[];
  setSelectedChannels: (channels: ('push' | 'sms' | 'in-app' | 'ivr')[]) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  handleSendAlert: () => void;
}

const CreateAlertWizard: React.FC<CreateAlertWizardProps> = (props) => {
  const villages = ['Madhubani', 'Darbhanga', 'Samastipur', 'Begusarai', 'Purnia', 'Saharsa'];
  const crops = ['Paddy', 'Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane'];
  const phases = ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvest'];
  const languages = ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'English'];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Panel - Wizard */}
      <div className="col-span-8">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-900">Alert Creation Wizard</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                      props.currentStep === step
                        ? "bg-blue-600 text-white"
                        : props.currentStep > step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {props.currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* STEP 1: Select Alert Type */}
            {props.currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Step 1: Select Alert Type</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card
                      className={cn(
                        "p-6 cursor-pointer transition-all border-2",
                        props.alertType === 'critical'
                          ? "border-red-500 bg-red-50 shadow-lg"
                          : "border-gray-200 hover:border-red-300 hover:shadow-md"
                      )}
                      onClick={() => props.setAlertType('critical')}
                    >
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto">
                          <AlertOctagon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-red-900">🔴 Red (Critical)</h4>
                        <p className="text-xs text-gray-600">Flood, cyclone, severe weather</p>
                      </div>
                    </Card>

                    <Card
                      className={cn(
                        "p-6 cursor-pointer transition-all border-2",
                        props.alertType === 'advisory'
                          ? "border-yellow-500 bg-yellow-50 shadow-lg"
                          : "border-gray-200 hover:border-yellow-300 hover:shadow-md"
                      )}
                      onClick={() => props.setAlertType('advisory')}
                    >
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mx-auto">
                          <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-yellow-900">🟡 Yellow (Advisory)</h4>
                        <p className="text-xs text-gray-600">Pest risk, irrigation advisory</p>
                      </div>
                    </Card>

                    <Card
                      className={cn(
                        "p-6 cursor-pointer transition-all border-2",
                        props.alertType === 'info'
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                      )}
                      onClick={() => props.setAlertType('info')}
                    >
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto">
                          <Info className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-blue-900">🔵 Info (General)</h4>
                        <p className="text-xs text-gray-600">Government updates, market news</p>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold"
                    onClick={() => props.setCurrentStep(2)}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Define Scope */}
            {props.currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Step 2: Define Scope</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Scope Type</label>
                      <Select value={props.scopeType} onValueChange={(value: any) => props.setScopeType(value)}>
                        <SelectTrigger className="border-2 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zone-wide">🌍 Zone-wide (All Farmers)</SelectItem>
                          <SelectItem value="village-specific">🏘️ Village-specific</SelectItem>
                          <SelectItem value="crop-specific">🌾 Crop-specific</SelectItem>
                          <SelectItem value="individual">👤 Individual Farmer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {props.scopeType === 'village-specific' && (
                      <div>
                        <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Select Villages</label>
                        <div className="grid grid-cols-3 gap-2">
                          {villages.map(village => (
                            <div key={village} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                              <Checkbox
                                checked={props.selectedVillages.includes(village)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    props.setSelectedVillages([...props.selectedVillages, village]);
                                  } else {
                                    props.setSelectedVillages(props.selectedVillages.filter(v => v !== village));
                                  }
                                }}
                              />
                              <label className="text-sm font-medium cursor-pointer">{village}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {props.scopeType === 'crop-specific' && (
                      <div>
                        <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Select Crops</label>
                        <div className="grid grid-cols-3 gap-2">
                          {crops.map(crop => (
                            <div key={crop} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                              <Checkbox
                                checked={props.selectedCrops.includes(crop)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    props.setSelectedCrops([...props.selectedCrops, crop]);
                                  } else {
                                    props.setSelectedCrops(props.selectedCrops.filter(c => c !== crop));
                                  }
                                }}
                              />
                              <label className="text-sm font-medium cursor-pointer">{crop}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Growth Phase Filters (Optional)</label>
                      <div className="grid grid-cols-5 gap-2">
                        {phases.map(phase => (
                          <div key={phase} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                            <Checkbox
                              checked={props.selectedPhases.includes(phase)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  props.setSelectedPhases([...props.selectedPhases, phase]);
                                } else {
                                  props.setSelectedPhases(props.selectedPhases.filter(p => p !== phase));
                                }
                              }}
                            />
                            <label className="text-xs font-medium cursor-pointer">{phase}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-2 font-semibold"
                    onClick={() => props.setCurrentStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold"
                    onClick={() => props.setCurrentStep(3)}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Build Alert Content */}
            {props.currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Step 3: Build Alert Content</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Alert Title</label>
                      <Input
                        placeholder="e.g., Heavy Rain Alert – Act Now"
                        value={props.alertTitle}
                        onChange={(e) => props.setAlertTitle(e.target.value)}
                        className="border-2 h-11 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Message Body</label>
                      <Textarea
                        placeholder="Detailed advisory and safety steps..."
                        value={props.alertMessage}
                        onChange={(e) => props.setAlertMessage(e.target.value)}
                        rows={5}
                        className="border-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Reason</label>
                      <Input
                        placeholder="e.g., IMD predicts 100mm rainfall"
                        value={props.alertReason}
                        onChange={(e) => props.setAlertReason(e.target.value)}
                        className="border-2 h-11 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Recommended Tasks</label>
                      {props.recommendedTasks.map((task, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            placeholder={`Task ${index + 1}...`}
                            value={task}
                            onChange={(e) => {
                              const newTasks = [...props.recommendedTasks];
                              newTasks[index] = e.target.value;
                              props.setRecommendedTasks(newTasks);
                            }}
                            className="border-2 h-10 font-medium"
                          />
                          {index === props.recommendedTasks.length - 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => props.setRecommendedTasks([...props.recommendedTasks, ''])}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Expected Impact</label>
                      <Input
                        placeholder="e.g., Prevents damage worth ₹50,000-80,000 per acre"
                        value={props.expectedImpact}
                        onChange={(e) => props.setExpectedImpact(e.target.value)}
                        className="border-2 h-11 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-2 font-semibold"
                    onClick={() => props.setCurrentStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold"
                    onClick={() => props.setCurrentStep(4)}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Trigger & Delivery */}
            {props.currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Step 4: Trigger & Delivery Options</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Trigger Mode</label>
                      <Select value={props.triggerMode} onValueChange={(value: any) => props.setTriggerMode(value)}>
                        <SelectTrigger className="border-2 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">✍️ Manual (Officer-created)</SelectItem>
                          <SelectItem value="auto">🤖 Auto-trigger (Threshold detection)</SelectItem>
                          <SelectItem value="scheduled">📅 Scheduled (Recurring)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Delivery Channels</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'push', label: '📱 Push Notification', icon: Bell },
                          { value: 'sms', label: '💬 SMS', icon: MessageSquare },
                          { value: 'in-app', label: '📲 In-App Banner', icon: Smartphone },
                          { value: 'ivr', label: '📞 IVR Voice Call', icon: PhoneCall }
                        ].map(channel => (
                          <div key={channel.value} className="flex items-center gap-2 p-3 border-2 rounded hover:bg-gray-50">
                            <Checkbox
                              checked={props.selectedChannels.includes(channel.value as any)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  props.setSelectedChannels([...props.selectedChannels, channel.value as any]);
                                } else {
                                  props.setSelectedChannels(props.selectedChannels.filter(c => c !== channel.value));
                                }
                              }}
                            />
                            <label className="text-sm font-medium cursor-pointer flex-1">{channel.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold mb-2 block text-gray-700 uppercase tracking-wide">Language</label>
                      <Select value={props.selectedLanguage} onValueChange={props.setSelectedLanguage}>
                        <SelectTrigger className="border-2 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang}>
                              <Languages className="w-4 h-4 inline mr-2" />
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-2 font-semibold"
                    onClick={() => props.setCurrentStep(3)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-2 font-semibold"
                      onClick={() => props.setShowPreview(true)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold shadow-lg"
                      onClick={props.handleSendAlert}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Alert
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Summary & Preview */}
      <div className="col-span-4">
        <Card className="border-2 shadow-lg sticky top-6">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2">
            <CardTitle className="text-base font-bold text-purple-900">Alert Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Alert Type</p>
              <Badge className={cn(
                "text-sm font-bold",
                props.alertType === 'critical' ? "bg-red-500 text-white" :
                props.alertType === 'advisory' ? "bg-yellow-500 text-white" :
                "bg-blue-500 text-white"
              )}>
                {props.alertType === 'critical' ? '🔴 Critical' : 
                 props.alertType === 'advisory' ? '🟡 Advisory' : '🔵 Info'}
              </Badge>
            </div>

            <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Scope</p>
              <p className="text-sm font-semibold text-gray-900">{props.scopeType.replace('-', ' ').toUpperCase()}</p>
              {props.selectedVillages.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">{props.selectedVillages.length} villages selected</p>
              )}
              {props.selectedCrops.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">{props.selectedCrops.length} crops selected</p>
              )}
            </div>

            <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Delivery Channels</p>
              <div className="flex flex-wrap gap-1">
                {props.selectedChannels.map(channel => (
                  <Badge key={channel} variant="secondary" className="text-xs">
                    {channel.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Language</p>
              <p className="text-sm font-semibold text-gray-900">{props.selectedLanguage}</p>
            </div>

            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
              <p className="text-xs font-bold text-blue-900 mb-2 uppercase">💡 Estimated Reach</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Recipients:</span>
                  <span className="font-bold text-blue-900">~{props.selectedVillages.length * 50 || 500}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">SMS Cost:</span>
                  <span className="font-bold text-blue-900">₹{props.selectedChannels.includes('sms') ? (props.selectedVillages.length * 50 || 500) * 0.25 : 0}</span>
                </div>
              </div>
            </div>

            {props.showPreview && (
              <div className="p-4 bg-white rounded-lg border-2 border-green-300 shadow-md">
                <p className="text-xs font-bold text-green-900 mb-3 uppercase">📱 Preview</p>
                <div className="space-y-2 p-3 bg-gray-50 rounded">
                  <p className="font-bold text-sm text-gray-900">{props.alertTitle || 'Alert Title'}</p>
                  <p className="text-xs text-gray-700">{props.alertMessage || 'Alert message will appear here...'}</p>
                  {props.recommendedTasks.filter(t => t).length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-bold text-gray-700">Recommended Actions:</p>
                      <ul className="text-xs text-gray-600 mt-1 space-y-1">
                        {props.recommendedTasks.filter(t => t).map((task, i) => (
                          <li key={i}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ==================== ALERT ANALYTICS COMPONENT ====================

interface AlertAnalyticsProps {
  alerts: AlertData[];
  farmerStatuses: FarmerAlertStatus[];
  selectedAlert: AlertData | null;
  setSelectedAlert: (alert: AlertData | null) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const AlertAnalytics: React.FC<AlertAnalyticsProps> = (props) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left - Alert List */}
      <div className="col-span-4">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-green-900">Sent Alerts</CardTitle>
              <Select value={props.filterStatus} onValueChange={props.setFilterStatus}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="advisory">Advisory</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {props.alerts
                .filter(a => props.filterStatus === 'all' || a.type === props.filterStatus)
                .map(alert => (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-4 border-b cursor-pointer transition-all hover:bg-gray-50",
                      props.selectedAlert?.id === alert.id && "bg-blue-50 border-l-4 border-l-blue-500"
                    )}
                    onClick={() => props.setSelectedAlert(alert)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={cn(
                        "text-xs font-bold",
                        alert.type === 'critical' ? "bg-red-500 text-white" :
                        alert.type === 'advisory' ? "bg-yellow-500 text-white" :
                        "bg-blue-500 text-white"
                      )}>
                        {alert.type === 'critical' ? '🔴' : alert.type === 'advisory' ? '🟡' : '🔵'}
                      </Badge>
                      <span className="text-xs text-gray-500">{new Date(alert.sentAt || '').toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">{alert.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{alert.message}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-1 bg-gray-100 rounded">
                        <p className="font-bold text-gray-900">{alert.delivered}</p>
                        <p className="text-gray-600">Sent</p>
                      </div>
                      <div className="text-center p-1 bg-green-100 rounded">
                        <p className="font-bold text-green-900">{alert.read}</p>
                        <p className="text-green-700">Read</p>
                      </div>
                      <div className="text-center p-1 bg-blue-100 rounded">
                        <p className="font-bold text-blue-900">{alert.actionTaken}</p>
                        <p className="text-blue-700">Action</p>
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Middle - Performance Analytics */}
      <div className="col-span-5">
        {props.selectedAlert ? (
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2">
              <CardTitle className="text-base font-bold text-blue-900">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-5 gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 text-center">
                  <Send className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-900">{props.selectedAlert.delivered}</p>
                  <p className="text-xs font-semibold text-blue-700">Sent</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 text-center">
                  <Eye className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-900">{props.selectedAlert.read}</p>
                  <p className="text-xs font-semibold text-green-700">Read</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 text-center">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-purple-900">{props.selectedAlert.actionTaken}</p>
                  <p className="text-xs font-semibold text-purple-700">Action</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-200 text-center">
                  <XCircle className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-orange-900">{props.selectedAlert.ignored}</p>
                  <p className="text-xs font-semibold text-orange-700">Ignored</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2 border-gray-200 text-center">
                  <RefreshCw className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">{props.selectedAlert.followUpsSent}</p>
                  <p className="text-xs font-semibold text-gray-700">Follow-ups</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Read Rate</span>
                    <span className="font-bold text-green-700">
                      {Math.round((props.selectedAlert.read / props.selectedAlert.delivered) * 100)}%
                    </span>
                  </div>
                  <Progress value={(props.selectedAlert.read / props.selectedAlert.delivered) * 100} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Action Rate</span>
                    <span className="font-bold text-purple-700">
                      {Math.round((props.selectedAlert.actionTaken / props.selectedAlert.delivered) * 100)}%
                    </span>
                  </div>
                  <Progress value={(props.selectedAlert.actionTaken / props.selectedAlert.delivered) * 100} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Ignored Rate</span>
                    <span className="font-bold text-orange-700">
                      {Math.round((props.selectedAlert.ignored / props.selectedAlert.delivered) * 100)}%
                    </span>
                  </div>
                  <Progress value={(props.selectedAlert.ignored / props.selectedAlert.delivered) * 100} className="h-3" />
                </div>
              </div>

              {/* Mock Chart Visualization */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2">
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase">📊 Engagement Timeline</p>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[30, 45, 60, 75, 85, 90, 82].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-600">D{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Assessment */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <p className="text-sm font-bold text-green-900 mb-2 uppercase">✅ Impact Assessment</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Success Rate:</span>
                    <span className="font-bold text-green-700">
                      {Math.round((props.selectedAlert.actionTaken / props.selectedAlert.delivered) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Est. Damage Prevented:</span>
                    <span className="font-bold text-green-700">₹{(props.selectedAlert.actionTaken * 2500).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Farmers Helped:</span>
                    <span className="font-bold text-green-700">{props.selectedAlert.actionTaken} farmers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 shadow-lg">
            <CardContent className="p-12 text-center">
              <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">Select an alert to view analytics</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right - Farmer Status Table */}
      <div className="col-span-3">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2">
            <CardTitle className="text-base font-bold text-purple-900">Farmer Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-100 border-b-2">
                  <tr>
                    <th className="text-left p-2 font-bold text-gray-700">Farmer</th>
                    <th className="text-center p-2 font-bold text-gray-700">Status</th>
                    <th className="text-center p-2 font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {props.farmerStatuses.map(farmer => (
                    <tr key={farmer.farmerId} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <p className="font-semibold text-gray-900">{farmer.farmerName}</p>
                        <p className="text-gray-500">{farmer.village}</p>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex flex-col gap-1">
                          {farmer.delivered && <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />}
                          {farmer.read && <Eye className="w-4 h-4 text-blue-600 mx-auto" />}
                          {farmer.actionTaken && <CheckCircle2 className="w-4 h-4 text-purple-600 mx-auto" />}
                          {!farmer.read && farmer.delivered && <Clock className="w-4 h-4 text-orange-600 mx-auto" />}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        {!farmer.actionTaken && farmer.delivered && (
                          <div className="flex flex-col gap-1">
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              SMS
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ==================== DYNAMIC CHECKLIST CONTROL COMPONENT ====================

interface DynamicChecklistControlProps {
  adjustments: ChecklistAdjustment[];
  selectedAdjustment: ChecklistAdjustment | null;
  setSelectedAdjustment: (adj: ChecklistAdjustment | null) => void;
  handleApproveAdjustment: (id: string) => void;
  handleRejectAdjustment: (id: string) => void;
}

const DynamicChecklistControl: React.FC<DynamicChecklistControlProps> = (props) => {
  const [officerNotes, setOfficerNotes] = React.useState('');

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left - Adjustment List */}
      <div className="col-span-4">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2">
            <CardTitle className="text-base font-bold text-orange-900">Detected Triggers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {props.adjustments.map(adj => (
                <div
                  key={adj.id}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-all hover:bg-gray-50",
                    props.selectedAdjustment?.id === adj.id && "bg-orange-50 border-l-4 border-l-orange-500"
                  )}
                  onClick={() => props.setSelectedAdjustment(adj)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={cn(
                      "text-xs font-bold",
                      adj.triggerType === 'weather' ? "bg-blue-500 text-white" :
                      adj.triggerType === 'pest' ? "bg-red-500 text-white" :
                      "bg-green-500 text-white"
                    )}>
                      {adj.triggerType.toUpperCase()}
                    </Badge>
                    <Badge className={cn(
                      "text-xs",
                      adj.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                      adj.status === 'approved' ? "bg-green-100 text-green-700" :
                      adj.status === 'rejected' ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {adj.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{adj.triggeredBy}</h4>
                  <p className="text-xs text-gray-600 mb-2">{new Date(adj.detectedAt).toLocaleString()}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-1 bg-blue-100 rounded">
                      <p className="font-bold text-blue-900">{adj.affectedFarmers}</p>
                      <p className="text-blue-700">Farmers</p>
                    </div>
                    <div className="text-center p-1 bg-green-100 rounded">
                      <p className="font-bold text-green-900">{adj.affectedVillages.length}</p>
                      <p className="text-green-700">Villages</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Middle & Right - Adjustment Details */}
      {props.selectedAdjustment ? (
        <>
          <div className="col-span-5">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2">
                <CardTitle className="text-base font-bold text-blue-900">Proposed Changes</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Tasks to Cancel */}
                {props.selectedAdjustment.changes.tasksToCancel.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <p className="text-sm font-bold text-red-900 mb-3 uppercase">❌ Tasks to Cancel</p>
                    {props.selectedAdjustment.changes.tasksToCancel.map((task, i) => (
                      <div key={i} className="mb-2 p-2 bg-white rounded border">
                        <p className="text-sm font-semibold text-gray-900">{task.task}</p>
                        <p className="text-xs text-gray-600 mt-1">Reason: {task.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tasks to Add */}
                {props.selectedAdjustment.changes.tasksToAdd.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm font-bold text-green-900 mb-3 uppercase">✅ Tasks to Add</p>
                    {props.selectedAdjustment.changes.tasksToAdd.map((task, i) => (
                      <div key={i} className="mb-2 p-2 bg-white rounded border">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-gray-900">{task.task}</p>
                          <Badge className="text-xs bg-green-100 text-green-700">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">Reason: {task.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tasks to Reschedule */}
                {props.selectedAdjustment.changes.tasksToReschedule.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <p className="text-sm font-bold text-yellow-900 mb-3 uppercase">📅 Tasks to Reschedule</p>
                    {props.selectedAdjustment.changes.tasksToReschedule.map((task, i) => (
                      <div key={i} className="mb-2 p-2 bg-white rounded border">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{task.task}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <span className="line-through">{new Date(task.from).toLocaleDateString()}</span>
                          <span>→</span>
                          <span className="font-bold text-blue-700">{new Date(task.to).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-600">Reason: {task.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Expected Impact */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm font-bold text-purple-900 mb-2 uppercase">💡 Expected Impact</p>
                  <p className="text-sm text-gray-700">{props.selectedAdjustment.expectedImpact}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2">
                <CardTitle className="text-base font-bold text-purple-900">Officer Review</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2">
                  <p className="text-xs font-bold text-gray-700 mb-2 uppercase">Affected Scope</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Farmers:</span>
                      <span className="font-bold text-gray-900">{props.selectedAdjustment.affectedFarmers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Villages:</span>
                      <span className="font-bold text-gray-900">{props.selectedAdjustment.affectedVillages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crops:</span>
                      <span className="font-bold text-gray-900">{props.selectedAdjustment.affectedCrops.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge className="w-full justify-center py-2 text-xs font-bold bg-blue-100 text-blue-700">
                    Villages: {props.selectedAdjustment.affectedVillages.join(', ')}
                  </Badge>
                  <Badge className="w-full justify-center py-2 text-xs font-bold bg-green-100 text-green-700">
                    Crops: {props.selectedAdjustment.affectedCrops.join(', ')}
                  </Badge>
                </div>

                <div>
                  <label className="text-xs font-bold mb-2 block text-gray-700 uppercase">Officer Notes</label>
                  <Textarea
                    placeholder="Add notes or modifications..."
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    rows={4}
                    className="border-2 text-sm"
                  />
                </div>

                {props.selectedAdjustment.status === 'pending' && (
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold"
                      onClick={() => props.handleApproveAdjustment(props.selectedAdjustment!.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve & Push to Farmers
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 font-bold"
                      onClick={() => props.handleRejectAdjustment(props.selectedAdjustment!.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Changes
                    </Button>
                  </div>
                )}

                {props.selectedAdjustment.status === 'approved' && (
                  <div className="p-3 bg-green-100 rounded-lg border-2 border-green-300 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-green-900">Approved & Applied</p>
                    <p className="text-xs text-green-700 mt-1">
                      by {props.selectedAdjustment.approvedBy}<br />
                      on {new Date(props.selectedAdjustment.approvedAt || '').toLocaleString()}
                    </p>
                  </div>
                )}

                {props.selectedAdjustment.status === 'rejected' && (
                  <div className="p-3 bg-red-100 rounded-lg border-2 border-red-300 text-center">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-red-900">Rejected</p>
                    <p className="text-xs text-red-700 mt-1">Changes were not applied</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="col-span-8">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">Select a trigger to review proposed checklist changes</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
