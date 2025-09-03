import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { MessageCircle, Send, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load conversations
    const savedConversations = JSON.parse(localStorage.getItem(`conversations_${user.id}`) || '[]');
    setConversations(savedConversations);

    if (savedConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(savedConversations[0]);
    }
  }, [user.id, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      // Load messages for selected conversation
      const savedMessages = JSON.parse(localStorage.getItem(`messages_${selectedConversation.id}`) || '[]');
      setMessages(savedMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      conversationId: selectedConversation.id,
      senderId: user.id,
      senderName: user.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${selectedConversation.id}`, JSON.stringify(updatedMessages));

    // Update conversation last message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage.trim(),
          lastMessageTime: new Date().toISOString()
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedConversations));

    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantNames.some(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getOtherParticipant = (conversation) => {
    const otherParticipantIndex = conversation.participants.findIndex(id => id !== user.id);
    return {
      id: conversation.participants[otherParticipantIndex],
      name: conversation.participantNames[otherParticipantIndex]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>Mensajes - ServiMarket</title>
        <meta name="description" content="Chatea con profesionales y clientes en ServiMarket" />
        <meta property="og:title" content="Mensajes - ServiMarket" />
        <meta property="og:description" content="Comunicación directa con profesionales verificados" />
      </Helmet>

      <Header title="Mensajes" />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-xl p-4 overflow-hidden flex flex-col"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Conversaciones</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No tienes conversaciones</p>
                  <p className="text-sm text-gray-400">
                    Inicia una conversación desde el perfil de un profesional
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant.name}`} 
                            alt={otherParticipant.name} 
                          />
                          <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {otherParticipant.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage || 'Nueva conversación'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(conversation.lastMessageTime).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-effect rounded-xl overflow-hidden flex flex-col"
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getOtherParticipant(selectedConversation).name}`} 
                        alt={getOtherParticipant(selectedConversation).name} 
                      />
                      <AvatarFallback>
                        {getOtherParticipant(selectedConversation).name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getOtherParticipant(selectedConversation).name}
                      </h3>
                      <p className="text-sm text-green-600">En línea</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "🚧 Esta función no está implementada aún",
                          description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                        });
                      }}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "🚧 Esta función no está implementada aún",
                          description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                        });
                      }}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "🚧 Esta función no está implementada aún",
                          description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀"
                        });
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500">No hay mensajes aún</p>
                      <p className="text-sm text-gray-400">
                        Envía el primer mensaje para iniciar la conversación
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`chat-bubble p-3 rounded-lg max-w-xs lg:max-w-md ${
                            message.senderId === user.id
                              ? 'sent bg-blue-500 text-white'
                              : 'received bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="message-input"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Selecciona una conversación
                  </h3>
                  <p className="text-gray-500">
                    Elige una conversación para comenzar a chatear
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}