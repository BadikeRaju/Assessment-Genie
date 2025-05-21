
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import GenerateForm from '@/components/generate/GenerateForm';
import { useAuth } from '@/contexts/AuthContext';

const GeneratePage = () => {
  const { user } = useAuth();
  
  return (
    <PageLayout 
      title="Generate Questions" 
      description={`Create AI-powered questions tailored to your specifications${user?.role === 'admin' ? ' with advanced controls' : ''}`}
      showHero={true}
    >
      <div className="max-w-4xl mx-auto animate-fade-in">
        <GenerateForm />
      </div>
    </PageLayout>
  );
};

export default GeneratePage;
