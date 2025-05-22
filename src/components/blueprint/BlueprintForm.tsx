import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  BookOpen, 
  Save,
  Loader2,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface GeneratedBlueprint {
  topicName: string;
  questionCount: number;
  experienceLevel: string;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  questionDistribution: Array<{
    difficulty: string;
    count: number;
  }>;
}

const BlueprintForm = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<GeneratedBlueprint | null>(null);
  const [formData, setFormData] = useState({
    topicName: '',
    questionCount: 10,
    experienceLevel: 'intermediate',
    difficultyDistribution: {
      easy: 33,
      medium: 34,
      hard: 33,
    }
  });

  // Calculate total difficulty percentage
  const totalDifficultyPercentage = 
    formData.difficultyDistribution.easy + 
    formData.difficultyDistribution.medium + 
    formData.difficultyDistribution.hard;
    
  const [isValidTotal, setIsValidTotal] = useState(true);
  
  useEffect(() => {
    setIsValidTotal(totalDifficultyPercentage === 100);
  }, [totalDifficultyPercentage]);

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard', value: number) => {
    setFormData(prev => ({
      ...prev,
      difficultyDistribution: {
        ...prev.difficultyDistribution,
        [level]: value,
      }
    }));
  };

  const generateBlueprint = () => {
    const { questionCount, difficultyDistribution } = formData;
    
    // Calculate question counts for each difficulty level
    const easyCount = Math.round((difficultyDistribution.easy / 100) * questionCount);
    const mediumCount = Math.round((difficultyDistribution.medium / 100) * questionCount);
    const hardCount = Math.round((difficultyDistribution.hard / 100) * questionCount);
    
    // Adjust for rounding errors to match total question count
    const total = easyCount + mediumCount + hardCount;
    const diff = questionCount - total;
    
    // Create the blueprint structure
    const blueprint: GeneratedBlueprint = {
      topicName: formData.topicName,
      questionCount: questionCount,
      experienceLevel: formData.experienceLevel,
      difficultyBreakdown: {
        easy: difficultyDistribution.easy,
        medium: difficultyDistribution.medium,
        hard: difficultyDistribution.hard,
      },
      questionDistribution: [
        { difficulty: 'Easy', count: easyCount + (diff > 0 ? diff : 0) },
        { difficulty: 'Medium', count: mediumCount },
        { difficulty: 'Hard', count: hardCount }
      ]
    };

    return blueprint;
  };

  const downloadBlueprint = () => {
    if (!generatedBlueprint) return;

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for the worksheet with better spacing
    const wsData = [
      ['Assessment Blueprint'],
      [],  // Empty row after title
      [],  // Additional spacing
      ['Basic Information'],
      [],  // Empty row after section header
      ['Topic:', generatedBlueprint.topicName],
      ['Total Questions:', generatedBlueprint.questionCount],
      ['Experience Level:', generatedBlueprint.experienceLevel.charAt(0).toUpperCase() + generatedBlueprint.experienceLevel.slice(1)],
      [],  // Empty row after basic info
      [],  // Additional spacing
      ['Difficulty Distribution'],
      [],  // Empty row after section header
      ['Level', 'Percentage', 'Question Count'],
      ['Easy', `${generatedBlueprint.difficultyBreakdown.easy}%`, generatedBlueprint.questionDistribution[0].count],
      ['Medium', `${generatedBlueprint.difficultyBreakdown.medium}%`, generatedBlueprint.questionDistribution[1].count],
      ['Hard', `${generatedBlueprint.difficultyBreakdown.hard}%`, generatedBlueprint.questionDistribution[2].count],
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add styling to headers
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },  // Merge cells for main title
      { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },  // Merge cells for "Basic Information"
      { s: { r: 10, c: 0 }, e: { r: 10, c: 2 } }, // Merge cells for "Difficulty Distribution"
    ];

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // First column
      { wch: 15 }, // Second column
      { wch: 15 }, // Third column
    ];

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Blueprint');

    // Generate Excel file
    XLSX.writeFile(wb, `${generatedBlueprint.topicName.toLowerCase().replace(/\s+/g, '-')}-blueprint.xlsx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidTotal) {
      toast({
        title: "Invalid Difficulty Distribution",
        description: "The difficulty levels must add up to 100%",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    // Generate the blueprint
    const blueprint = generateBlueprint();
    
    setTimeout(() => {
      setIsCreating(false);
      setGeneratedBlueprint(blueprint);
      
      toast({
        title: "Blueprint Created!",
        description: "Your assessment blueprint has been generated.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Blueprint Specifications
          </CardTitle>
          <CardDescription>
            Define your assessment structure in a detailed format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Topic Name</Label>
                <Input 
                  value={formData.topicName}
                  onChange={(e) => handleChange('topicName', e.target.value)}
                  placeholder="e.g., JavaScript Fundamentals"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Number of Questions</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number"
                    min={1}
                    max={100}
                    value={formData.questionCount}
                    onChange={(e) => handleChange('questionCount', parseInt(e.target.value))}
                    required
                    className="w-24"
                  />
                  <Slider 
                    value={[formData.questionCount]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => handleChange('questionCount', value[0])}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleChange('experienceLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="flex items-center justify-between">
                  Difficulty Distribution
                  {!isValidTotal && (
                    <span className="text-xs text-destructive">
                      Must total 100%
                    </span>
                  )}
                </Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Easy</span>
                      <span>{formData.difficultyDistribution.easy}%</span>
                    </div>
                    <Slider
                      value={[formData.difficultyDistribution.easy]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleDifficultyChange('easy', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Medium</span>
                      <span>{formData.difficultyDistribution.medium}%</span>
                    </div>
                    <Slider
                      value={[formData.difficultyDistribution.medium]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleDifficultyChange('medium', value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hard</span>
                      <span>{formData.difficultyDistribution.hard}%</span>
                    </div>
                    <Slider
                      value={[formData.difficultyDistribution.hard]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleDifficultyChange('hard', value[0])}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleChange('difficultyDistribution', { easy: 33, medium: 34, hard: 33 })}
                  >
                    Balanced
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleChange('difficultyDistribution', { easy: 60, medium: 30, hard: 10 })}
                  >
                    Easy Focus
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleChange('difficultyDistribution', { easy: 10, medium: 30, hard: 60 })}
                  >
                    Hard Focus
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full button-glow flex items-center gap-2"
              disabled={isCreating || !isValidTotal}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Blueprint...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Blueprint
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedBlueprint && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between space-x-10">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <CardTitle>Generated Blueprint</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadBlueprint}
                className="flex items-center gap-2 min-w-[150px]"
              >
                <Download className="h-4 w-4" />
                Download Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Parameter</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Topic</TableCell>
                  <TableCell>{generatedBlueprint.topicName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Questions</TableCell>
                  <TableCell>{generatedBlueprint.questionCount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Experience Level</TableCell>
                  <TableCell className="capitalize">{generatedBlueprint.experienceLevel}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Separator className="my-6" />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Difficulty Level</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Questions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedBlueprint.questionDistribution.map((dist) => (
                  <TableRow key={dist.difficulty}>
                    <TableCell className="font-medium">{dist.difficulty}</TableCell>
                    <TableCell>
                      {generatedBlueprint.difficultyBreakdown[dist.difficulty.toLowerCase() as keyof typeof generatedBlueprint.difficultyBreakdown]}%
                    </TableCell>
                    <TableCell>{dist.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlueprintForm;
