import { useRef, useEffect, useState } from "react";
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Phone,
  Video,
  Search,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Music,
  MapPin,
  User,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/whatsapp/useMessages";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

type Props = {
  conversationId: string;
  selectedConversation?: {
    phone: string;
    name: string;
    last_message: string;
    last_timestamp: string;
    message_count: number;
    direction: 'incoming' | 'outgoing';
  };
  isMobile?: boolean;
  onBack?: () => void;
};

type AttachmentType = 'image' | 'video' | 'document' | 'audio' | 'camera' | 'contact' | 'location';

const attachmentOptions = [
  {
    type: 'image' as AttachmentType,
    label: 'Photos',
    icon: ImageIcon,
    accept: 'image/*',
    color: 'from-pink-500 to-rose-600',
  },
  {
    type: 'video' as AttachmentType,
    label: 'Videos',
    icon: Video,
    accept: 'video/*',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    type: 'document' as AttachmentType,
    label: 'Document',
    icon: FileText,
    accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    type: 'audio' as AttachmentType,
    label: 'Audio',
    icon: Music,
    accept: 'audio/*',
    color: 'from-orange-500 to-amber-600',
  },
  {
    type: 'camera' as AttachmentType,
    label: 'Camera',
    icon: Camera,
    accept: 'image/*',
    color: 'from-red-500 to-pink-600',
  },
  {
    type: 'contact' as AttachmentType,
    label: 'Contact',
    icon: User,
    accept: '',
    color: 'from-green-500 to-emerald-600',
  },
  {
    type: 'location' as AttachmentType,
    label: 'Location',
    icon: MapPin,
    accept: '',
    color: 'from-teal-500 to-cyan-600',
  },
];

