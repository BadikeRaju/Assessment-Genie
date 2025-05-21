
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  Briefcase
} from 'lucide-react';

const BlueprintForm = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    topicName: '',
    jobDescription: '',
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
    
  // Track if the total is valid
  const [isValidTotal, setIsValidTotal] = useState(true);
  
  useEffect(() => {
    // Check if total difficulty adds up to 100%
    setIsValidTotal(totalDifficultyPercentage === 100);
  }, [totalDifficultyPercentage]);

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const handleChange = (field: string, value: string | number | string[] | Record<string, any>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!isValidTotal) {
      toast({
        title: "Invalid Difficulty Distribution",
        description: "The difficulty levels must add up to 100%",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    setTimeout(() => {
      setIsCreating(false);
      
      toast({
        title: "Blueprint Created!",
        description: `Created blueprint for ${formData.questionCount} ${formData.experienceLevel} level questions on ${formData.topicName}`,
      });
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Blueprint Creator
        </CardTitle>
        <CardDescription>
          Define the structure and parameters for your customized assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-medium">Assessment Settings</h3>
            </div>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="topic-name">Topic Name</Label>
              <Input 
                id="topic-name"
                placeholder="e.g., JavaScript Fundamentals" 
                value={formData.topicName}
                onChange={(e) => handleChange('topicName', e.target.value)}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-count">Number of Questions</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="question-count"
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

            <div className="space-y-2">
              <Label htmlFor="experience-level">Experience Level</Label>
              <Select 
                value={formData.experienceLevel}
                onValueChange={(value) => handleChange('experienceLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <Label htmlFor="job-description" className="text-lg font-medium">Job Description</Label>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Add a job description to tailor the assessment to specific role requirements
              </p>
              <Textarea 
                id="job-description"
                placeholder="Enter the job description or role requirements here..."
                value={formData.jobDescription}
                onChange={(e) => handleChange('jobDescription', e.target.value)}
                className="min-h-[120px] resize-y"
              />
            </div>

            <div className="space-y-4">
              <Label>Difficulty Distribution ({totalDifficultyPercentage}%)</Label>
              <div className={`text-sm ${!isValidTotal ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isValidTotal ? 
                  "Adjust the percentage for each difficulty level. Total must be 100%." :
                  `Current total: ${totalDifficultyPercentage}%. Please adjust to equal 100%.`
                }
              </div>
              
              <div className="grid gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Easy: {formData.difficultyDistribution.easy}%</Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDifficultyChange('easy', Math.max(0, formData.difficultyDistribution.easy - 5))}
                      >-</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDifficultyChange('easy', Math.min(100, formData.difficultyDistribution.easy + 5))}
                      >+</Button>
                    </div>
                  </div>
                  <Slider 
                    value={[formData.difficultyDistribution.easy]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => handleDifficultyChange('easy', value[0])}
                    className={`${!isValidTotal ? 'bg-opacity-50' : ''}`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Medium: {formData.difficultyDistribution.medium}%</Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDifficultyChange('medium', Math.max(0, formData.difficultyDistribution.medium - 5))}
                      >-</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDifficultyChange('medium', Math.min(100, formData.difficultyDistribution.medium + 5))}
                      >+</Button>
                    </div>
                  </div>
                  <Slider 
                    value={[formData.difficultyDistribution.medium]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => handleDifficultyChange('medium', value[0])}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Hard: {formData.difficultyDistribution.hard}%</Label>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDifficultyChange('hard', Math.max(0, formData.difficultyDistribution.hard - 5))}
                      >-</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDifficultyChange('hard', Math.min(100, formData.difficultyDistribution.hard + 5))}
                      >+</Button>
                    </div>
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

              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleChange('difficultyDistribution', { easy: 33, medium: 34, hard: 33 })}
                  className="text-xs"
                >
                  Balanced
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleChange('difficultyDistribution', { easy: 60, medium: 30, hard: 10 })}
                  className="text-xs"
                >
                  Easy Focus
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleChange('difficultyDistribution', { easy: 10, medium: 30, hard: 60 })}
                  className="text-xs"
                >
                  Hard Focus
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlueprintForm;
