
import { useState, useCallback } from 'react';
import type { TicketData } from '@/pages/HelpSupport';

// Mock data for demonstration
const mockTickets: TicketData[] = [
  {
    id: 'TKT001',
    email: 'user@example.com',
    subject: 'Unable to access dashboard',
    description: 'I am unable to access my dashboard after the recent update. Getting a 404 error when I try to navigate to the dashboard page.',
    priority: 'High',
    status: 'Active',
    createdAt: new Date('2024-01-15T10:30:00'),
    lastMessage: 'We are investigating this issue and will get back to you soon.',
    messages: [
      {
        id: 'msg1',
        content: 'I am unable to access my dashboard after the recent update. Getting a 404 error when I try to navigate to the dashboard page.',
        sender: 'user',
        timestamp: new Date('2024-01-15T10:30:00')
      },
      {
        id: 'msg2',
        content: 'Thank you for reporting this issue. We are investigating this problem and will get back to you soon with a solution.',
        sender: 'admin',
        timestamp: new Date('2024-01-15T11:00:00')
      }
    ]
  },
  {
    id: 'TKT002',
    email: 'user@example.com',
    subject: 'Feature request: Dark mode',
    description: 'Would it be possible to add a dark mode option to the interface? It would be very helpful for users who work during night hours.',
    priority: 'Low',
    status: 'Waiting',
    createdAt: new Date('2024-01-14T14:20:00'),
    lastMessage: 'Thanks for the suggestion! We\'ll consider this for our next update.',
    messages: [
      {
        id: 'msg3',
        content: 'Would it be possible to add a dark mode option to the interface? It would be very helpful for users who work during night hours.',
        sender: 'user',
        timestamp: new Date('2024-01-14T14:20:00')
      },
      {
        id: 'msg4',
        content: 'Thanks for the suggestion! We\'ll consider this for our next update.',
        sender: 'admin',
        timestamp: new Date('2024-01-14T15:00:00')
      }
    ]
  }
];

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketData[]>(mockTickets);

  const addTicket = useCallback((ticketData: Omit<TicketData, 'id' | 'status' | 'createdAt' | 'messages'>) => {
    const newTicket: TicketData = {
      ...ticketData,
      id: `TKT${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: 'Waiting',
      createdAt: new Date(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          content: ticketData.description,
          sender: 'user',
          timestamp: new Date()
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  }, []);

  const addMessage = useCallback((ticketId: string, content: string, sender: 'user' | 'admin') => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender,
      timestamp: new Date()
    };

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          lastMessage: content,
          status: sender === 'user' && ticket.status === 'Waiting' ? 'Active' as const : ticket.status
        };
        return updatedTicket;
      }
      return ticket;
    }));

    return newMessage;
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketData['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status } : ticket
    ));
  }, []);

  const getTicketById = useCallback((ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId);
  }, [tickets]);

  return {
    tickets,
    addTicket,
    addMessage,
    updateTicketStatus,
    getTicketById
  };
};
