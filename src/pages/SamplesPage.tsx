
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import SamplesRequest from '@/components/samples/SamplesRequest';
import SamplesUpload from '@/components/samples/SamplesUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const SamplesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <PageLayout 
      title="Sample Questions" 
      description="Browse, request and manage sample questions for various topics"
      showHero={true}
    >
      <div className="max-w-5xl mx-auto">
        {isAdmin ? (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="request">View Requests</TabsTrigger>
              <TabsTrigger value="upload">Upload Samples</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[700px]">
              <TabsContent value="request" className="w-full mt-0">
                <SamplesRequest />
              </TabsContent>
              
              <TabsContent value="upload" className="w-full mt-0">
                <SamplesUpload />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="animate-fade-in">
            <SamplesRequest />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SamplesPage;