export const ChatWindow = ({ conversationId, selectedConversation, isMobile, onBack }: Props) => {
  const { messages, isLoading, error, sendMessage, isSending } = useMessages(selectedConversation?.phone || null);
  
  const transformedMessages = messages.map(msg => ({
    from: msg.direction === 'outgoing' ? 'me' : 'them',
    text: msg.text,
    time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: msg.direction === 'outgoing' ? 'read' : undefined
  }));
  
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [input, setInput] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  
  // Location dialog state
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Contact dialog state
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // File preview state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const handleEmojiSelect = (emoji: any) => {
    setInput((prevInput) => prevInput + emoji.native);
    setIsEmojiPickerOpen(false);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
        setLocationLoading(false);
      }
    );
  };

  const handleSendLocation = async () => {
    if (currentLocation) {
      const locationMessage = `📍 Location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
      try {
        await sendMessage(locationMessage);
        setIsLocationDialogOpen(false);
        setCurrentLocation(null);
      } catch (error) {
        console.error('Failed to send location:', error);
      }
    }
  };

  const handleSendContact = async () => {
    if (contactName.trim() && contactPhone.trim()) {
      const contactMessage = `👤 Contact:\nName: ${contactName}\nPhone: ${contactPhone}`;
      try {
        await sendMessage(contactMessage);
        setIsContactDialogOpen(false);
        setContactName("");
        setContactPhone("");
      } catch (error) {
        console.error('Failed to send contact:', error);
      }
    }
  };

  const handleAttachmentClick = (type: AttachmentType) => {
    if (type === 'contact') {
      setIsContactDialogOpen(true);
      setIsAttachmentMenuOpen(false);
      return;
    }
    
    if (type === 'location') {
      setIsLocationDialogOpen(true);
      handleGetLocation();
      setIsAttachmentMenuOpen(false);
      return;
    }

    // For file types, trigger the corresponding file input
    const inputRef = fileInputRefs.current[type];
    if (inputRef) {
      inputRef.click();
      setIsAttachmentMenuOpen(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: AttachmentType) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      
      // Create preview for images
      if (type === 'image' || type === 'camera') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(fileArray[0]);
      }
      
      // Here you would typically upload the file to your server
      console.log(`Selected ${type}:`, fileArray);
      
      // Example: Send file info as message (you'd replace this with actual file upload)
      const fileNames = fileArray.map(f => f.name).join(', ');
      const fileMessage = `📎 ${type === 'image' ? '🖼️' : type === 'video' ? '🎥' : type === 'document' ? '📄' : '🎵'} ${fileNames}`;
      
      try {
        await sendMessage(fileMessage);
        setSelectedFiles([]);
        setFilePreviewUrl(null);
      } catch (error) {
        console.error('Failed to send file:', error);
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const messageText = input.trim();
    setInput("");

    try {
      await sendMessage(messageText);
    } catch (error) {
      setInput(messageText);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transformedMessages.length]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f1419]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1c2333] border-b border-[#2d3748] shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hover:bg-[#2d3748] text-gray-400 hover:text-white"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src="" alt={selectedConversation?.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
              {selectedConversation?.name ? getInitials(selectedConversation.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">
              {selectedConversation?.name || conversationId}
            </h2>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="hover:bg-[#2d3748] h-9 w-9">
            <Video className="h-[18px] w-[18px] text-gray-400 hover:text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#2d3748] h-9 w-9">
            <Phone className="h-[18px] w-[18px] text-gray-400 hover:text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#2d3748] h-9 w-9">
            <Search className="h-[18px] w-[18px] text-gray-400 hover:text-white" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-[#2d3748] h-9 w-9">
                <MoreVertical className="h-[18px] w-[18px] text-gray-400 hover:text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1c2333] border-[#2d3748]">
              <DropdownMenuItem className="text-gray-300 focus:bg-[#2d3748] focus:text-white cursor-pointer">
                Contact info
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-[#2d3748] focus:text-white cursor-pointer">
                Select messages
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-[#2d3748] focus:text-white cursor-pointer">
                Mute notifications
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-[#2d3748] focus:text-white cursor-pointer">
                Clear messages
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 focus:bg-[#2d3748] focus:text-red-400 cursor-pointer">
                Delete chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
          backgroundColor: '#0f1419'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-400">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-[#1c2333] rounded-lg p-6 border border-red-500/20">
              <div className="text-red-400 mb-2 text-2xl">⚠️</div>
              <p className="text-sm font-medium text-red-400 mb-1">Failed to load messages</p>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          </div>
        ) : transformedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-sm text-gray-400">Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          <>
            {transformedMessages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.from === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "relative max-w-[75%] sm:max-w-[65%] rounded-2xl px-3 py-2 shadow-lg",
                    msg.from === "me"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md"
                      : "bg-[#1c2333] text-gray-100 rounded-bl-md border border-[#2d3748]"
                  )}
                >
                  <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                  <div className={cn(
                    "flex items-center justify-end gap-1 mt-1 text-[10px]",
                    msg.from === "me" ? "text-blue-100" : "text-gray-500"
                  )}>
                    <span>{msg.time}</span>
                    {msg.from === "me" && msg.status && (
                      <CheckCheck className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-[#1c2333] border-t border-[#2d3748] shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Attachment Menu */}
          <Popover open={isAttachmentMenuOpen} onOpenChange={setIsAttachmentMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-[#2d3748] h-10 w-10 text-gray-400 hover:text-white shrink-0"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-4 bg-[#1c2333] border border-[#2d3748]" 
              align="start" 
              side="top"
              sideOffset={10}
            >
              <div className="grid grid-cols-3 gap-4">
                {attachmentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.type}>
                      <button
                        type="button"
                        onClick={() => handleAttachmentClick(option.type)}
                        className="flex flex-col items-center gap-2 w-full group"
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                          option.color
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                      </button>
                      {/* Hidden file inputs for each type */}
                      {option.accept && (
                        <input
                          ref={(el) => (fileInputRefs.current[option.type] = el)}
                          type="file"
                          accept={option.accept}
                          className="hidden"
                          onChange={(e) => handleFileChange(e, option.type)}
                          multiple={option.type === 'image' || option.type === 'video'}
                          capture={option.type === 'camera' ? 'environment' : undefined}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Input Container */}
          <div className="flex-1 relative flex items-center bg-[#0f1419] rounded-full overflow-hidden border border-[#2d3748]">
            <Input
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2.5 text-[14px] h-10"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            
            {/* Emoji Picker */}
            <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-[#2d3748] rounded-full mr-1 h-8 w-8 text-gray-400 hover:text-white"
                >
                  <Smile className="h-[18px] w-[18px]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-full p-0 border-0 bg-transparent shadow-2xl" 
                align="end" 
                side="top"
                sideOffset={10}
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="dark"
                  previewPosition="none"
                  skinTonePosition="none"
                  searchPosition="top"
                  perLine={8}
                  maxFrequentRows={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Send/Mic Button */}
          <Button
            type={input.trim() ? "submit" : "button"}
            size="icon"
            disabled={isSending}
            className={cn(
              "shrink-0 rounded-full h-10 w-10 shadow-lg transition-all",
              input.trim() 
                ? "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                : "bg-[#2d3748] hover:bg-[#374151] text-gray-400"
            )}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : input.trim() ? (
              <Send className="h-[18px] w-[18px]" />
            ) : (
              <Mic className="h-[18px] w-[18px]" />
            )}
          </Button>
        </form>
      </div>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="bg-[#1c2333] border-[#2d3748] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-400" />
              Share Location
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your current location with this contact
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {locationLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                <span className="ml-3 text-gray-400">Getting your location...</span>
              </div>
            ) : currentLocation ? (
              <div className="bg-[#0f1419] rounded-lg p-4 border border-[#2d3748]">
                <p className="text-sm text-gray-300 mb-2">📍 Current Location:</p>
                <p className="text-xs text-gray-400 font-mono">
                  Lat: {currentLocation.lat.toFixed(6)}<br />
                  Lng: {currentLocation.lng.toFixed(6)}
                </p>
                
                  <a
                    href={`https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 underline mt-2 inline-block"
                  >
                    View on Google Maps
                  </a>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Unable to get location</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLocationDialogOpen(false)}
              className="bg-transparent border-[#2d3748] text-gray-300 hover:bg-[#2d3748]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendLocation}
              disabled={!currentLocation}
              className="bg-gradient-to-br from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800"
            >
              Send Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="bg-[#1c2333] border-[#2d3748] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" />
              Share Contact
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share a contact with this conversation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Contact Name</label>
              <Input
                placeholder="John Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="bg-[#0f1419] border-[#2d3748] text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Phone Number</label>
              <Input
                placeholder="+1 234 567 8900"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="bg-[#0f1419] border-[#2d3748] text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsContactDialogOpen(false);
                setContactName("");
                setContactPhone("");
              }}
              className="bg-transparent border-[#2d3748] text-gray-300 hover:bg-[#2d3748]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendContact}
              disabled={!contactName.trim() || !contactPhone.trim()}
              className="bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              Send Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};