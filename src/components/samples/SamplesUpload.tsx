
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const SamplesUpload = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !topic) {
      toast({
        title: "Missing Information",
        description: "Please provide both a topic name and a file",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setTopic('');
      
      toast({
        title: "Upload Successful",
        description: `Samples for ${topic} have been uploaded`,
      });
    }, 1500);
  };

  return (
    <Card className="w-full animate-scale-in">
      <CardHeader>
        <CardTitle>Upload Samples</CardTitle>
        <CardDescription>
          Admin area to upload sample questions for specific topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic-name">Topic Name</Label>
            <Input 
              id="topic-name"
              placeholder="e.g., Organic Chemistry" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sample-file">Upload Sample Questions</Label>
            <div className="border-2 border-dashed border-input rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Input 
                id="sample-file"
                type="file" 
                onChange={handleFileChange} 
                className="hidden"
                accept=".xlsx,.xls,.csv,.docx,.doc"
              />
              <Label htmlFor="sample-file" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Click to upload file"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Supported formats: Excel, CSV, Word (max 10MB)
                </span>
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !file || !topic}
            className="w-full button-glow"
          >
            {isUploading ? "Uploading..." : "Upload Samples"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          Admin access only
        </p>
      </CardFooter>
    </Card>
  );
};

export default SamplesUpload;
