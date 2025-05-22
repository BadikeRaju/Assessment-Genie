import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface TopicRequest {
  id: string;
  topic: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const TopicRequests = () => {
  const { toast } = useToast();
  // Mock data - replace with API call in production
  const [requests, setRequests] = useState<TopicRequest[]>([
    {
      id: '1',
      topic: 'Machine Learning',
      description: 'Need questions about AI and ML fundamentals',
      status: 'pending',
      createdAt: new Date()
    },
    // Add more mock data as needed
  ]);

  const handleStatusChange = (requestId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return { ...request, status: newStatus };
      }
      return request;
    }));

    toast({
      title: "Status Updated",
      description: `Request status has been updated to ${newStatus}`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Requests</CardTitle>
        <CardDescription>
          Review and manage topic requests from users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Requested On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.topic}</TableCell>
                <TableCell>{request.description}</TableCell>
                <TableCell>{request.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    value={request.status}
                    onValueChange={(value: 'pending' | 'approved' | 'rejected') => 
                      handleStatusChange(request.id, value)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopicRequests;