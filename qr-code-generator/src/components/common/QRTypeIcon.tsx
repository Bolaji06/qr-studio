import {
  Briefcase,
  Camera,
  Contact,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Share2,
  Wifi,
} from 'lucide-react';
import type { QRCodeType } from '../../types';

interface QRTypeIconProps {
  type: QRCodeType;
  className?: string;
}

export function QRTypeIcon({ type, className = 'h-4 w-4' }: QRTypeIconProps) {
  switch (type) {
    case 'url':
      return <Globe className={className} />;
    case 'text':
      return <FileText className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'phone':
      return <Phone className={className} />;
    case 'sms':
      return <MessageSquare className={className} />;
    case 'wifi':
      return <Wifi className={className} />;
    case 'vcard':
      return <Contact className={className} />;
    case 'whatsapp':
      return <MessageCircle className={className} />;
    case 'instagram':
      return <Camera className={className} />;
    case 'facebook':
      return <Share2 className={className} />;
    case 'linkedin':
      return <Briefcase className={className} />;
    case 'location':
      return <MapPin className={className} />;
  }
}
