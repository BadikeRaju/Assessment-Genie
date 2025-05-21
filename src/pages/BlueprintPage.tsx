
import React from 'react';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import BlueprintForm from '@/components/blueprint/BlueprintForm';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';

const BlueprintPage = () => {
  const { user } = useAuth();
  
  // Redirect admins to samples page
  if (user?.role === 'admin') {
    return <Navigate to="/samples" replace />;
  }
  
  return (
    <PageLayout 
      title="Blueprint Creator" 
      description="Define the structure and parameters for your quiz or assessment"
      showHero={true}
    >
      <div className="w-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-6xl mx-auto rounded-lg border"
        >
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <BlueprintForm />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full flex-col gap-4 p-6 bg-muted/30">
              <h3 className="text-lg font-medium">Blueprint Tips</h3>
              <div className="space-y-4 text-sm">
                <div className="rounded-md bg-muted/50 p-4">
                  <h4 className="font-medium mb-1">Job Description</h4>
                  <p className="text-sm text-muted-foreground">
                    Include detailed job requirements to generate more relevant assessment questions.
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 p-4">
                  <h4 className="font-medium mb-1">Experience Levels</h4>
                  <p className="text-sm text-muted-foreground">
                    Match the experience level with your target audience for better results.
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 p-4">
                  <h4 className="font-medium mb-1">Difficulty Balance</h4>
                  <p className="text-sm text-muted-foreground">
                    A good assessment typically includes a range of difficulty levels.
                  </p>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </PageLayout>
  );
};

export default BlueprintPage;
