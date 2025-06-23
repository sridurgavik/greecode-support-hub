
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Ticket, HelpCircle } from 'lucide-react';
import { RaiseTicketForm } from '@/components/help-support/RaiseTicketForm';
import { TicketList } from '@/components/help-support/TicketList';
import { ChatInterface } from '@/components/help-support/ChatInterface';
import { useTickets } from '@/hooks/useTickets';

export interface TicketData {
  id: string;
  email: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Waiting' | 'Active' | 'Resolved';
  createdAt: Date;
  lastMessage?: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'admin';
    timestamp: Date;
  }>;
}

const HelpSupport = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const { tickets, addTicket, addMessage, updateTicketStatus } = useTickets();

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  const handleTicketSelect = (ticket: TicketData) => {
    setSelectedTicket(ticket);
  };

  const handleTicketSubmit = (ticketData: Omit<TicketData, 'id' | 'status' | 'createdAt' | 'messages'>) => {
    addTicket(ticketData);
  };

  const handleSendMessage = (content: string) => {
    if (selectedTicket) {
      addMessage(selectedTicket.id, content, 'user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Greecode</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Help & Support
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTicket ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Tickets</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Badge variant={selectedTicket.status === 'Resolved' ? 'default' : 
                               selectedTicket.status === 'Active' ? 'destructive' : 'secondary'}>
                  {selectedTicket.status}
                </Badge>
                <span className="text-sm text-gray-500">#{selectedTicket.id}</span>
              </div>
            </div>
            <ChatInterface
              ticket={selectedTicket}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <Card className="bg-white shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center space-x-2">
                <Ticket className="w-5 h-5" />
                <span>Support Center</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="raise-ticket" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="raise-ticket" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Raise Tickets</span>
                  </TabsTrigger>
                  <TabsTrigger value="active-tickets" className="flex items-center space-x-2">
                    <Ticket className="w-4 h-4" />
                    <span>Active Tickets ({tickets.length})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="raise-ticket">
                  <RaiseTicketForm onSubmit={handleTicketSubmit} />
                </TabsContent>

                <TabsContent value="active-tickets">
                  <TicketList
                    tickets={tickets}
                    onTicketSelect={handleTicketSelect}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
