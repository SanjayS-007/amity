// This file contains the Analytics and DynamicChecklistControl components
// Import this into Alerts.tsx or integrate directly

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Eye, CheckCircle, XCircle, Phone, MessageSquare, RefreshCw,
  BarChart2, PieChart, LineChart, AlertTriangle, CheckCircle2,
  TrendingUp, AlertOctagon, Info, Users, Map, Calendar, Edit,
  Trash2, Download, Filter, Target, Zap, Clock, Send
} from "lucide-react";

// ALERT ANALYTICS COMPONENT
interface AlertAnalyticsProps {
  alerts: any[];
  farmerStatuses: any[];
  selectedAlert: any | null;
  setSelectedAlert: (alert: any) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export const AlertAnalytics: React.FC<AlertAnalyticsProps> = (props) => {
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

// DYNAMIC CHECKLIST CONTROL COMPONENT
interface DynamicChecklistControlProps {
  adjustments: any[];
  selectedAdjustment: any | null;
  setSelectedAdjustment: (adj: any) => void;
  handleApproveAdjustment: (id: string) => void;
  handleRejectAdjustment: (id: string) => void;
}

export const DynamicChecklistControl: React.FC<DynamicChecklistControlProps> = (props) => {
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
                    {props.selectedAdjustment.changes.tasksToCancel.map((task: any, i: number) => (
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
                    {props.selectedAdjustment.changes.tasksToAdd.map((task: any, i: number) => (
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
                    {props.selectedAdjustment.changes.tasksToReschedule.map((task: any, i: number) => (
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
                      onClick={() => props.handleApproveAdjustment(props.selectedAdjustment.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve & Push to Farmers
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 font-bold"
                      onClick={() => props.handleRejectAdjustment(props.selectedAdjustment.id)}
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
                      on {new Date(props.selectedAdjustment.approvedAt).toLocaleString()}
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
