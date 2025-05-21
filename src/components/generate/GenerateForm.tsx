
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  FileDown, 
  FileText, 
  FileSpreadsheet, 
  FlaskConical,
  FilePlus2,
  Loader2
} from 'lucide-react';

const topicOptions = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "Literature",
  "Language Arts",
  "Economics"
];

const GenerateForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    topic: '',
    questionCount: 10,
  });
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('generate');
  
  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic) {
      toast({
        title: "Topic Required",
        description: "Please select a topic to generate questions",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setProgress(0);
    
    // Simulate progressive loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Generate mock questions
      const generatedQuestions = Array.from({ length: formData.questionCount }, (_, i) => 
        `Q${i + 1}: What are the key principles of ${formData.topic} in relation to ${['practical applications', 'theoretical frameworks', 'historical developments', 'modern interpretations'][Math.floor(Math.random() * 4)]}?`
      );
      
      setQuestions(generatedQuestions);
      setLoading(false);
      setActiveTab('preview');
      
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${formData.questionCount} questions for ${formData.topic}`,
      });
    }, 4000);
  };

  const handleExport = (format: 'json' | 'excel' | 'word') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Your questions are being prepared for download in ${format} format.`
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${format.toUpperCase()} file is ready for download.`
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" disabled={loading}>Generate</TabsTrigger>
          <TabsTrigger value="preview" disabled={questions.length === 0}>Preview & Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="mt-4">
          <Card className="w-full animate-scale-in">
            <CardHeader>
              <CardTitle>Generate AI Questions</CardTitle>
              <CardDescription>
                Create AI-powered questions based on your specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateQuestions} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select 
                    value={formData.topic} 
                    onValueChange={(value) => handleChange('topic', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topicOptions.map((topic) => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-count">Number of Questions</Label>
                  <Input 
                    id="question-count"
                    type="number" 
                    min={1}
                    max={50}
                    value={formData.questionCount}
                    onChange={(e) => handleChange('questionCount', parseInt(e.target.value))}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full button-glow"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Generate Questions
                    </>
                  )}
                </Button>
                
                {loading && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Processing</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>
                Preview your questions and export them in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={index} className="py-3 border-b last:border-0">
                      <p className={`text-sm ${index % 2 === 0 ? 'text-foreground' : 'text-foreground/90'}`}>
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Button 
                variant="outline" 
                className="flex gap-2"
                onClick={() => handleExport('json')}
              >
                <FileText className="h-4 w-4" />
                Export as JSON
              </Button>
              <Button 
                variant="outline" 
                className="flex gap-2"
                onClick={() => handleExport('excel')}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export as Excel
              </Button>
              <Button 
                variant="default" 
                className="flex gap-2"
                onClick={() => handleExport('word')}
              >
                <FileDown className="h-4 w-4" />
                Export as Word
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerateForm;
