// src/components/consultation/ConsultationTab.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Printer, Save, Loader2 } from 'lucide-react';
import { OpdVisit } from '@/types/opdVisit.types';
import { toast } from 'sonner';
import { useOPDTemplate } from '@/hooks/useOPDTemplate';

interface ConsultationTabProps {
  visit: OpdVisit;
}

export const ConsultationTab: React.FC<ConsultationTabProps> = ({ visit }) => {
  const { useTemplateGroups } = useOPDTemplate();
  const [mode, setMode] = useState<'entry' | 'preview'>('entry');
  const [selectedTemplateGroup, setSelectedTemplateGroup] = useState<string>('');

  // Fetch template groups
  const { data: groupsData, isLoading: isLoadingGroups } = useTemplateGroups({
    show_inactive: false,
    ordering: 'display_order',
  });

  // Chief Complaint State
  const [chiefComplaint, setChiefComplaint] = useState({
    site: [] as string[],
    type: [] as string[],
    duration: '',
    radiation: false,
    radiationDetails: '',
    aggravatedOn: [] as string[],
    relievedOn: [] as string[],
    tingling: false,
    numbness: false,
    burning: false,
    weakness: false,
    ems: false,
    associatedFeatures: '',
  });

  // Medical History State
  const [medicalHistory, setMedicalHistory] = useState({
    dm: false,
    htn: false,
    tb: false,
    thyroid: false,
    allergies: false,
    allergiesDetails: '',
    addiction: false,
    addictionDetails: '',
    occupation: '',
    diet: '',
  });

  // Examination State
  const [examination, setExamination] = useState({
    lsSpine: {
      side: 'bilateral' as 'left' | 'right' | 'bilateral',
      rom: '',
      tenderness: '',
      slr: '',
      other: '',
    },
    cSpine: {
      side: 'bilateral' as 'left' | 'right' | 'bilateral',
      rom: '',
      tenderness: '',
      other: '',
    },
    knee: {
      side: 'bilateral' as 'left' | 'right' | 'bilateral',
      rom: '',
      tenderness: '',
      swelling: '',
      stability: '',
      other: '',
    },
    shoulder: {
      side: 'bilateral' as 'left' | 'right' | 'bilateral',
      rom: '',
      tenderness: '',
      impingement: '',
      other: '',
    },
  });

  // Diagnosis & Treatment
  const [diagnosis, setDiagnosis] = useState(visit.diagnosis || '');
  const [treatmentPlan, setTreatmentPlan] = useState(visit.treatment_plan || '');
  const [prescription, setPrescription] = useState(visit.prescription || '');
  const [additionalNotes, setAdditionalNotes] = useState(visit.notes || '');

  const handleSave = () => {
    // TODO: Implement save functionality with API call
    toast.success('Consultation saved successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleChiefComplaintArray = (field: 'site' | 'type' | 'aggravatedOn' | 'relievedOn', value: string) => {
    setChiefComplaint(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  if (mode === 'preview') {
    return (
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMode('entry')}>
              <FileText className="h-4 w-4 mr-2" />
              Edit Mode
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Documentation - Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chief Complaint Preview */}
            <div>
              <h3 className="font-semibold mb-2">Chief Complaint (C/O Pain)</h3>
              <div className="space-y-1 text-sm">
                {chiefComplaint.site.length > 0 && (
                  <p><strong>Site:</strong> {chiefComplaint.site.join(', ')}</p>
                )}
                {chiefComplaint.type.length > 0 && (
                  <p><strong>Type:</strong> {chiefComplaint.type.join(', ')}</p>
                )}
                {chiefComplaint.duration && (
                  <p><strong>Duration:</strong> {chiefComplaint.duration}</p>
                )}
                {chiefComplaint.radiation && (
                  <p><strong>Radiation:</strong> {chiefComplaint.radiationDetails || 'Yes'}</p>
                )}
                {chiefComplaint.aggravatedOn.length > 0 && (
                  <p><strong>Aggravated on:</strong> {chiefComplaint.aggravatedOn.join(', ')}</p>
                )}
                {chiefComplaint.relievedOn.length > 0 && (
                  <p><strong>Relieved on:</strong> {chiefComplaint.relievedOn.join(', ')}</p>
                )}
                {chiefComplaint.associatedFeatures && (
                  <p><strong>Associated Features:</strong> {chiefComplaint.associatedFeatures}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Medical History Preview */}
            <div>
              <h3 className="font-semibold mb-2">Past Medical History</h3>
              <div className="flex flex-wrap gap-2">
                {medicalHistory.dm && <Badge>DM</Badge>}
                {medicalHistory.htn && <Badge>HTN</Badge>}
                {medicalHistory.tb && <Badge>TB</Badge>}
                {medicalHistory.thyroid && <Badge>Thyroid</Badge>}
                {medicalHistory.allergies && <Badge>Allergies: {medicalHistory.allergiesDetails}</Badge>}
                {medicalHistory.addiction && <Badge>Addiction: {medicalHistory.addictionDetails}</Badge>}
              </div>
              {medicalHistory.occupation && (
                <p className="text-sm mt-2"><strong>Occupation:</strong> {medicalHistory.occupation}</p>
              )}
              {medicalHistory.diet && (
                <p className="text-sm"><strong>Diet:</strong> {medicalHistory.diet}</p>
              )}
            </div>

            <Separator />

            {/* Diagnosis & Treatment Preview */}
            <div>
              <h3 className="font-semibold mb-2">Diagnosis</h3>
              <p className="text-sm">{diagnosis || 'Not recorded'}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Treatment Plan</h3>
              <p className="text-sm whitespace-pre-wrap">{treatmentPlan || 'Not recorded'}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Prescription</h3>
              <p className="text-sm whitespace-pre-wrap">{prescription || 'Not recorded'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Template Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="template-group">Template Group</Label>
            <Select
              value={selectedTemplateGroup}
              onValueChange={setSelectedTemplateGroup}
              disabled={isLoadingGroups}
            >
              <SelectTrigger id="template-group" className="w-full">
                <SelectValue placeholder={isLoadingGroups ? "Loading template groups..." : "Select a template group"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingGroups ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : groupsData?.results && groupsData.results.length > 0 ? (
                  groupsData.results.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                      {group.description && (
                        <span className="text-xs text-muted-foreground ml-2">
                          - {group.description}
                        </span>
                      )}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No template groups available
                  </div>
                )}
              </SelectContent>
            </Select>
            {selectedTemplateGroup && (
              <p className="text-sm text-muted-foreground">
                Selected: {groupsData?.results.find(g => g.id.toString() === selectedTemplateGroup)?.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMode('preview')}>
            <FileText className="h-4 w-4 mr-2" />
            Preview Mode
          </Button>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Consultation
        </Button>
      </div>

      {/* Chief Complaint Section */}
      <Card>
        <CardHeader>
          <CardTitle>Chief Complaint (C/O Pain)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Site */}
          <div className="space-y-2">
            <Label>Site</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Neck', 'Lower Back', 'Upper Back', 'Shoulder', 'Knee', 'Hip', 'Ankle', 'Wrist'].map(site => (
                <div key={site} className="flex items-center space-x-2">
                  <Checkbox
                    id={`site-${site}`}
                    checked={chiefComplaint.site.includes(site)}
                    onCheckedChange={() => toggleChiefComplaintArray('site', site)}
                  />
                  <label htmlFor={`site-${site}`} className="text-sm cursor-pointer">
                    {site}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Sharp', 'Dull', 'Aching', 'Burning', 'Throbbing', 'Shooting', 'Stabbing', 'Radiating'].map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={chiefComplaint.type.includes(type)}
                    onCheckedChange={() => toggleChiefComplaintArray('type', type)}
                  />
                  <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g., 2 weeks, 3 months"
              value={chiefComplaint.duration}
              onChange={(e) => setChiefComplaint(prev => ({ ...prev, duration: e.target.value }))}
            />
          </div>

          {/* Radiation */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="radiation"
                checked={chiefComplaint.radiation}
                onCheckedChange={(checked) => setChiefComplaint(prev => ({ ...prev, radiation: checked as boolean }))}
              />
              <Label htmlFor="radiation" className="cursor-pointer">Radiation</Label>
            </div>
            {chiefComplaint.radiation && (
              <Input
                placeholder="Describe radiation pattern"
                value={chiefComplaint.radiationDetails}
                onChange={(e) => setChiefComplaint(prev => ({ ...prev, radiationDetails: e.target.value }))}
              />
            )}
          </div>

          {/* Aggravated On */}
          <div className="space-y-2">
            <Label>Aggravated On</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Walking', 'Standing', 'Sitting', 'Lying down', 'Bending', 'Lifting'].map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`aggravated-${item}`}
                    checked={chiefComplaint.aggravatedOn.includes(item)}
                    onCheckedChange={() => toggleChiefComplaintArray('aggravatedOn', item)}
                  />
                  <label htmlFor={`aggravated-${item}`} className="text-sm cursor-pointer">
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Relieved On */}
          <div className="space-y-2">
            <Label>Relieved On</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Rest', 'Ice', 'Heat', 'Medication', 'Massage', 'Exercise'].map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`relieved-${item}`}
                    checked={chiefComplaint.relievedOn.includes(item)}
                    onCheckedChange={() => toggleChiefComplaintArray('relievedOn', item)}
                  />
                  <label htmlFor={`relieved-${item}`} className="text-sm cursor-pointer">
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Symptoms */}
          <div className="space-y-2">
            <Label>Associated Symptoms</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tingling"
                  checked={chiefComplaint.tingling}
                  onCheckedChange={(checked) => setChiefComplaint(prev => ({ ...prev, tingling: checked as boolean }))}
                />
                <label htmlFor="tingling" className="text-sm cursor-pointer">Tingling</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbness"
                  checked={chiefComplaint.numbness}
                  onCheckedChange={(checked) => setChiefComplaint(prev => ({ ...prev, numbness: checked as boolean }))}
                />
                <label htmlFor="numbness" className="text-sm cursor-pointer">Numbness</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="burning"
                  checked={chiefComplaint.burning}
                  onCheckedChange={(checked) => setChiefComplaint(prev => ({ ...prev, burning: checked as boolean }))}
                />
                <label htmlFor="burning" className="text-sm cursor-pointer">Burning</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weakness"
                  checked={chiefComplaint.weakness}
                  onCheckedChange={(checked) => setChiefComplaint(prev => ({ ...prev, weakness: checked as boolean }))}
                />
                <label htmlFor="weakness" className="text-sm cursor-pointer">Weakness</label>
              </div>
            </div>
          </div>

          {/* Associated Features */}
          <div className="space-y-2">
            <Label htmlFor="associated-features">Other Associated Features</Label>
            <Textarea
              id="associated-features"
              placeholder="Describe other associated features..."
              value={chiefComplaint.associatedFeatures}
              onChange={(e) => setChiefComplaint(prev => ({ ...prev, associatedFeatures: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Past Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Past Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dm"
                checked={medicalHistory.dm}
                onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, dm: checked as boolean }))}
              />
              <label htmlFor="dm" className="text-sm cursor-pointer">Diabetes Mellitus</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="htn"
                checked={medicalHistory.htn}
                onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, htn: checked as boolean }))}
              />
              <label htmlFor="htn" className="text-sm cursor-pointer">Hypertension</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tb"
                checked={medicalHistory.tb}
                onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, tb: checked as boolean }))}
              />
              <label htmlFor="tb" className="text-sm cursor-pointer">Tuberculosis</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="thyroid"
                checked={medicalHistory.thyroid}
                onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, thyroid: checked as boolean }))}
              />
              <label htmlFor="thyroid" className="text-sm cursor-pointer">Thyroid</label>
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allergies"
                checked={medicalHistory.allergies}
                onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, allergies: checked as boolean }))}
              />
              <Label htmlFor="allergies" className="cursor-pointer">Allergies</Label>
            </div>
            {medicalHistory.allergies && (
              <Input
                placeholder="Specify allergies..."
                value={medicalHistory.allergiesDetails}
                onChange={(e) => setMedicalHistory(prev => ({ ...prev, allergiesDetails: e.target.value }))}
              />
            )}
          </div>

          {/* Addiction */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addiction"
                checked={medicalHistory.addiction}
                onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, addiction: checked as boolean }))}
              />
              <Label htmlFor="addiction" className="cursor-pointer">Addiction</Label>
            </div>
            {medicalHistory.addiction && (
              <Input
                placeholder="Specify addiction (smoking, alcohol, etc.)..."
                value={medicalHistory.addictionDetails}
                onChange={(e) => setMedicalHistory(prev => ({ ...prev, addictionDetails: e.target.value }))}
              />
            )}
          </div>

          {/* Occupation & Diet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                placeholder="Patient's occupation"
                value={medicalHistory.occupation}
                onChange={(e) => setMedicalHistory(prev => ({ ...prev, occupation: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diet">Diet</Label>
              <Input
                id="diet"
                placeholder="Vegetarian, Non-vegetarian, etc."
                value={medicalHistory.diet}
                onChange={(e) => setMedicalHistory(prev => ({ ...prev, diet: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Examination - L/S Spine */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Examination - Lumbar/Sacral Spine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Side</Label>
            <RadioGroup
              value={examination.lsSpine.side}
              onValueChange={(value) => setExamination(prev => ({
                ...prev,
                lsSpine: { ...prev.lsSpine, side: value as 'left' | 'right' | 'bilateral' }
              }))}
            >
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="ls-left" />
                  <Label htmlFor="ls-left" className="cursor-pointer">Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="ls-right" />
                  <Label htmlFor="ls-right" className="cursor-pointer">Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bilateral" id="ls-bilateral" />
                  <Label htmlFor="ls-bilateral" className="cursor-pointer">Bilateral</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ls-rom">Range of Motion</Label>
              <Textarea id="ls-rom" placeholder="ROM findings..." value={examination.lsSpine.rom} onChange={(e) => setExamination(prev => ({ ...prev, lsSpine: { ...prev.lsSpine, rom: e.target.value } }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ls-tenderness">Tenderness</Label>
              <Textarea id="ls-tenderness" placeholder="Tenderness findings..." value={examination.lsSpine.tenderness} onChange={(e) => setExamination(prev => ({ ...prev, lsSpine: { ...prev.lsSpine, tenderness: e.target.value } }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ls-slr">SLR Test</Label>
              <Input id="ls-slr" placeholder="SLR test results..." value={examination.lsSpine.slr} onChange={(e) => setExamination(prev => ({ ...prev, lsSpine: { ...prev.lsSpine, slr: e.target.value } }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ls-other">Other Findings</Label>
              <Input id="ls-other" placeholder="Other findings..." value={examination.lsSpine.other} onChange={(e) => setExamination(prev => ({ ...prev, lsSpine: { ...prev.lsSpine, other: e.target.value } }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis & Treatment Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnosis & Treatment Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment-plan">Treatment Plan</Label>
            <Textarea
              id="treatment-plan"
              placeholder="Enter treatment plan..."
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescription">Prescription</Label>
            <Textarea
              id="prescription"
              placeholder="Enter prescription..."
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-notes">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              placeholder="Any additional notes..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
